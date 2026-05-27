import {
  Activity,
  FileText,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Documents",
    path: "/documents",
    icon: FileText,
  },
  {
    label: "Claims",
    path: "/claims",
    icon: ShieldCheck,
  },
  {
    label: "Chat",
    path: "/chat",
    icon: MessageSquare,
  },
];

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  }
  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-4 text-[#1d1d1f]">
      <div className="mx-auto grid max-w-[1500px] gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur-xl lg:block">
          <Link to="/" className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d1d1f] text-white shadow-md">
              <Activity size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold leading-none">MediClaim AI</p>
              <p className="mt-1 text-xs text-gray-500">Workspace</p>
            </div>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#1d1d1f] text-white shadow-md"
                      : "text-gray-600 hover:bg-[#f5f5f7] hover:text-black"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] bg-[#f5f5f7] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Sparkles size={18} className="text-[#0071e3]" />
            </div>
            <p className="text-sm font-semibold">AI review assistant</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              RAG document Q&A and explainable claim risk review.
            </p>
          </div>
        </aside>

        <section className="min-h-[calc(100vh-2rem)] rounded-[2rem] border border-white/70 bg-white/55 p-5 shadow-sm backdrop-blur-xl sm:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 rounded-[1.6rem] bg-white/80 p-5 shadow-sm sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-[#0071e3]">{subtitle}</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>
            </div>

<div className="flex items-center gap-3">
  <Link
    to="/"
    className="rounded-full border border-gray-200 bg-white px-5 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition hover:bg-[#f5f5f7]"
  >
    Back home
  </Link>

  <button
    onClick={handleLogout}
    className="rounded-full bg-[#1d1d1f] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black"
  >
    Logout
  </button>
</div>
          </header>

          {children}
        </section>
      </div>
      <MobileNav />
    </main>
  );
}