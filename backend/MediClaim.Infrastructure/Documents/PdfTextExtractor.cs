using System.Text;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace MediClaim.Infrastructure.Documents;

public class PdfTextExtractor
{
    public string ExtractText(Stream pdfStream)
    {
        using var document = PdfDocument.Open(pdfStream);

        var builder = new StringBuilder();

        foreach (var page in document.GetPages())
        {
            builder.AppendLine($"--- Page {page.Number} ---");
            builder.AppendLine(GetPageText(page));
        }

        return builder.ToString();
    }

    // page.Text concatenates text runs with no separator, so the last word of one
    // line runs into the first word of the next ("textextraction"). Rebuild the
    // text from words instead: a space between words, a newline when the baseline moves.
    private static string GetPageText(Page page)
    {
        var builder = new StringBuilder();
        Word? previous = null;

        foreach (var word in page.GetWords())
        {
            if (previous is not null)
            {
                var lineHeight = Math.Max(word.BoundingBox.Height, previous.BoundingBox.Height);
                var newLine = Math.Abs(word.BoundingBox.Bottom - previous.BoundingBox.Bottom) > lineHeight / 2;
                builder.Append(newLine ? '\n' : ' ');
            }

            builder.Append(word.Text);
            previous = word;
        }

        return builder.ToString();
    }
}
