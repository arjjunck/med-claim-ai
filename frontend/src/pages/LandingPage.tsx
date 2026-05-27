import {
  Activity,
  ArrowRight,
  FileText,
  ShieldCheck,
  Brain,
  UploadCloud,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Medical Document Assistant",
    description: "Upload policy or medical PDFs and ask source-grounded questions.",
    icon: FileText,
  },
  {
    title: "Claim Risk Explainer",
    description: "Review claim CSV files with simple, explainable risk indicators.",
    icon: ShieldCheck,
  },
  {
    title: "RAG + AI Layer",
    description: "Retrieve document context before generating AI explanations.",
    icon: Brain,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-6 py-6 text-[#1d1d1f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-5 py-3 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d1d1f] text-white shadow-md">
            <Activity size={19} />
          </div>

          <div>
            <p className="text-sm font-semibold leading-none">MediClaim AI</p>
            <p className="mt-1 text-xs text-gray-500">Document intelligence</p>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
          <a className="transition hover:text-black" href="#features">
            Features
          </a>
          <a className="transition hover:text-black" href="#workflow">
            Workflow
          </a>
          <a className="transition hover:text-black" href="#demo">
            Demo
          </a>
        </div>

        <Link
          to="/login"
          className="rounded-full bg-[#0071e3] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#0066cc]"
        >
          Start demo
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 py-20 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur">
            <Sparkles size={16} className="text-[#0071e3]" />
            AI-powered medical document and claim review
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-[#1d1d1f] sm:text-6xl lg:text-7xl">
            Review medical documents with clarity.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Upload policy documents, ask grounded questions, analyse claim files,
            and understand risk flags through clear AI-generated explanations.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/documents"
              className="group flex items-center justify-center gap-2 rounded-full bg-[#1d1d1f] px-7 py-3 text-sm font-medium text-white shadow-lg shadow-black/10 transition hover:scale-[1.02]"
            >
              Upload document
              <UploadCloud
                size={17}
                className="transition group-hover:-translate-y-0.5"
              />
            </Link>

            <Link
              to="/dashboard"
              className="group flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/80 px-7 py-3 text-sm font-medium text-[#1d1d1f] shadow-sm backdrop-blur transition hover:scale-[1.02] hover:bg-white"
            >
              View workflow
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-blue-200/40 via-white to-emerald-200/30 blur-2xl" />

          <div className="relative rounded-[2.2rem] border border-white/70 bg-white/75 p-5 shadow-2xl shadow-gray-300/40 backdrop-blur-2xl">
            <div className="rounded-[1.7rem] bg-[#f5f5f7] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Overview</p>
                  <h2 className="mt-1 text-2xl font-semibold">Claim Review</h2>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  MVP
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-3xl border border-white bg-white p-4 shadow-sm">
                  <p className="text-3xl font-semibold">0</p>
                  <p className="mt-1 text-xs text-gray-500">Documents</p>
                </div>

                <div className="rounded-3xl border border-white bg-white p-4 shadow-sm">
                  <p className="text-3xl font-semibold">0</p>
                  <p className="mt-1 text-xs text-gray-500">Claims</p>
                </div>

                <div className="rounded-3xl border border-white bg-white p-4 shadow-sm">
                  <p className="text-3xl font-semibold">0</p>
                  <p className="mt-1 text-xs text-gray-500">Risks</p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold">Risk workflow</p>
                  <p className="text-xs text-gray-400">Live preview</p>
                </div>

                <div className="space-y-3">
                  {[
                    "Upload PDF",
                    "Ask document question",
                    "Upload claim CSV",
                    "Generate explanation",
                  ].map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + index * 0.12 }}
                      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#fbfbfd] p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0071e3] text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium text-gray-700">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-7xl pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.12 }}
                whileHover={{ y: -6 }}
                className="rounded-[2rem] border border-white/70 bg-white/75 p-7 shadow-sm backdrop-blur-xl transition"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f5f7]">
                  <Icon size={22} className="text-[#0071e3]" />
                </div>

                <h3 className="text-xl font-semibold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}