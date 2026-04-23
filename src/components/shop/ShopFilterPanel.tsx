import { cn } from "@/lib/utils";
import { CRAFTS, type Craft } from "@/components/explore/creators-data";

export type CraftFilterValue = Craft | "All";
export type ShopSortValue = "newest" | "price-asc" | "price-desc";

const CRAFT_OPTIONS: readonly CraftFilterValue[] = ["All", ...CRAFTS] as const;

const SORT_OPTIONS: { value: ShopSortValue; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price · Low to high" },
  { value: "price-desc", label: "Price · High to low" },
];

const PRICE_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: "Any price" },
  { label: "Under £75", max: 75 },
  { label: "£75 – £150", min: 75, max: 150 },
  { label: "£150 – £250", min: 150, max: 250 },
  { label: "£250+", min: 250 },
];

interface ShopFilterPanelProps {
  craft: CraftFilterValue;
  onCraftChange: (next: CraftFilterValue) => void;
  craftCounts?: Partial<Record<CraftFilterValue, number>>;

  region: string | "All";
  onRegionChange: (next: string | "All") => void;
  regions: string[];

  sort: ShopSortValue;
  onSortChange: (next: ShopSortValue) => void;

  minPrice: number | undefined;
  maxPrice: number | undefined;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
}

/**
 * Comprehensive filter panel — used inline on desktop and inside the mobile
 * bottom sheet. Renders craft, region, price-band, and sort controls. All
 * controls call back to the parent which is responsible for syncing the
 * URL search params (so links remain shareable).
 */
export function ShopFilterPanel({
  craft,
  onCraftChange,
  craftCounts,
  region,
  onRegionChange,
  regions,
  sort,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceChange,
}: ShopFilterPanelProps) {
  return (
    <div className="space-y-7">
      {/* Craft */}
      <Group label="Craft">
        <PillRow>
          {CRAFT_OPTIONS.map((opt) => {
            const active = opt === craft;
            const count = craftCounts?.[opt];
            return (
              <Pill
                key={opt}
                active={active}
                onClick={() => onCraftChange(opt)}
                aria-pressed={active}
              >
                {opt}
                {typeof count === "number" && (
                  <span
                    className={cn(
                      "ml-1 text-[11px] tabular-nums",
                      active ? "text-warm-white/60" : "text-ink-muted/70",
                    )}
                  >
                    {count}
                  </span>
                )}
              </Pill>
            );
          })}
        </PillRow>
      </Group>

      {/* Price */}
      <Group label="Price">
        <PillRow>
          {PRICE_PRESETS.map((preset) => {
            const active =
              (preset.min ?? undefined) === minPrice &&
              (preset.max ?? undefined) === maxPrice;
            return (
              <Pill
                key={preset.label}
                active={active}
                onClick={() => onPriceChange(preset.min, preset.max)}
                aria-pressed={active}
              >
                {preset.label}
              </Pill>
            );
          })}
        </PillRow>
      </Group>

      {/* Region */}
      <Group label="Region of Kenya">
        <PillRow>
          <Pill
            active={region === "All"}
            onClick={() => onRegionChange("All")}
            aria-pressed={region === "All"}
          >
            All regions
          </Pill>
          {regions.map((r) => {
            const active = region === r;
            return (
              <Pill
                key={r}
                active={active}
                onClick={() => onRegionChange(r)}
                aria-pressed={active}
              >
                {r}
              </Pill>
            );
          })}
        </PillRow>
      </Group>

      {/* Sort */}
      <Group label="Sort by">
        <PillRow>
          {SORT_OPTIONS.map((opt) => {
            const active = opt.value === sort;
            return (
              <Pill
                key={opt.value}
                active={active}
                onClick={() => onSortChange(opt.value)}
                aria-pressed={active}
              >
                {opt.label}
              </Pill>
            );
          })}
        </PillRow>
      </Group>
    </div>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

function PillRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-1 flex flex-wrap gap-2">
      {children}
    </div>
  );
}

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}
function Pill({ active, className, children, ...rest }: PillProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 py-2",
        "text-[13px] font-medium tracking-wide transition-all duration-300 ease-out",
        active
          ? "border-charcoal bg-charcoal text-warm-white"
          : "border-border/80 bg-warm-white text-charcoal/75 hover:border-clay/60 hover:text-clay",
        className,
      )}
    >
      {children}
    </button>
  );
}
