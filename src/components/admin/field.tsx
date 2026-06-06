import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldSpan = 1 | 2 | 3 | 4;

interface FieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  span?: FieldSpan;
  className?: string;
}

const spanClasses: Record<FieldSpan, string> = {
  1: "col-span-1",
  2: "col-span-1 sm:col-span-2",
  3: "col-span-1 sm:col-span-3",
  4: "col-span-1 sm:col-span-4",
};

export function Field({
  label,
  hint,
  required = false,
  children,
  span = 1,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", spanClasses[span], className)}>
      <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1">
        <span>{label}</span>
        {required && (
          <span className="text-red-500" aria-label="Pflichtfeld">
            *
          </span>
        )}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-neutral-500 mt-1">
          {hint}
        </p>
      )}
    </div>
  );
}

export type { FieldProps, FieldSpan };
