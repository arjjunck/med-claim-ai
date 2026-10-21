using System.Security.Claims;
using MediClaim.Application.Chat;
using MediClaim.Application.Documents;
using MediClaim.Domain.Entities;
using MediClaim.Infrastructure.Data;
using MediClaim.Infrastructure.Documents;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediClaim.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly MediClaimDbContext _db;
    private readonly PdfTextExtractor _pdfTextExtractor;
    private readonly TextChunker _textChunker;
    private readonly EmbeddingService _embeddingService;

    public DocumentsController(
        MediClaimDbContext db,
        PdfTextExtractor pdfTextExtractor,
        TextChunker textChunker,
        EmbeddingService embeddingService)
    {
        _db = db;
        _pdfTextExtractor = pdfTextExtractor;
        _textChunker = textChunker;
        _embeddingService = embeddingService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file.Length == 0)
            return BadRequest("Uploaded file is empty.");

        if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Only PDF files are supported.");

        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue))
            return Unauthorized("User ID was not found in token.");

        var userId = Guid.Parse(userIdValue);

        await using var stream = file.OpenReadStream();
        var extractedText = _pdfTextExtractor.ExtractText(stream);

        if (string.IsNullOrWhiteSpace(extractedText))
            return BadRequest("No readable text could be extracted from the PDF.");

        var chunks = _textChunker.Chunk(extractedText);

        // Generate embeddings for all chunks in one batch call
        var embeddings = await _embeddingService.EmbedBatchAsync(chunks);

        var document = new UploadedDocument
        {
            UserId = userId,
            FileName = file.FileName,
            DocumentType = "Policy",
            Chunks = chunks.Select((content, index) => new DocumentChunk
            {
                ChunkIndex = index + 1,
                Content = content,
                SourcePage = "Unknown",
                Embedding = embeddings[index]
            }).ToList()
        };

        _db.Documents.Add(document);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            document.Id,
            document.FileName,
            document.UploadedAt,
            ChunkCount = document.Chunks.Count,
            Preview = document.Chunks.FirstOrDefault()?.Content
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetMyDocuments()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue))
            return Unauthorized("User ID was not found in token.");

        var userId = Guid.Parse(userIdValue);

        var documents = await _db.Documents
            .Where(document => document.UserId == userId)
            .OrderByDescending(document => document.UploadedAt)
            .Select(document => new
            {
                document.Id,
                document.FileName,
                document.DocumentType,
                document.UploadedAt,
                ChunkCount = document.Chunks.Count
            })
            .ToListAsync();

        return Ok(documents);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDocumentById(Guid id)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue))
            return Unauthorized("User ID was not found in token.");

        var userId = Guid.Parse(userIdValue);

        var document = await _db.Documents
            .Where(document => document.Id == id && document.UserId == userId)
            .Select(document => new
            {
                document.Id,
                document.FileName,
                document.DocumentType,
                document.UploadedAt,
                ChunkCount = document.Chunks.Count,
                Chunks = document.Chunks
                    .OrderBy(chunk => chunk.ChunkIndex)
                    .Take(5)
                    .Select(chunk => new
                    {
                        chunk.Id,
                        chunk.ChunkIndex,
                        chunk.SourcePage,
                        chunk.Content
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (document is null)
            return NotFound("Document not found.");

        return Ok(document);
    }
}
