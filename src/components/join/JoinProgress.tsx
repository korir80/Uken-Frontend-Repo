import { cn } from "@/lib/utils";

interface JoinProgressProps {
  step: number;
  total: number;
  labels: readonly string[];
}

export function JoinProgress({ step, total, labels }: JoinProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-ink-muted">
        <span>
          Chapter{" "}
          <span className="text-charcoal tabular-nums">
            {String(step).padStart(2, "0")}
          </span>
          <span className="mx-1.5 text-ink-muted/50">/</span>
          <span className="tabular-nums">{String(total).padStart(2, "0")}</span>
        </span>
        <span className="hidden sm:inline italic font-display text-[15px] normal-case tracking-normal text-charcoal/80">
          {labels[step - 1]}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const completed = i + 1 < step;
          const current = i + 1 === step;
          return (
            <div
              key={i}
              className={cn(
                "h-px flex-1 transition-all duration-700 ease-out",
                completed && "bg-clay",
                current && "bg-terracotta",
                !completed && !current && "bg-border",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
