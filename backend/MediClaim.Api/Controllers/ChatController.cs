using System.Security.Claims;
using MediClaim.Api.Contracts.Chat;
using MediClaim.Application.Chat;
using MediClaim.Domain.Entities;
using MediClaim.Infrastructure.Data;
using MediClaim.Infrastructure.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediClaim.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly MediClaimDbContext _db;
    private readonly SimpleChunkSearchService _chunkSearchService;
    private readonly AiAnswerService _aiAnswerService;
    private readonly EmbeddingService _embeddingService;
    private readonly VectorSearchService _vectorSearchService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(
        MediClaimDbContext db,
        SimpleChunkSearchService chunkSearchService,
        AiAnswerService aiAnswerService,
        EmbeddingService embeddingService,
        VectorSearchService vectorSearchService,
        ILogger<ChatController> logger)
    {
        _db = db;
        _chunkSearchService = chunkSearchService;
        _aiAnswerService = aiAnswerService;
        _embeddingService = embeddingService;
        _vectorSearchService = vectorSearchService;
        _logger = logger;
    }

    [HttpPost("ask")]
    public async Task<ActionResult<AskQuestionResponse>> Ask(AskQuestionRequest request)
    {
        var userId = GetCurrentUserId();

        var document = await _db.Documents
            .Include(document => document.Chunks)
            .FirstOrDefaultAsync(document =>
                document.Id == request.DocumentId &&
                document.UserId == userId);

        if (document is null)
            return NotFound("Document not found.");

        if (string.IsNullOrWhiteSpace(request.Question))
            return BadRequest("Question cannot be empty.");

        List<DocumentChunk> matchedChunks;

        // Use vector search if embeddings exist, otherwise fall back to keyword
        var hasEmbeddings = document.Chunks.Any(c => c.Embedding != null);
        if (hasEmbeddings)
        {
            try
            {
                var queryEmbedding = await _embeddingService.EmbedAsync(request.Question);
                matchedChunks = await _vectorSearchService.SearchAsync(queryEmbedding, document.Id, topK: 5);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning(ex, "Embedding request failed; falling back to keyword search.");
                matchedChunks = _chunkSearchService.Search(request.Question, document.Chunks.ToList());
            }
        }
        else
        {
            matchedChunks = _chunkSearchService.Search(request.Question, document.Chunks.ToList());
        }

        if (matchedChunks.Count == 0)
        {
            return Ok(new AskQuestionResponse(
                "I could not find enough relevant information in this document to answer the question.",
                new List<SourceChunkResponse>()
            ));
        }

        var context = string.Join("\n\n", matchedChunks.Select(chunk =>
            $"Chunk {chunk.ChunkIndex}: {chunk.Content}"));

        string answer;
        try
        {
            answer = await _aiAnswerService.GenerateAnswerAsync(request.Question, context);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "AI answer generation failed.");
            return StatusCode(StatusCodes.Status502BadGateway,
                "The AI service is currently unavailable. Please try again later.");
        }

        var chatHistory = new ChatHistory
        {
            UserId = userId,
            DocumentId = document.Id,
            Question = request.Question,
            Answer = answer
        };

        _db.ChatHistory.Add(chatHistory);
        await _db.SaveChangesAsync();

        var sources = matchedChunks
            .Select(chunk => new SourceChunkResponse(
                chunk.Id,
                chunk.ChunkIndex,
                chunk.SourcePage,
                chunk.Content.Length > 600
                    ? chunk.Content[..600] + "..."
                    : chunk.Content
            ))
            .ToList();

        return Ok(new AskQuestionResponse(answer, sources));
    }

    private Guid GetCurrentUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdValue))
            throw new UnauthorizedAccessException("User ID was not found in token.");
        return Guid.Parse(userIdValue);
    }

    [HttpGet("history/{documentId:guid}")]
    public async Task<ActionResult<List<ChatHistoryResponse>>> GetHistory(Guid documentId)
    {
        var userId = GetCurrentUserId();

        var documentExists = await _db.Documents.AnyAsync(document =>
            document.Id == documentId && document.UserId == userId);

        if (!documentExists)
            return NotFound("Document not found.");

        var history = await _db.ChatHistory
            .Where(chat => chat.UserId == userId && chat.DocumentId == documentId)
            .OrderBy(chat => chat.CreatedAt)
            .Select(chat => new ChatHistoryResponse(
                chat.Id,
                documentId,
                chat.Question,
                chat.Answer,
                chat.CreatedAt
            ))
            .ToListAsync();

        return Ok(history);
    }
}
