type PageCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageCard({ children, className = "" }: PageCardProps) {
  return (
    <section
      className={`rounded-[2rem] border border-white/80 bg-white p-6 shadow-sm backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}