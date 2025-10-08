"use client";

interface ConnectionStatusProps {
  connected: boolean;
}

export default function ConnectionStatus({ connected }: ConnectionStatusProps) {
  const label = connected ? "Connected" : "Disconnected";
  const color = connected ? "bg-green-500" : "bg-red-500";
  return (
    <div className="inline-flex items-center gap-2 text-xs" role="status" aria-live="polite">
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden />
      <span>{label}</span>
    </div>
  );
}

