"use client";

import { cn } from "@/lib/cn";

type ToggleSize = "sm" | "md" | "lg";

interface ToggleProps {
  on: boolean;
  onChange: (value: boolean) => void;
  size?: ToggleSize;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const sizeConfig: Record<ToggleSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: "w-8 h-4",
    thumb: "w-3 h-3 left-0.5",
    translate: "translate-x-4",
  },
  md: {
    track: "w-11 h-6",
    thumb: "w-5 h-5 left-0.5",
    translate: "translate-x-5",
  },
  lg: {
    track: "w-14 h-8",
    thumb: "w-7 h-7 left-0.5",
    translate: "translate-x-6",
  },
};

export function Toggle({
  on,
  onChange,
  size = "md",
  disabled = false,
  label,
  className,
}: ToggleProps) {
  const config = sizeConfig[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={cn(
        "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        config.track,
        on ? "bg-red-600" : "bg-neutral-200",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute inline-block rounded-full bg-white shadow top-1/2 -translate-y-1/2 transition duration-200 ease-in-out",
          config.thumb,
          on ? config.translate : "translate-x-0"
        )}
      />
    </button>
  );
}

export type { ToggleProps, ToggleSize };
