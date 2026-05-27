import {
  FileText,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Home",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Docs",
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

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 rounded-full border border-white/70 bg-white/85 px-3 py-2 shadow-xl backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center rounded-full px-3 py-2 text-xs font-medium transition ${
                active
                  ? "bg-[#1d1d1f] text-white"
                  : "text-gray-500 hover:bg-[#f5f5f7] hover:text-black"
              }`}
            >
              <Icon size={17} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}