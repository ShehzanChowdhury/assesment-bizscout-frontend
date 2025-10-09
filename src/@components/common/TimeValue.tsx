'use client';

import { format } from "date-fns";

interface TimeValueProps {
  time: string | null;
}

export default function TimeValue({ time }: TimeValueProps) {
  if (!time) return <span className="text-xl font-semibold">—</span>;
  return (
    <span className="text-xl font-semibold">
      {format(new Date(time), "PPpp")}
    </span>
  );
}