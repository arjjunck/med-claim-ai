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
        return await _db.DocumentChunks
            .FromSqlRaw(
                """
                SELECT * FROM "DocumentChunks"
                WHERE "DocumentId" = {0}
                  AND "Embedding" IS NOT NULL
                ORDER BY "Embedding" <=> {1}::vector
                LIMIT {2}
                """,
                documentId,
                "[" + string.Join(",", queryEmbedding) + "]",
                topK)
            .ToListAsync();
    }
}
