import type { DemoDocument } from "../types/document";

const STORAGE_KEY = "mediclaim_documents";

export function getDemoDocuments(): DemoDocument[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as DemoDocument[];
  } catch {
    return [];
  }
}

export function saveDemoDocument(file: File): DemoDocument {
  const currentDocuments = getDemoDocuments();

  const existingDocument = currentDocuments.find(
    (document) =>
      document.fileName === file.name &&
      document.sizeMB === (file.size / 1024 / 1024).toFixed(2)
  );

  if (existingDocument) {
    return existingDocument;
  }

  const newDocument: DemoDocument = {
    id: crypto.randomUUID(),
    fileName: file.name,
    sizeMB: (file.size / 1024 / 1024).toFixed(2),
    uploadedAt: new Date().toISOString(),
    chunkCount: Math.floor(Math.random() * 8) + 8,
  };

  const updatedDocuments = [newDocument, ...currentDocuments];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocuments));

  return newDocument;
}

export function clearDemoDocuments() {
  localStorage.removeItem(STORAGE_KEY);
}