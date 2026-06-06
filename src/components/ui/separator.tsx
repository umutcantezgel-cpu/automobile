import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

function Separator({
  orientation = "horizontal",
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-neutral-200/60",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
export type { SeparatorProps };
