import { Client } from '@/domain/types/Client';
import { MetricCard } from './MetricCard';

interface MetricsSectionProps {
  clients: (Client & { id: string })[];
}

export function MetricsSection({ clients }: MetricsSectionProps) {
  const activeClients = clients.length;
  const pendingPlans = clients.filter((c) => c.plans.length === 0).length;
  const avgCompletion =
    clients.length === 0
      ? 0
      : Math.round(
          clients.reduce((sum, c) => sum + (c.plans.length > 0 ? 100 : 0), 0) /
            clients.length
        );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MetricCard
        label="Active Clients"
        value={activeClients}
        icon="👥"
        trend={null}
      />
      <MetricCard
        label="Pending Plans"
        value={pendingPlans}
        icon="📋"
        trend={null}
      />
      <MetricCard
        label="Avg Completion"
        value={`${avgCompletion}%`}
        icon="✅"
        trend={null}
      />
    </div>
  );
}
