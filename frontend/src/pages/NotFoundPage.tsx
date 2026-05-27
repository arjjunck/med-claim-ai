import { Activity, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10 text-[#1d1d1f]">
      <section className="w-full max-w-2xl rounded-[2.5rem] border border-white/80 bg-white/75 p-8 text-center shadow-2xl shadow-gray-300/40 backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#1d1d1f] text-white shadow-md">
          <Activity size={28} />
        </div>

        <p className="text-sm font-medium text-[#0071e3]">404</p>

        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          Page not found.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
          The page you are looking for does not exist or may have been moved.
          Return to the MediClaim AI dashboard to continue.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-[#0071e3] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.02] hover:bg-[#0066cc]"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}