"use client";

import { cn } from "@/lib/cn";

type PlaceholderAspect = "16/9" | "4/3" | "1/1" | "21/9" | "16/10";
type PlaceholderVariant = "default" | "premium" | "editorial";

interface PlaceholderProps {
  label?: string;
  aspect?: PlaceholderAspect;
  variant?: PlaceholderVariant;
  className?: string;
}

const aspectMap: Record<PlaceholderAspect, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "16/10": "aspect-[16/10]",
};

const variantStyles: Record<PlaceholderVariant, string> = {
  default: "bg-neutral-100 border-2 border-dashed border-neutral-200",
  premium: "bg-neutral-900 border border-neutral-800 shadow-inner",
  editorial: "bg-neutral-50 border border-neutral-200",
};

const labelColorMap: Record<PlaceholderVariant, string> = {
  default: "text-neutral-400",
  premium: "text-neutral-500",
  editorial: "text-neutral-400",
};

export function Placeholder({
  label = "PLACEHOLDER",
  aspect = "16/10",
  variant = "default",
  className,
}: PlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl w-full",
        aspectMap[aspect],
        variantStyles[variant],
        className
      )}
    >
      <span
        className={cn(
          "font-mono text-sm font-bold tracking-widest",
          labelColorMap[variant]
        )}
      >
        {label}
      </span>
    </div>
  );
}
