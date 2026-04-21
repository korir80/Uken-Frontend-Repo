import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "line" | "ornament" | "dotted";
  label?: string;
}

export function Divider({
  className,
  variant = "line",
  label,
  ...props
}: DividerProps) {
  if (variant === "ornament") {
    return (
      <div
        role="separator"
        className={cn("flex items-center justify-center gap-4 py-2", className)}
        {...props}
      >
        <span className="h-px w-16 bg-border" />
        <span className="font-display text-xl text-terracotta leading-none">
          ❋
        </span>
        <span className="h-px w-16 bg-border" />
      </div>
    );
  }

  if (variant === "dotted") {
    return (
      <div
        role="separator"
        className={cn(
          "h-px w-full",
          "bg-[radial-gradient(circle,oklch(0.7_0.02_60)_1px,transparent_1px)] bg-[length:8px_1px]",
          className,
        )}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={cn("flex items-center gap-4", className)}
        {...props}
      >
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          {label}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-border to-transparent",
        className,
      )}
      {...props}
    />
  );
}
