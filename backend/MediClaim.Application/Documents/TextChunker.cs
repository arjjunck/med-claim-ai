using System.Text.RegularExpressions;

namespace MediClaim.Application.Documents;

public record TextChunk(string Content, string? SourcePage);

public partial class TextChunker
{
    public List<string> Chunk(string text, int maxWords = 220, int overlapWords = 40)
    {
        return ChunkWithPages(text, maxWords, overlapWords)
            .Select(chunk => chunk.Content)
            .ToList();
    }

    // Splits on the "--- Page N ---" markers written by PdfTextExtractor and
    // records which page(s) each chunk came from, e.g. "3" or "3-4".
    public List<TextChunk> ChunkWithPages(string text, int maxWords = 220, int overlapWords = 40)
    {
        var words = new List<(string Word, int? Page)>();
        int? currentPage = null;

        // With a capture group, Regex.Split alternates: text, page number, text, ...
        var parts = PageMarker().Split(text);
        for (var i = 0; i < parts.Length; i++)
        {
            if (i % 2 == 1)
            {
                currentPage = int.Parse(parts[i]);
                continue;
            }

            foreach (var word in parts[i].Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries))
                words.Add((word, currentPage));
        }

        var chunks = new List<TextChunk>();

        var start = 0;

        while (start < words.Count)
        {
            var current = words
                .Skip(start)
                .Take(maxWords)
                .ToList();

            var chunk = string.Join(' ', current.Select(w => w.Word));

            if (chunk.Length > 50)
            {
                chunks.Add(new TextChunk(chunk, FormatPages(current.Select(w => w.Page))));
            }

            start += maxWords - overlapWords;
        }

        return chunks;
    }

    private static string? FormatPages(IEnumerable<int?> pages)
    {
        var known = pages.Where(p => p.HasValue).Select(p => p!.Value).ToList();
        if (known.Count == 0)
            return null;

        var first = known.Min();
        var last = known.Max();
        return first == last ? first.ToString() : $"{first}-{last}";
    }

    [GeneratedRegex(@"---\s*Page\s+(\d+)\s*---")]
    private static partial Regex PageMarker();
}
