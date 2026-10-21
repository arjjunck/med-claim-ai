using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json;

namespace MediClaim.Application.Chat;

public class EmbeddingService
{
    private readonly HttpClient _http;
    private readonly string _model;
    private readonly string _baseUrl;

    public EmbeddingService(IConfiguration configuration)
    {
        _http = new HttpClient();
        _http.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue(
                "Bearer", configuration["OpenAI:ApiKey"]);
        _model = configuration["OpenAI:EmbeddingModel"] ?? "nvidia/nemotron-3.5-embed-1b";
        _baseUrl = configuration["OpenAI:BaseUrl"] ?? "https://integrate.api.nvidia.com/v1/embeddings";
    }

    public async Task<float[]> EmbedAsync(string text)
    {
        var payload = new { input = text, model = _model, input_type = "passage" };
        var response = await _http.PostAsJsonAsync(_baseUrl, payload);
        response.EnsureSuccessStatusCode();
        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        return doc.RootElement
            .GetProperty("data")[0]
            .GetProperty("embedding")
            .EnumerateArray()
            .Select(e => e.GetSingle())
            .ToArray();
    }

    public async Task<float[][]> EmbedBatchAsync(IReadOnlyList<string> texts)
    {
        var payload = new { input = texts, model = _model, input_type = "passage" };
        var response = await _http.PostAsJsonAsync(_baseUrl, payload);
        response.EnsureSuccessStatusCode();
        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        return doc.RootElement
            .GetProperty("data")
            .EnumerateArray()
            .OrderBy(item => item.GetProperty("index").GetInt32())
            .Select(item => item.GetProperty("embedding").EnumerateArray()
                .Select(e => e.GetSingle()).ToArray())
            .ToArray();
    }
}