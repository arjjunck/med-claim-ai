using MediClaim.Domain.Entities;
using MediClaim.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace MediClaim.Infrastructure.Search;

public class VectorSearchService
{
    private readonly MediClaimDbContext _db;

    public VectorSearchService(MediClaimDbContext db)
    {
        _db = db;
    }

    public async Task<List<DocumentChunk>> SearchAsync(
        float[] queryEmbedding,
        Guid documentId,
        int topK = 5)
    {
        var chunks = await _db.DocumentChunks
            .Where(c => c.DocumentId == documentId && c.Embedding != null)
            .ToListAsync();

        return chunks
            .Select(c => (chunk: c, score: CosineSimilarity(queryEmbedding, c.Embedding!)))
            .OrderByDescending(x => x.score)
            .Take(topK)
            .Select(x => x.chunk)
            .ToList();
    }

    private static float CosineSimilarity(float[] a, float[] b)
    {
        if (a.Length != b.Length) return 0f;
        float dot = 0, magA = 0, magB = 0;
        for (int i = 0; i < a.Length; i++)
        {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }
        return (magA == 0 || magB == 0) ? 0f : dot / (MathF.Sqrt(magA) * MathF.Sqrt(magB));
    }
}
