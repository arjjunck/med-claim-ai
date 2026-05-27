import { ShieldCheck, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClaimsUploadPage() {
  return (
    <main className="min-h-screen px-6 py-6 text-[#1d1d1f]">
      <section className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-black">
          ← Back to dashboard
        </Link>

        <div className="mt-10 rounded-[2.5rem] border border-white/70 bg-white/75 p-8 shadow-xl backdrop-blur-xl">
          <p className="text-sm font-medium text-[#0071e3]">Claim risk module</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight">
            Analyse claim records.
          </h1>
          <p className="mt-4 max-w-2xl text-gray-600">
            Upload a claim CSV file and review duplicate, high-value, and
            policy-sensitive claim indicators.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-[#fbfbfd] p-10 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm">
                <UploadCloud size={28} className="text-[#0071e3]" />
              </div>

              <h2 className="text-2xl font-semibold">Upload CSV</h2>
              <p className="mt-2 text-sm text-gray-500">
                Example columns: claimNumber, amount, procedureCode, claimDate.
              </p>

              <button className="mt-7 rounded-full bg-[#1d1d1f] px-7 py-3 text-sm font-medium text-white">
                Choose CSV
              </button>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
                  <ShieldCheck size={20} className="text-emerald-700" />
                </div>
                <div>
                  <h2 className="font-semibold">Risk preview</h2>
                  <p className="text-sm text-gray-500">Static UI for now</p>
                </div>
              </div>

              <div className="space-y-3">
                {["Duplicate claim number", "High claim amount", "Policy coverage check"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#fbfbfd] p-4"
                    >
                      <p className="text-sm font-medium">{item}</p>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        Review
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}