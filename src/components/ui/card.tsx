import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "default" | "hoverable" | "premium" | "top-listing";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children?: ReactNode;
}

function Card({ variant = "default", className, children, ...props }: CardProps) {
  const baseStyles = "relative flex flex-col rounded-3xl bg-white border border-neutral-200/60 shadow-sm overflow-hidden";
  
  const variants: Record<CardVariant, string> = {
    default: "",
    hoverable: "transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50 hover:border-neutral-300 hover:-translate-y-1",
    premium: "bg-neutral-900 border-neutral-800 shadow-xl text-white",
    "top-listing": "border-red-600 shadow-md ring-1 ring-red-600/10",
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {variant === "top-listing" && (
        <div className="absolute top-0 right-0 z-10 px-4 py-1.5 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-bl-xl shadow-sm">
          Top-Inserat
        </div>
      )}
      {children}
    </div>
  );
}

/* ─── CardHeader ────────────────────────────────────────────────── */

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn("p-6 md:p-8 flex flex-col gap-1.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ─── CardContent ───────────────────────────────────────────────── */

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("px-6 md:px-8 pb-6 md:pb-8 flex-1", className)} {...props}>
      {children}
    </div>
  );
}

/* ─── CardFooter ────────────────────────────────────────────────── */

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn("px-6 md:px-8 py-5 mt-auto flex items-center justify-between border-t border-neutral-200/60 bg-neutral-50/50", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps, CardVariant, CardHeaderProps, CardContentProps, CardFooterProps };
