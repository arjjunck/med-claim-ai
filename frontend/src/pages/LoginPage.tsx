import { useState } from "react";
import { Activity, ArrowRight, Lock, Mail, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("demo@mediclaim.ai");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      const result = await loginUser(email, password);

      localStorage.setItem("token", result.token);
      localStorage.setItem("userEmail", result.email);
      localStorage.setItem("userName", result.fullName);

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsLoading(false);
    }
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
            Secure workspace
          </p>

          <h1 className="mt-3 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Sign in to review documents and claims.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            This login page now connects to the ASP.NET Core JWT authentication
            backend.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["JWT auth", "PostgreSQL", "Protected API"].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/80 bg-white/70 p-4 text-sm font-medium shadow-sm backdrop-blur-xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/80 bg-white/75 p-6 shadow-2xl shadow-gray-300/40 backdrop-blur-xl">
          <div className="rounded-[2rem] bg-[#f5f5f7] p-6">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Sign in with a registered account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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

              {error && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#0071e3] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] hover:bg-[#0066cc] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4 text-sm shadow-sm">
              <div>
                <p className="font-medium">New to MediClaim AI?</p>
                <p className="text-xs text-gray-500">Create an account</p>
              </div>

              <Link
                to="/register"
                className="flex items-center gap-2 rounded-full bg-[#1d1d1f] px-4 py-2 text-xs font-medium text-white"
              >
                Register
                <UserPlus size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}