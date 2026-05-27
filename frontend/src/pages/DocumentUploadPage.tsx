import { useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  UploadCloud,
  X,
  AlertCircle,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { saveDemoDocument } from "../utils/documentStore";

export default function DocumentUploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

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

  function simulateUpload() {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setUploadProgress(0);
    setError("");

    const interval = window.setInterval(() => {
      setUploadProgress((prev) => {
          if (prev >= 100) {
              window.clearInterval(interval);

              if (selectedFile) {
                  saveDemoDocument(selectedFile);
              }

              setStatus("success");
              return 100;
          }

        return prev + 10;
      });
    }, 180);
  }

  return (
    <AppShell
      title="Upload Policy PDF"
      subtitle="Document processing module"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Add a medical or insurance document.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Upload a sample policy or public medical document. In the next
              backend stage, this document will be sent to ASP.NET Core, text
              will be extracted, split into chunks, and prepared for RAG.
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

              {status === "success" && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  <CheckCircle2 size={20} />
                  <p>
                    PDF uploaded successfully. Backend connection will be added
                    later.
                  </p>
                </div>
              )}
            </div>
          )}

                  <button
                      onClick={simulateUpload}
                      disabled={status === "uploading" || status === "success"}
                      className="mt-6 w-full rounded-full bg-[#0071e3] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] hover:bg-[#0066cc] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                      {status === "success" ? "Uploaded" : "Continue Upload"}
                  </button>
        </section>

        <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            What happens next?
          </h2>

          <div className="mt-6 space-y-4">
            {[
              {
                step: "1",
                title: "Upload PDF",
                text: "The user selects a policy or medical document.",
              },
              {
                step: "2",
                title: "Extract text",
                text: "The backend will use a PDF parser to read document text.",
              },
              {
                step: "3",
                title: "Chunk document",
                text: "Long text will be split into smaller searchable sections.",
              },
              {
                step: "4",
                title: "Prepare RAG",
                text: "Chunks will later be retrieved when the user asks questions.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-[1.5rem] bg-[#fbfbfd] p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0071e3] text-sm font-semibold text-white">
                  {item.step}
                </div>

                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-[#f5f5f7] p-5">
            <p className="text-sm font-semibold">Safety note</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Do not upload real patient records or confidential insurance
              documents. Use public policy documents or synthetic sample files
              for this portfolio project.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}