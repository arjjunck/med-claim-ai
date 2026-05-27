import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "secondary" | "danger";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "bg-[#0071e3] text-white shadow-lg shadow-blue-200 hover:bg-[#0066cc]",
    dark:
      "bg-[#1d1d1f] text-white shadow-lg shadow-black/10 hover:bg-black",
    secondary:
      "bg-white text-[#1d1d1f] border border-gray-200 shadow-sm hover:bg-[#f5f5f7]",
    danger:
      "bg-red-600 text-white shadow-lg shadow-red-100 hover:bg-red-700",
  };

  return (
    <button
      {...props}
      className={`rounded-full px-6 py-3 text-sm font-semibold transition hover:scale-[1.02] active:scale-[0.98] ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}