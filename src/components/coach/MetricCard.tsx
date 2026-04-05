'use client';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: string;
  trend: { value: number; direction: 'up' | 'down' } | null;
}

export function MetricCard({ label, value, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.direction === 'up'
                ? 'text-green-400 bg-green-400/10'
                : 'text-red-400 bg-red-400/10'
            }`}
          >
            {trend.direction === 'up' ? '▲' : '▼'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-[#64748b] mt-1">{label}</p>
    </div>
  );
}
