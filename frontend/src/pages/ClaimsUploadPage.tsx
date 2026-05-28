import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
  UploadCloud,
  X,
} from "lucide-react";
import AppShell from "../components/AppShell";
import RiskBadge from "../components/RiskBadge";
import ExplanationModal from "../components/ExplanationModal";
import { getClaims, uploadClaims, type ClaimResponse } from "../api/claimApi";

export default function ClaimsUploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<ClaimResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "analysing" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ClaimResponse[]>([]);
  const [isLoadingClaims, setIsLoadingClaims] = useState(false);

  const totalClaims = results.length;
  const highRisk = results.filter((claim) => claim.riskLevel === "High").length;
  const mediumRisk = results.filter((claim) => claim.riskLevel === "Medium").length;
  const totalAmount = results.reduce((sum, claim) => sum + claim.amount, 0);

  async function loadClaims() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setIsLoadingClaims(true);
      const claims = await getClaims(token);
      setResults(claims);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load claims.");
    } finally {
      setIsLoadingClaims(false);
    }
  }

  useEffect(() => {
    loadClaims();
  }, []);

  function validateFile(file: File) {
    const isCsv = file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");

    if (!isCsv) return "Only CSV files are supported.";

    const maxSizeMB = 5;
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
    setProgress(0);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function removeFile() {
    setSelectedFile(null);
    setSelectedClaim(null);
    setStatus("idle");
    setError("");
    setProgress(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function handleAnalysis() {
    if (!selectedFile) {
      setError("Please select a CSV file first.");
      setStatus("error");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to analyse claims.");
      setStatus("error");
      return;
    }

    try {
      setStatus("analysing");
      setError("");
      setProgress(30);

      const response = await uploadClaims(selectedFile, token);

      setProgress(100);
      setStatus("success");
      setResults(response.claims);
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      await loadClaims();
    } catch (err) {
      setStatus("error");
      setProgress(0);
      setError(err instanceof Error ? err.message : "Claim analysis failed.");
    }
  }

  return (
    <AppShell title="Claim Risk Review" subtitle="CSV analysis module">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Upload claim records.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Upload a claim CSV file. The backend reads the CSV, applies
              rule-based risk checks, stores the records in PostgreSQL, and
              returns risk results.
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
              isDragging ? "border-[#0071e3] bg-blue-50" : "border-gray-200 bg-[#fbfbfd]"
            }`}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
              <UploadCloud size={30} className="text-[#0071e3]" />
            </div>

            <h3 className="text-2xl font-semibold">Drop your CSV here</h3>
            <p className="mt-2 text-sm text-gray-500">
              or choose a file from your computer
            </p>

            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleInputChange}
              className="hidden"
            />

            <button
              onClick={() => inputRef.current?.click()}
              className="mt-7 rounded-full bg-[#1d1d1f] px-7 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:scale-[1.02]"
            >
              Choose CSV
            </button>

            <p className="mt-4 text-xs text-gray-400">
              Required columns: claimNumber, patientReference, procedureCode,
              amount, claimDate, providerName
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
                    <FileSpreadsheet size={22} className="text-[#0071e3]" />
                  </div>

                  <div>
                    <p className="font-semibold">{selectedFile.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
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

              {status === "analysing" && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <span>Analysing claim records</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-[#0071e3] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 size={20} />
              <p>Claim file analysed and saved to PostgreSQL.</p>
            </div>
          )}

          <button
            onClick={handleAnalysis}
            disabled={status === "analysing" || !selectedFile}
            className="mt-6 w-full rounded-full bg-[#0071e3] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] hover:bg-[#0066cc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "analysing" ? "Analysing..." : "Analyse Claims"}
          </button>
        </section>

        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Claims</p>
              <p className="mt-2 text-3xl font-semibold">{totalClaims}</p>
            </div>

            <div className="rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">High Risk</p>
              <p className="mt-2 text-3xl font-semibold text-red-600">{highRisk}</p>
            </div>

            <div className="rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Medium Risk</p>
              <p className="mt-2 text-3xl font-semibold text-amber-600">
                {mediumRisk}
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-white/80 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="mt-2 text-3xl font-semibold">
                €{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Risk results</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Real claim records loaded from PostgreSQL.
                </p>
              </div>

              <button
                onClick={loadClaims}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-gray-600 transition hover:bg-gray-200"
              >
                <RefreshCw
                  size={18}
                  className={isLoadingClaims ? "animate-spin" : ""}
                />
              </button>
            </div>

            {isLoadingClaims ? (
              <div className="rounded-[1.7rem] bg-[#fbfbfd] p-8 text-center">
                <p className="text-sm font-medium text-gray-500">
                  Loading claims...
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-[1.7rem] bg-[#fbfbfd] p-8 text-center">
                <p className="text-sm font-medium text-gray-500">
                  No claim results yet.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Upload a CSV and click Analyse Claims.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-[1.5rem] border border-gray-100">
                <table className="w-full border-collapse bg-white text-left text-sm">
                  <thead className="bg-[#f5f5f7] text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Claim</th>
                      <th className="px-4 py-3">Procedure</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Risk</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {results.map((claim) => (
                      <tr key={claim.id} className="border-t border-gray-100">
                        <td className="px-4 py-4 font-medium">
                          {claim.claimNumber}
                        </td>

                        <td className="px-4 py-4">{claim.procedureCode}</td>

                        <td className="px-4 py-4">€{claim.amount}</td>

                        <td className="px-4 py-4">
                          <RiskBadge level={claim.riskLevel} />
                        </td>

                        <td className="px-4 py-4 text-gray-500">
                          {claim.riskReason}
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelectedClaim(claim)}
                            className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
                          >
                            <Brain size={14} />
                            Explain
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      <ExplanationModal
        claim={selectedClaim}
        onClose={() => setSelectedClaim(null)}
      />
    </AppShell>
  );
}