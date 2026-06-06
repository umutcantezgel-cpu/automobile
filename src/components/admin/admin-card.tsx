import { type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/cn";

interface AdminCardProps {
  title: string;
  subtitle?: string;
  icon?: ElementType;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function AdminCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className,
  noPadding = false,
}: AdminCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:px-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 shrink-0">
              <Icon size={18} />
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-[15px] font-bold text-neutral-900 m-0">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs font-medium text-neutral-500 m-0 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div className="flex items-center">{action}</div>}
      </div>

      {/* Separator */}
      <div className="h-[1px] w-full bg-neutral-100" />

      {/* Content */}
      <div className={cn(!noPadding && "p-5 md:p-6")}>{children}</div>
    </div>
  );
}

export type { AdminCardProps };
