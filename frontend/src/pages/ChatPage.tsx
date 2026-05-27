import { Bot, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatPage() {
  return (
    <main className="min-h-screen px-6 py-6 text-[#1d1d1f]">
      <section className="mx-auto max-w-5xl">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-black">
          ← Back to dashboard
        </Link>

        <div className="mt-10 rounded-[2.5rem] border border-white/70 bg-white/75 p-8 shadow-xl backdrop-blur-xl">
          <p className="text-sm font-medium text-[#0071e3]">RAG assistant</p>
          <h1 className="mt-2 text-5xl font-semibold tracking-tight">
            Ask your document.
          </h1>
          <p className="mt-4 max-w-2xl text-gray-600">
            This chat screen will later retrieve document chunks and generate
            source-grounded answers.
          </p>

          <div className="mt-8 rounded-[2rem] bg-[#f5f5f7] p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Bot size={20} className="text-[#0071e3]" />
              </div>

              <div className="rounded-3xl bg-white p-4 text-sm text-gray-700 shadow-sm">
                Upload a policy document first, then ask questions such as:
                “What treatments are covered?” or “What exclusions are listed?”
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-full bg-white p-2 shadow-sm">
              <input
                className="flex-1 bg-transparent px-4 text-sm outline-none"
                placeholder="Ask a question from the uploaded document..."
              />
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0071e3] text-white">
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}