using System.Text;
using UglyToad.PdfPig;

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
            builder.AppendLine(page.Text);
        }

        return builder.ToString();
    }
}