"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-4 disabled:opacity-50 disabled:bg-neutral-50 disabled:cursor-not-allowed",
            error 
              ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
              : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-100",
            className
          )}
          aria-invalid={error || undefined}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "text-[13px] font-medium px-1",
              error ? "text-red-600 font-semibold" : "text-neutral-500"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
