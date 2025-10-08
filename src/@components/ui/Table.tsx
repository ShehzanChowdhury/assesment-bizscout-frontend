import React from "react";

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <table className={`w-full text-sm ${className || ""}`}>{children}</table>;
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="text-left text-xs text-zinc-500">{children}</thead>;
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-black/10 dark:divide-white/10">{children}</tbody>;
}

export function TR({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={className}>{children}</tr>;
}

export function TH({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 font-medium ${className || ""}`}>{children}</th>;
}

export function TD({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 align-top ${className || ""}`}>{children}</td>;
}

