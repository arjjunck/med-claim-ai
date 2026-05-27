type StatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export default function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-[1.8rem] border border-white/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{helper}</p>
    </div>
  );
}