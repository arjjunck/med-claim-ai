namespace MediClaim.Domain.Entities;

public class DocumentChunk
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid DocumentId { get; set; }

    public int ChunkIndex { get; set; }

    public string Content { get; set; } = string.Empty;

    public string? SourcePage { get; set; }

    public float[]? Embedding { get; set; }

    public UploadedDocument? Document { get; set; }
}