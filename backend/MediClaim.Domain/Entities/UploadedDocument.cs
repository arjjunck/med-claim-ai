namespace MediClaim.Domain.Entities;

public class UploadedDocument
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string DocumentType { get; set; } = "Policy";

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public List<DocumentChunk> Chunks { get; set; } = new();
}