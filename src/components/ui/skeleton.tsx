import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-neutral-200/60", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
