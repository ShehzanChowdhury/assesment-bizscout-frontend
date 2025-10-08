import React from "react";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 py-3 border-b border-black/10 dark:border-white/10 ${className || ""}`}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 py-3 ${className || ""}`}>{children}</div>;
}

