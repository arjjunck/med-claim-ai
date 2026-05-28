const API_BASE_URL = "http://localhost:5283/api";

export type SourceChunk = {
  chunkId: string;
  chunkIndex: number;
  sourcePage: string | null;
  content: string;
};

export type AskQuestionResponse = {
  answer: string;
  sources: SourceChunk[];
};

export async function askDocumentQuestion(
  documentId: string,
  question: string,
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/Chat/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      documentId,
      question,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to ask document question.");
  }

  return (await response.json()) as AskQuestionResponse;
}
export type ChatHistoryItem = {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  createdAt: string;
};

export async function getChatHistory(documentId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/Chat/history/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load chat history.");
  }

  return (await response.json()) as ChatHistoryItem[];
}