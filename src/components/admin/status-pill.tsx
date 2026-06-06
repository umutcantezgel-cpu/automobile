"use client";

import { cn } from "@/lib/cn";

type PillStatus = "live" | "entwurf" | "reserviert" | "verkauft";

interface StatusPillProps {
  status: PillStatus;
  className?: string;
}

const statusConfig: Record<PillStatus, { label: string; dot: string; bg: string; text: string }> = {
  live: {
    label: "Live",
    dot: "bg-green-500",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  entwurf: {
    label: "Entwurf",
    dot: "bg-neutral-400",
    bg: "bg-neutral-100",
    text: "text-neutral-700",
  },
  reserviert: {
    label: "Reserviert",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  verkauft: {
    label: "Verkauft",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
};

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider",
        config.bg,
        config.text,
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", config.dot)}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}

export type { PillStatus, StatusPillProps };
