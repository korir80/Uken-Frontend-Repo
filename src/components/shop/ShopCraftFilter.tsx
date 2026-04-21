import { cn } from "@/lib/utils";
import { CRAFTS, type Craft } from "@/components/explore/creators-data";

export type ShopCraftFilterValue = Craft | "All";

const ALL: readonly ShopCraftFilterValue[] = ["All", ...CRAFTS] as const;

interface ShopCraftFilterProps {
  value: ShopCraftFilterValue;
  onChange: (next: ShopCraftFilterValue) => void;
  counts?: Partial<Record<ShopCraftFilterValue, number>>;
}

export function ShopCraftFilter({ value, onChange, counts }: ShopCraftFilterProps) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
      <ul className="flex w-max gap-2 md:w-full md:flex-wrap">
        {ALL.map((craft) => {
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
