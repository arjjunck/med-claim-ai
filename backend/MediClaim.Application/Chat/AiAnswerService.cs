using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

namespace MediClaim.Application.Chat;

public class AiAnswerService
{
    private readonly HttpClient _http;
    private readonly string _model;
    private readonly string _baseUrl;

    public AiAnswerService(IConfiguration configuration)
    {
        _http = new HttpClient();
        _http.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue(
                "Bearer", configuration["OpenAI:ApiKey"]);
        _model = configuration["OpenAI:Model"] ?? "nvidia/nemotron-3.5-lightning-30b-a3b";
        _baseUrl = configuration["OpenAI:ChatUrl"] ?? "https://integrate.api.nvidia.com/v1/chat/completions";
    }

    public async Task<string> GenerateAnswerAsync(string question, string context)
    {
        var payload = new
        {
            model = _model,
            messages = new[]
            {
                new { role = "system", content = """
                    You are MediClaim AI, a medical insurance document assistant.
                    Rules:
                    - Answer only using the provided document context.
                    - Do not invent details.
                    - If the answer is not in the context, say you cannot find it in the document.
                    - Use clear, professional language.
                    - Do not make final medical, legal, or claim approval decisions.
                    - Keep the answer concise.
                    """ },
                new { role = "user", content = $"Document context:\n{context}\n\nUser question:\n{question}\n\nProvide a helpful answer based only on the document context." }
            },
            // Reasoning models spend part of this budget on reasoning before the answer.
            max_tokens = 4096,
            temperature = 0.2
        };

        var response = await _http.PostAsJsonAsync(_baseUrl, payload);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException(
                $"AI provider returned {(int)response.StatusCode} for model '{_model}': {body}",
                null,
                response.StatusCode);
        }

        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        var message = doc.RootElement.GetProperty("choices")[0].GetProperty("message");

        var content = message.TryGetProperty("content", out var contentElement) &&
                      contentElement.ValueKind == JsonValueKind.String
            ? contentElement.GetString()
            : null;

        return string.IsNullOrWhiteSpace(content)
            ? "I could not generate an answer from the document context."
            : content.Trim();
    }
}
