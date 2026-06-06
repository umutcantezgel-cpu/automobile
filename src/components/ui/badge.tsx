import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant =
  | "default"
  | "primary"
  | "accent"
  | "premium"
  | "success"
  | "warning"
  | "destructive"
  | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: ReactNode;
}

function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors";
  
  const variants: Record<BadgeVariant, string> = {
    default: "bg-neutral-100 text-neutral-600",
    primary: "bg-red-600 text-white",
    accent: "bg-amber-400 text-amber-950",
    premium: "bg-neutral-900 text-white",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-800",
    destructive: "bg-red-100 text-red-700",
    outline: "bg-transparent border border-neutral-200 text-neutral-600",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
