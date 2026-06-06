"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonVariant = "default" | "primary" | "ghost" | "outline" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon" | "icon-sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants: Record<ButtonVariant, string> = {
      default: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 focus:ring-neutral-100",
      primary: "bg-red-600 text-white border border-transparent hover:bg-red-700 focus:ring-red-100 shadow-sm hover:shadow-md",
      ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-neutral-100",
      outline: "bg-transparent text-neutral-900 border border-neutral-900 hover:bg-neutral-900 hover:text-white focus:ring-neutral-200",
      destructive: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 focus:ring-red-50",
    };

    const sizes: Record<ButtonSize, string> = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-[15px]",
      lg: "h-14 px-8 text-[15px]",
      xl: "h-16 px-10 text-lg",
      icon: "h-11 w-11 p-0",
      "icon-sm": "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2
            className="mr-2 animate-spin"
            size={size === "sm" || size === "icon-sm" ? 14 : 16}
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
