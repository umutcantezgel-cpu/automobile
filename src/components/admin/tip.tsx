"use client";

import { useState, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export function Tip({ content, children, className }: TipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  }

  function hide() {
    timeoutRef.current = setTimeout(() => setVisible(false), 120);
  }

  return (
    <span
      className={cn("relative inline-flex items-center", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded shadow-lg z-50 text-center"
        >
          {content}
          {/* Arrow */}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-neutral-900"
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  );
}

export type { TipProps };
