using Microsoft.Extensions.Configuration;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using MediClaim.Application.Chat;

namespace MediClaim.Application.Chat;

public class AiAnswerService
{
    private readonly Kernel _kernel;

    public AiAnswerService(IConfiguration configuration)
    {
        var apiKey = configuration["OpenAI:ApiKey"];
        var model = configuration["OpenAI:Model"] ?? "gpt-4o-mini";

        var builder = Kernel.CreateBuilder();
        builder.AddOpenAIChatCompletion(modelId: model, apiKey: apiKey!);

        _kernel = builder.Build();
    }

    public async Task<string> GenerateAnswerAsync(
        string question,
        string context)
    {
        var chatService = _kernel.GetRequiredService<IChatCompletionService>();

        var chatHistory = new ChatHistory();

        chatHistory.AddSystemMessage("""
        You are MediClaim AI, a medical insurance document assistant.

        Rules:
        - Answer only using the provided document context.
        - Do not invent details.
        - If the answer is not in the context, say you cannot find it in the document.
        - Use clear, professional language.
        - Do not make final medical, legal, or claim approval decisions.
        - Keep the answer concise.
        """);

        chatHistory.AddUserMessage($"""
        Document context:
        {context}

        User question:
        {question}

        Provide a helpful answer based only on the document context.
        """);

        var response = await chatService.GetChatMessageContentAsync(chatHistory);

        return response.Content ?? "I could not generate an answer from the document context.";
    }
}