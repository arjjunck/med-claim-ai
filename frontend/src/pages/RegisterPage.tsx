import { useState } from "react";
import { Activity, ArrowRight, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("Demo User");
  const [email, setEmail] = useState("demo@mediclaim.ai");
  const [password, setPassword] = useState("password123");

  function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("userName", fullName);
    localStorage.setItem("userEmail", email);

    navigate("/dashboard");
  }

  return (
    <main className="min-h-screen px-6 py-6 text-[#1d1d1f]">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <Link to="/" className="mb-10 inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white shadow-md">
              <Activity size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold leading-none">MediClaim AI</p>
              <p className="mt-1 text-xs text-gray-500">
                Medical document intelligence
              </p>
            </div>
          </Link>

          <p className="text-sm font-medium text-[#0071e3]">
            Create your workspace
          </p>

          <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Start building a safer claim review workflow.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Register to access the dashboard, upload documents, analyse claim
            files, and test the AI assistant interface.
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-white/80 bg-white/75 p-6 shadow-2xl shadow-gray-300/40 backdrop-blur-xl">
          <div className="rounded-[2rem] bg-[#f5f5f7] p-6">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Create account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Frontend demo registration for now.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full name
                </label>

                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <User size={18} className="text-gray-400" />
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <Mail size={18} className="text-gray-400" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <Lock size={18} className="text-gray-400" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] hover:bg-[#0066cc]"
              >
                Create account
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#0071e3]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}