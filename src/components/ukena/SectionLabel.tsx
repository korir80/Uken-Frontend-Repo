import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "terracotta" | "gold" | "clay" | "muted";
}

const toneMap = {
  terracotta: "text-terracotta before:bg-terracotta",
  gold: "text-gold before:bg-gold",
  clay: "text-clay before:bg-clay",
  muted: "text-ink-muted before:bg-ink-muted",
} as const;

export function SectionLabel({
  className,
  tone = "terracotta",
  children,
  ...props
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[10px] text-[11px] font-medium uppercase tracking-[0.22em]",
        "before:inline-block before:h-px before:w-6 before:content-['']",
        toneMap[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
