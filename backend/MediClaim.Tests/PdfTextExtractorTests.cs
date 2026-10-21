using MediClaim.Infrastructure.Documents;

namespace MediClaim.Tests;

public class PdfTextExtractorTests
{
    private static string SamplePdfPath()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !Directory.Exists(Path.Combine(dir.FullName, "Testing")))
            dir = dir.Parent;

        Assert.NotNull(dir);
        return Path.Combine(dir!.FullName, "Testing", "MediClaim_AI_Test_Policy_Document.pdf");
    }

    private static string ExtractSample()
    {
        using var stream = File.OpenRead(SamplePdfPath());
        return new PdfTextExtractor().ExtractText(stream);
    }

    [Fact]
    public void KeepsSpacesBetweenWordsOnDifferentLines()
    {
        var text = ExtractSample();

        Assert.DoesNotContain("textextraction", text);
        Assert.DoesNotContain("diagnosisor", text);
        Assert.DoesNotContain("PolicyDocumentSynthetic", text);
        Assert.Contains("text extraction", text.Replace('\n', ' '));
    }

    [Fact]
    public void WritesPageMarkersForEachPage()
    {
        var text = ExtractSample();

        Assert.Contains("--- Page 1 ---", text);
        Assert.Contains("--- Page 3 ---", text);
    }
}
