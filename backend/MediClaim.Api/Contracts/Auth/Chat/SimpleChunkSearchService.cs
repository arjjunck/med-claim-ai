using MediClaim.Domain.Entities;

namespace MediClaim.Application.Chat;

public class SimpleChunkSearchService
{
    public List<DocumentChunk> Search(string question, List<DocumentChunk> chunks, int topK = 3)
    {
        var questionWords = question
            .ToLowerInvariant()
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Where(word => word.Length > 3)
            .Distinct()
            .ToList();

        return chunks
            .Select(chunk => new
            {
                Chunk = chunk,
                Score = questionWords.Count(word =>
                    chunk.Content.ToLowerInvariant().Contains(word))
            })
            .OrderByDescending(item => item.Score)
            .ThenBy(item => item.Chunk.ChunkIndex)
            .Take(topK)
            .Select(item => item.Chunk)
            .ToList();
    }
}