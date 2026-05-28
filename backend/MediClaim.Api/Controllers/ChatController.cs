using System.Security.Claims;
using MediClaim.Api.Contracts.Chat;
using MediClaim.Application.Chat;
using MediClaim.Domain.Entities;
using MediClaim.Infrastructure.Data;
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

    public ChatController(
    MediClaimDbContext db,
    SimpleChunkSearchService chunkSearchService,
    AiAnswerService aiAnswerService)
    {
        _db = db;
        _chunkSearchService = chunkSearchService;
        _aiAnswerService = aiAnswerService;
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
        {
            return NotFound("Document not found.");
        }

        if (string.IsNullOrWhiteSpace(request.Question))
        {
            return BadRequest("Question cannot be empty.");
        }

        var matchedChunks = _chunkSearchService.Search(
            request.Question,
            document.Chunks.ToList()
        );

        if (matchedChunks.Count == 0)
        {
            return Ok(new AskQuestionResponse(
                "I could not find enough relevant information in this document to answer the question.",
                new List<SourceChunkResponse>()
            ));
        }

        var context = string.Join("\n\n", matchedChunks.Select(chunk =>
    $"Chunk {chunk.ChunkIndex}: {chunk.Content}"
));

        var answer = await _aiAnswerService.GenerateAnswerAsync(
            request.Question,
            context
        );

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

    private static string BuildSimulatedAnswer(
        string question,
        List<DocumentChunk> chunks)
    {
        var questionLower = question.ToLowerInvariant();

        var combinedContext = string.Join(" ", chunks.Select(chunk => chunk.Content));

        string answerIntro;

        if (questionLower.Contains("covered") || questionLower.Contains("treatment"))
        {
            answerIntro =
                "The document states that covered services may include outpatient consultations, diagnostic imaging, physiotherapy, emergency treatment and selected specialist services. Coverage still depends on eligibility, policy limits, treatment category and required supporting documents.";
        }
        else if (questionLower.Contains("dental"))
        {
            answerIntro =
                "The document suggests that dental-related claims may need additional policy coverage confirmation. Dental claims should not be automatically approved without checking the policy terms and supporting documentation.";
        }
        else if (questionLower.Contains("exclusion") || questionLower.Contains("excluded"))
        {
            answerIntro =
                "The document mentions exclusions such as cosmetic procedures, experimental treatments, non-medically necessary services, duplicate claims, late submissions and services from unapproved providers.";
        }
        else if (questionLower.Contains("document") || questionLower.Contains("required"))
        {
            answerIntro =
                "The document says a valid claim should include the claim form, invoice or receipt, treatment date, provider name, diagnosis or reason for treatment, and referral or clinical notes where applicable.";
        }
        else if (questionLower.Contains("risk") || questionLower.Contains("review"))
        {
            answerIntro =
                "The document indicates that claims may be flagged for manual review where there are duplicate claim numbers, unusually high amounts, repeated claims, missing evidence or provider-related concerns.";
        }
        else
        {
            var shortContext = combinedContext.Length > 500
                ? combinedContext[..500] + "..."
                : combinedContext;

            answerIntro =
                "Based on the most relevant sections found in the uploaded document, the answer appears to relate to the following context: " + shortContext;
        }

        return
            answerIntro +
            "\n\nThis answer is based on the retrieved document chunks shown below. It should be treated as decision-support information, not a final claim or medical decision.";
    }

    private Guid GetCurrentUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdValue))
        {
            throw new UnauthorizedAccessException("User ID was not found in token.");
        }

        return Guid.Parse(userIdValue);
    }

    [HttpGet("history/{documentId:guid}")]
    public async Task<ActionResult<List<ChatHistoryResponse>>> GetHistory(Guid documentId)
    {
        var userId = GetCurrentUserId();

        var documentExists = await _db.Documents.AnyAsync(document =>
            document.Id == documentId &&
            document.UserId == userId);

        if (!documentExists)
        {
            return NotFound("Document not found.");
        }

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