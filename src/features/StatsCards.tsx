import { Card, CardContent } from "@/@components/ui/Card";
import { Stats } from "@/types";
import { format } from "date-fns";

export default function StatsCards({ stats }: { stats: Stats | null }) {
  const total = stats?.total ?? 0;
  const rate = (stats?.successRate ?? 0) * 100;
  const avg = stats?.avgLatency ?? 0;
  const lastPingTime = stats ? new Date().toISOString() : null;
  const last = lastPingTime ? format(new Date(lastPingTime), "PPpp") : "—";
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Requests" value={total.toLocaleString()} />
      <StatCard label="Success Rate" value={`${rate.toFixed(1)}%`} />
      <StatCard label="Avg Latency" value={`${avg.toFixed(0)} ms`} />
      <StatCard label="Last Ping" value={last} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">{label}</span>
          <span className="text-xl font-semibold">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
}

