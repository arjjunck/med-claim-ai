namespace MediClaim.Application.Documents;

public class TextChunker
{
    public List<string> Chunk(string text, int maxWords = 220, int overlapWords = 40)
    {
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        var chunks = new List<string>();

        var start = 0;

        while (start < words.Length)
        {
            var current = words
                .Skip(start)
                .Take(maxWords)
                .ToArray();

            var chunk = string.Join(' ', current);

            if (chunk.Length > 50)
            {
                chunks.Add(chunk);
            }

            start += maxWords - overlapWords;
        }

        return chunks;
    }
}