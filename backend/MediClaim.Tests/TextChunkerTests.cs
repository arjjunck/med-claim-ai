using MediClaim.Application.Documents;

namespace MediClaim.Tests;

public class TextChunkerTests
{
    private readonly TextChunker _chunker = new();

    private static string Words(string prefix, int count) =>
        string.Join(' ', Enumerable.Range(1, count).Select(i => $"{prefix}{i}"));

    [Fact]
    public void SinglePage_ChunkGetsThatPage()
    {
        var text = $"--- Page 1 ---\n{Words("w", 50)}\n";

        var chunks = _chunker.ChunkWithPages(text);

        Assert.Single(chunks);
        Assert.Equal("1", chunks[0].SourcePage);
        Assert.DoesNotContain("Page", chunks[0].Content);
    }

    [Fact]
    public void ChunkSpanningTwoPages_GetsPageRange()
    {
        var text = $"--- Page 1 ---\n{Words("a", 30)}\n--- Page 2 ---\n{Words("b", 30)}\n";

        var chunks = _chunker.ChunkWithPages(text);

        Assert.Single(chunks);
        Assert.Equal("1-2", chunks[0].SourcePage);
    }

    [Fact]
    public void LongDocument_LaterChunksGetLaterPages()
    {
        var text = $"--- Page 1 ---\n{Words("a", 300)}\n--- Page 2 ---\n{Words("b", 300)}\n";

        var chunks = _chunker.ChunkWithPages(text);

        Assert.Equal("1", chunks[0].SourcePage);
        Assert.Equal("2", chunks[^1].SourcePage);
        Assert.Contains(chunks, c => c.SourcePage == "1-2");
    }

    [Fact]
    public void TextWithoutMarkers_HasNoPage()
    {
        var chunks = _chunker.ChunkWithPages(Words("w", 50));

        Assert.Single(chunks);
        Assert.Null(chunks[0].SourcePage);
    }

    [Fact]
    public void OnlyPageMarkers_ProducesNoChunks()
    {
        var chunks = _chunker.ChunkWithPages("--- Page 1 ---\n\n--- Page 2 ---\n");

        Assert.Empty(chunks);
    }

    [Fact]
    public void Chunk_StillReturnsPlainStrings()
    {
        var chunks = _chunker.Chunk($"--- Page 1 ---\n{Words("w", 50)}");

        Assert.Single(chunks);
        Assert.StartsWith("w1 w2", chunks[0]);
    }
}
