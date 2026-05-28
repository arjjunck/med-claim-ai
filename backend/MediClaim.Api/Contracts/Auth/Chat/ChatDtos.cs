namespace MediClaim.Api.Contracts.Chat;

public record AskQuestionRequest(
    Guid DocumentId,
    string Question
);

public record SourceChunkResponse(
    Guid ChunkId,
    int ChunkIndex,
    string? SourcePage,
    string Content
);

public record AskQuestionResponse(
    string Answer,
    List<SourceChunkResponse> Sources
);

public record ChatHistoryResponse(
    Guid Id,
    Guid DocumentId,
    string Question,
    string Answer,
    DateTime CreatedAt
);