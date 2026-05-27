import { Brain, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ClaimResult } from "../types/claim";

type ExplanationModalProps = {
  claim: ClaimResult | null;
  onClose: () => void;
};

export default function ExplanationModal({
  claim,
  onClose,
}: ExplanationModalProps) {
  if (!claim) return null;

  const explanation = {
    summary:
      claim.riskLevel === "High"
        ? "This claim requires manual review before approval."
        : claim.riskLevel === "Medium"
        ? "This claim may require additional supporting checks."
        : "This claim does not show major rule-based risk indicators.",
    why:
      claim.riskReason ||
      "The system reviewed the claim using simple rule-based checks.",
    nextStep:
      claim.riskLevel === "High"
        ? "Verify duplicate records, supporting documents, policy coverage and provider details."
        : claim.riskLevel === "Medium"
        ? "Check whether the amount and procedure are consistent with policy limits."
        : "Proceed with standard review workflow.",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
              <Brain size={22} className="text-[#0071e3]" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                AI Risk Explanation
              </h2>
              <p className="text-sm text-gray-500">
                Frontend simulation for claim {claim.claimNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f7] text-gray-500 transition hover:bg-gray-200 hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-[1.5rem] bg-[#f5f5f7] p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Claim</p>
              <p className="mt-1 font-semibold">{claim.claimNumber}</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Procedure</p>
              <p className="mt-1 font-semibold">{claim.procedureCode}</p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Amount</p>
              <p className="mt-1 font-semibold">€{claim.amount}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" />
              <h3 className="font-semibold">Risk summary</h3>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              {explanation.summary}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Brain size={18} className="text-[#0071e3]" />
              <h3 className="font-semibold">Why it was flagged</h3>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              {explanation.why}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <h3 className="font-semibold">Suggested next step</h3>
            </div>
            <p className="text-sm leading-6 text-gray-600">
              {explanation.nextStep}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-700">
          This is a decision-support explanation. It does not declare fraud or
          make a final claim decision.
        </div>
      </div>
    </div>
  );
}