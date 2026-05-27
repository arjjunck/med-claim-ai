import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  RefreshCw,
  UploadCloud,
  X,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { Eye } from "lucide-react";
import {
  getDocumentById,
  getUploadedDocuments,
  uploadDocument,
  type DocumentDetails,
  type DocumentListItem,
} from "../api/documentApi";


export default function DocumentUploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
const [selectedDocument, setSelectedDocument] = useState<DocumentDetails | null>(null);

  async function loadDocuments() {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to load documents.");
      return;
    }

    try {
      setIsLoadingDocuments(true);
      const result = await getUploadedDocuments(token);
      setDocuments(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load documents.");
    } finally {
      setIsLoadingDocuments(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  function validateFile(file: File) {
    if (file.type !== "application/pdf") {
      return "Only PDF files are supported.";
    }

    const maxSizeMB = 10;

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be under ${maxSizeMB} MB.`;
    }

    return "";
  }

  function handleFile(file: File) {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setStatus("error");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setStatus("idle");
    setError("");
    setUploadProgress(0);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  function removeFile() {
    setSelectedFile(null);
    setStatus("idle");
    setError("");
    setUploadProgress(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      setStatus("error");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to upload documents.");
      setStatus("error");
      return;
    }

    try {
      setStatus("uploading");
      setUploadProgress(30);
      setError("");

      await uploadDocument(selectedFile, token);

      setUploadProgress(100);
      setStatus("success");
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      await loadDocuments();
    } catch (err) {
      setStatus("error");
      setUploadProgress(0);
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  }
async function viewDocument(id: string) {
  const token = localStorage.getItem("token");

  if (!token) {
    setError("You must be logged in to view documents.");
    return;
  }

  try {
    const result = await getDocumentById(id, token);
    setSelectedDocument(result);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Unable to load document.");
  }
}
  return (
    <AppShell title="Upload Policy PDF" subtitle="Document processing module">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Add a medical or insurance document.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Upload a sample policy or public medical document. The backend
              extracts text, splits it into chunks, and stores it in PostgreSQL
              for later RAG-based search.
            </p>
          </div>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-[2rem] border-2 border-dashed p-10 text-center transition ${
              isDragging
                ? "border-[#0071e3] bg-blue-50"
                : "border-gray-200 bg-[#fbfbfd]"
            }`}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
              <UploadCloud size={30} className="text-[#0071e3]" />
            </div>

            <h3 className="text-2xl font-semibold">Drop your PDF here</h3>
            <p className="mt-2 text-sm text-gray-500">
              or choose a file from your computer
            </p>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleInputChange}
              className="hidden"
            />

            <button
              onClick={() => inputRef.current?.click()}
              className="mt-7 rounded-full bg-[#1d1d1f] px-7 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:scale-[1.02]"
            >
              Choose PDF
            </button>

            <p className="mt-4 text-xs text-gray-400">
              Maximum file size: 10 MB
            </p>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-3xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {selectedFile && (
            <div className="mt-5 rounded-[1.7rem] border border-gray-100 bg-[#fbfbfd] p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <FileText size={22} className="text-[#0071e3]" />
                  </div>

                  <div>
                    <p className="font-semibold">{selectedFile.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  onClick={removeFile}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:bg-gray-100 hover:text-black"
                >
                  <X size={17} />
                </button>
              </div>

              {status === "uploading" && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Uploading document</span>
                    <span>{uploadProgress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-[#0071e3] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 size={20} />
              <p>PDF uploaded successfully and saved to PostgreSQL.</p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={status === "uploading" || !selectedFile}
            className="mt-6 w-full rounded-full bg-[#0071e3] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] hover:bg-[#0066cc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "uploading" ? "Uploading..." : "Continue Upload"}
          </button>
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Document library
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Real documents loaded from PostgreSQL.
              </p>
            </div>

            <button
              onClick={loadDocuments}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-gray-600 transition hover:bg-gray-200"
            >
              <RefreshCw
                size={18}
                className={isLoadingDocuments ? "animate-spin" : ""}
              />
            </button>
          </div>

          <div className="space-y-3">
            {isLoadingDocuments ? (
              <div className="rounded-[1.5rem] bg-[#fbfbfd] p-6 text-sm text-gray-500">
                Loading documents...
              </div>
            ) : documents.length === 0 ? (
              <div className="rounded-[1.5rem] bg-[#fbfbfd] p-6 text-sm text-gray-500">
                No uploaded documents yet.
              </div>
            ) : (
              documents.map((document) => (
                <div
                  key={document.id}
                  className="rounded-[1.5rem] border border-gray-100 bg-[#fbfbfd] p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <FileText size={20} className="text-[#0071e3]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {document.fileName}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {document.documentType} · {document.chunkCount} chunks
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Uploaded{" "}
                        {new Date(document.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => viewDocument(document.id)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
      {selectedDocument && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
    <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#0071e3]">Document details</p>
          <h2 className="mt-1 text-2xl font-semibold">
            {selectedDocument.fileName}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {selectedDocument.documentType} · {selectedDocument.chunkCount} chunks · Uploaded{" "}
            {new Date(selectedDocument.uploadedAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => setSelectedDocument(null)}
          className="rounded-full bg-[#f5f5f7] px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
        >
          Close
        </button>
      </div>

      <div className="space-y-4">
        {selectedDocument.chunks.map((chunk) => (
          <div
            key={chunk.id}
            className="rounded-[1.5rem] border border-gray-100 bg-[#fbfbfd] p-5"
          >
            <p className="mb-2 text-xs font-semibold text-[#0071e3]">
              Chunk {chunk.chunkIndex} {chunk.sourcePage ? `· ${chunk.sourcePage}` : ""}
            </p>

            <p className="text-sm leading-6 text-gray-600">
              {chunk.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
    </AppShell>
  );
}