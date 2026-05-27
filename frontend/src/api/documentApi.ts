const API_BASE_URL = "http://localhost:5283/api";

export type UploadedDocumentResponse = {
  id: string;
  fileName: string;
  uploadedAt: string;
  chunkCount: number;
  preview: string;
};

export async function uploadDocument(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/Documents/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Document upload failed.");
  }

  return (await response.json()) as UploadedDocumentResponse;
}

export async function getDocuments(token: string) {
  const response = await fetch(`${API_BASE_URL}/Documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to fetch documents.");
  }

  return await response.json();
}

export type DocumentListItem = {
  id: string;
  fileName: string;
  documentType: string;
  uploadedAt: string;
  chunkCount: number;
};

export async function getUploadedDocuments(token: string) {
  const response = await fetch(`${API_BASE_URL}/Documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load documents.");
  }

  return (await response.json()) as DocumentListItem[];
}

export type DocumentDetails = {
  id: string;
  fileName: string;
  documentType: string;
  uploadedAt: string;
  chunkCount: number;
  chunks: {
    id: string;
    chunkIndex: number;
    sourcePage: string | null;
    content: string;
  }[];
};

export async function getDocumentById(id: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/Documents/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load document details.");
  }

  return (await response.json()) as DocumentDetails;
}