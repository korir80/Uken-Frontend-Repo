import { cn } from "@/lib/utils";
import { CRAFTS, type Craft } from "./creators-data";

export type CraftFilterValue = Craft | "All";

const ALL_CRAFTS: readonly CraftFilterValue[] = ["All", ...CRAFTS] as const;

interface CraftFilterProps {
  value: CraftFilterValue;
  onChange: (next: CraftFilterValue) => void;
  counts?: Partial<Record<CraftFilterValue, number>>;
}

export function CraftFilter({ value, onChange, counts }: CraftFilterProps) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
      <ul className="flex w-max gap-2 md:w-full md:flex-wrap">
        {ALL_CRAFTS.map((craft) => {
          const active = craft === value;
          const count = counts?.[craft];
          return (
            <li key={craft}>
              <button
                type="button"
                onClick={() => onChange(craft)}
                aria-pressed={active}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full border px-5 py-2.5",
                  "text-[13px] font-medium tracking-wide transition-all duration-300 ease-out",
                  active
                    ? "border-charcoal bg-charcoal text-warm-white"
                    : "border-border/80 bg-warm-white text-charcoal/75 hover:border-clay/60 hover:text-clay",
                )}
              >
                <span>{craft}</span>
                {typeof count === "number" && (
                  <span
                    className={cn(
                      "text-[11px] tabular-nums tracking-wider transition-colors",
                      active ? "text-warm-white/60" : "text-ink-muted/70",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
