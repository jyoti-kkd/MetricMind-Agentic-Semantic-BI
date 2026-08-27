type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  changeType?: "positive" | "negative";
};

export default function MetricCard({
  title,
  value,
  change,
  changeType = "positive",
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-400">
        {title}
      </p>

      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-2xl font-bold tracking-tight text-white">
          {value}
        </p>

        <span
          className={`text-sm font-medium ${
            changeType === "positive"
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}