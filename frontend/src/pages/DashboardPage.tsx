import { useEffect, useState } from "react";
import {
  getUploadedDocuments,
  type DocumentListItem,
} from "../api/documentApi";
import {
  ArrowRight,
  FileText,
  MessageSquare,
  ShieldAlert,
  UploadCloud,
} from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import StatCard from "../components/StatCard";
import { getClaims, type ClaimResponse } from "../api/claimApi";

const actions = [
  {
    title: "Upload Policy PDF",
    description: "Add medical or insurance documents for RAG-based Q&A.",
    icon: FileText,
    link: "/documents",
  },
  {
    title: "Review Claim CSV",
    description: "Upload claim records and identify simple risk indicators.",
    icon: ShieldAlert,
    link: "/claims",
  },
  {
    title: "Ask Document Questions",
    description: "Chat with uploaded documents using grounded AI answers.",
    icon: MessageSquare,
    link: "/chat",
  },
];

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
 const [claims, setClaims] = useState<ClaimResponse[]>([]); 

useEffect(() => {
  async function loadDashboardData() {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const uploadedDocuments = await getUploadedDocuments(token);
    setDocuments(uploadedDocuments);

   const uploadedClaims = await getClaims(token);
  setClaims(uploadedClaims);
  }

  loadDashboardData();
}, []);

  const highRiskClaims = claims.filter((claim) => claim.riskLevel === "High");

  return (
    <AppShell
      title="Dashboard"
      subtitle="Medical document intelligence workspace"
    >
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Uploaded Documents"
          value={documents.length.toString()}
          helper="Policy and medical PDFs"
        />

        <StatCard
          label="Claims Reviewed"
          value={claims.length.toString()}
          helper="CSV claim records analysed"
        />

        <StatCard
          label="High Risk Flags"
          value={highRiskClaims.length.toString()}
          helper="Claims requiring review"
        />
      </div>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Quick actions</h2>
              <p className="mt-1 text-sm text-gray-500">
                Start with a document upload or claim review.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="group rounded-[1.6rem] border border-gray-100 bg-[#fbfbfd] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Icon size={20} className="text-[#0071e3]" />
                  </div>

                  <h3 className="font-semibold">{action.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {action.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#0071e3]">
                    Open
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f5f7]">
                <UploadCloud size={20} className="text-[#0071e3]" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Build progress</h2>
                <p className="text-sm text-gray-500">Frontend foundation</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Landing page", status: "Done" },
                { label: "Routing", status: "Done" },
                { label: "Dashboard layout", status: "Done" },
                { label: "Document store", status: "Done" },
                { label: "Claim store", status: "Done" },
                { label: "Backend connection", status: "Next" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl bg-[#fbfbfd] p-4"
                >
                  <p className="text-sm font-medium">{item.label}</p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === "Done"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "In Progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Recent documents</h2>

            <p className="mt-1 text-sm text-gray-500">
              Uploaded PDFs saved in this demo browser session.
            </p>

            <div className="mt-5 space-y-3">
              {documents.length === 0 ? (
                <div className="rounded-2xl bg-[#fbfbfd] p-5 text-sm text-gray-500">
                  No documents uploaded yet.
                </div>
              ) : (
                documents.slice(0, 3).map((document) => (
                  <div
                    key={document.id}
                    className="rounded-2xl border border-gray-100 bg-[#fbfbfd] p-4"
                  >
                    <p className="text-sm font-semibold">
                      {document.fileName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {document.documentType} · {document.chunkCount} chunks
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Recent risk findings</h2>

            <p className="mt-1 text-sm text-gray-500">
              Claim risk results saved from the latest CSV analysis.
            </p>

            <div className="mt-5 space-y-3">
              {claims.length === 0 ? (
                <div className="rounded-2xl bg-[#fbfbfd] p-5 text-sm text-gray-500">
                  No claim analysis completed yet.
                </div>
              ) : (
                claims.slice(0, 3).map((claim, index) => (
                  <div
                    key={`${claim.claimNumber}-${index}`}
                    className="rounded-2xl border border-gray-100 bg-[#fbfbfd] p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">
                        {claim.claimNumber}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          claim.riskLevel === "High"
                            ? "bg-red-100 text-red-700"
                            : claim.riskLevel === "Medium"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {claim.riskLevel}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      {claim.riskReason}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}