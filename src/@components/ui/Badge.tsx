import React from "react";
import clsx from "clsx";

export function StatusBadge({ status }: { status: number }) {
  const color =
    status >= 200 && status < 300
      ? "bg-green-100 text-green-800 border-green-200"
      : status >= 300 && status < 400
      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
      : "bg-red-100 text-red-800 border-red-200";
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        color
      )}
      aria-label={`HTTP status ${status}`}
    >
      {status}
    </span>
  );
}

