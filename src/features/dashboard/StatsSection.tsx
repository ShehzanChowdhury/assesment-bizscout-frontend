"use client";

import { Card, CardContent } from "@/@components/ui/Card";
import { Skeleton } from "@/@components/ui/Skeleton";
import { Stats } from "@/types";
import { format } from "date-fns";

interface StatsSectionProps {
  stats: Stats | null;
  isLoading?: boolean;
}

export default function StatsSection({ stats, isLoading = false }: StatsSectionProps) {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  const total = stats?.total ?? 0;
  const rate = stats?.successRate ?? 0;
  const avg = stats?.averageLatency ?? 0;
  const last = stats?.lastPingTime ? format(new Date(stats.lastPingTime), "PPpp") : "—";

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

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
