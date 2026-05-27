import { useEffect, useState } from "react";
import {
  getUploadedDocuments,
  type DocumentListItem,
} from "../api/documentApi";
import {
  Bot,
  FileText,
  Send,
  Sparkles,
  User,
  Quote,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  sources?: {
    title: string;
    page: string;
    excerpt: string;
  }[];
};

const suggestedQuestions = [
  "What treatments are covered in this policy?",
  "Are dental procedures included?",
  "What exclusions are mentioned?",
  "What documents are required for claim review?",
];

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text: "Upload or select a document, then ask a question. I will answer using only the retrieved document context.",
  },
];

export default function ChatPage() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [question, setQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);

useEffect(() => {
  async function loadDocuments() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const savedDocuments = await getUploadedDocuments(token);
    setDocuments(savedDocuments);

    if (savedDocuments.length > 0) {
      setActiveDocumentId(savedDocuments[0].id);
    }
  }

  loadDocuments();
}, []);

  const activeDocument = documents.find(
    (document) => document.id === activeDocumentId
  );

  function getSampleAnswer(userQuestion: string): ChatMessage {
    const documentName = activeDocument?.fileName || "Sample Policy Document";

    return {
      id: Date.now() + 1,
      role: "assistant",
      text: `Based on the selected document context, this question requires review against the relevant coverage and exclusion sections. For this frontend demo, I am showing a simulated RAG answer for: "${userQuestion}". In the backend version, the answer will be generated from retrieved PDF chunks using Semantic Kernel.`,
      sources: [
        {
          title: documentName,
          page: "Page 2",
          excerpt:
            "Coverage applies only where the procedure is listed under eligible treatment categories and supported by required documentation.",
        },
        {
          title: documentName,
          page: "Page 5",
          excerpt:
            "Claims may require additional review where the treatment type, amount, or provider information falls outside normal policy conditions.",
        },
      ],
    };
  }

  function sendMessage(text?: string) {
    const finalQuestion = text || question;

    if (!finalQuestion.trim()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: finalQuestion,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setQuestion("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        getSampleAnswer(finalQuestion),
      ]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <AppShell title="Document Q&A" subtitle="RAG assistant interface">
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f5f7]">
                <FileText size={21} className="text-[#0071e3]" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Active document</h2>
                <p className="text-sm text-gray-500">
                  Select a PDF for document Q&A
                </p>
              </div>
            </div>

            {documents.length === 0 ? (
              <div className="rounded-[1.5rem] bg-[#fbfbfd] p-5">
                <p className="text-sm font-semibold">No document selected</p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Upload a PDF from the Documents page first. Then return here
                  to ask questions from it.
                </p>

                <Link
                  to="/documents"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.02] hover:bg-[#0066cc]"
                >
                  <UploadCloud size={16} />
                  Upload PDF
                </Link>
              </div>
            ) : (
              <div className="rounded-[1.5rem] bg-[#fbfbfd] p-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Select document
                </label>

                <select
                  value={activeDocumentId}
                  onChange={(event) => setActiveDocumentId(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0071e3] focus:ring-4 focus:ring-blue-100"
                >
                  {documents.map((document) => (
                    <option key={document.id} value={document.id}>
                      {document.fileName}
                    </option>
                  ))}
                </select>

                {activeDocument && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-2xl font-semibold">
                        {activeDocument.chunkCount}
                      </p>
                      <p className="text-xs text-gray-500">Chunks</p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-2xl font-semibold">
                        {activeDocument.documentType}
                      </p>
                      <p className="text-xs text-gray-500">Type</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                <Sparkles size={20} className="text-[#0071e3]" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Suggested questions</h2>
                <p className="text-sm text-gray-500">Click to test the chat UI</p>
              </div>
            </div>

            <div className="space-y-3">
              {suggestedQuestions.map((item) => (
                <button
                  key={item}
                  onClick={() => sendMessage(item)}
                  className="w-full rounded-2xl border border-gray-100 bg-[#fbfbfd] p-4 text-left text-sm font-medium text-gray-700 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-[680px] flex-col rounded-[2rem] border border-white/80 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white">
                <Bot size={20} />
              </div>

              <div>
                <h2 className="font-semibold">MediClaim Assistant</h2>
                <p className="text-sm text-gray-500">
                  Source-grounded answers preview
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              Online
            </span>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto rounded-[1.5rem] bg-[#f5f5f7] p-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Bot size={17} className="text-[#0071e3]" />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-[1.5rem] p-4 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "bg-[#0071e3] text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <p>{message.text}</p>

                  {message.sources && (
                    <div className="mt-4 space-y-3">
                      {message.sources.map((source, index) => (
                        <div
                          key={`${source.title}-${index}`}
                          className="rounded-2xl border border-gray-100 bg-[#fbfbfd] p-4"
                        >
                          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#0071e3]">
                            <Quote size={14} />
                            {source.title} · {source.page}
                          </div>

                          <p className="text-xs leading-5 text-gray-500">
                            {source.excerpt}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-white shadow-sm">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                  <Bot size={17} className="text-[#0071e3]" />
                </div>

                <div className="flex items-center gap-2 rounded-[1.5rem] bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-[#0071e3]" />
                  Thinking with document context...
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-full bg-[#f5f5f7] p-2">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 bg-transparent px-4 text-sm outline-none"
              placeholder="Ask a question from the uploaded document..."
            />

            <button
              onClick={() => sendMessage()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0071e3] text-white shadow-md transition hover:scale-105 hover:bg-[#0066cc]"
            >
              <Send size={17} />
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}