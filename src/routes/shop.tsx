import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import type { Product } from "@/components/product/product-data";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import {
  ShopFilterPanel,
  type CraftFilterValue,
  type ShopSortValue,
} from "@/components/shop/ShopFilterPanel";
import { CRAFTS } from "@/components/explore/creators-data";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { QuickViewDrawer } from "@/components/shop/QuickViewDrawer";
import { useAllProducts, productsQueryOptions } from "@/lib/queries";
import type { ProductDto } from "@/services";

/** ProductDto ⊂ Product for the fields we render. Cast at the boundary so
 *  the existing card components keep their seed-shaped types. */
function asProduct(p: ProductDto): Product {
  return p as unknown as Product;
}

/* ── URL search-param schema ─────────────────────────────────────────── */
const shopSearchSchema = z.object({
  craft: fallback(
    z.enum(["All", ...CRAFTS] as [CraftFilterValue, ...CraftFilterValue[]]),
    "All",
  ).default("All"),
  region: fallback(z.string(), "All").default("All"),
  minPrice: fallback(z.number().int().nonnegative().optional(), undefined),
  maxPrice: fallback(z.number().int().nonnegative().optional(), undefined),
  sort: fallback(
    z.enum(["newest", "price-asc", "price-desc"]),
    "newest",
  ).default("newest"),
});

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(shopSearchSchema),
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(productsQueryOptions());
  },
  head: () => ({
    meta: [
      { title: "Shop all pieces — Uken" },
      {
        name: "description",
        content:
          "Browse every piece in the Uken catalogue — handcrafted in Kenya, attributed to its maker, ready to ship to the UK.",
      },
      { property: "og:title", content: "Shop all pieces — Uken" },
      {
        property: "og:description",
        content:
          "Every Uken piece, in one place. Filter by craft, region, and price.",
      },
    ],
  }),
  component: ShopPage,
});

const PAGE_SIZE = 9;

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useAllProducts();
  const all = useMemo<Product[]>(
    () => (products ?? []).map(asProduct),
    [products],
  );

  // Distinct regions, alphabetised — derived from the catalogue.
  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const p of all) set.add(p.creator.region);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [all]);

  /** Single source of truth: URL search params drive the visible grid. */
  const filtered = useMemo(() => {
    const minPence =
      typeof search.minPrice === "number" ? search.minPrice * 100 : undefined;
    const maxPence =
      typeof search.maxPrice === "number" ? search.maxPrice * 100 : undefined;

    let next = all.filter((p) => {
      if (search.craft !== "All" && p.creator.craft !== search.craft) return false;
      if (search.region !== "All" && p.creator.region !== search.region) return false;
      if (typeof minPence === "number" && p.pricePence < minPence) return false;
      if (typeof maxPence === "number" && p.pricePence > maxPence) return false;
      return true;
    });

    // "newest" defaults to the data order — newer items appear first in the
    // mock dataset. Real API will return a sorted feed; we stay stable here.
    if (search.sort === "price-asc") {
      next = [...next].sort((a, b) => a.pricePence - b.pricePence);
    } else if (search.sort === "price-desc") {
      next = [...next].sort((a, b) => b.pricePence - a.pricePence);
    }
    return next;
  }, [all, search.craft, search.region, search.minPrice, search.maxPrice, search.sort]);

  /** Counts ignore the craft facet itself so the user can see how many
   *  pieces wait behind each chip even after they've narrowed by craft. */
  const craftCounts = useMemo(() => {
    const c: Partial<Record<CraftFilterValue, number>> = { All: all.length };
    for (const p of all) {
      const k = p.creator.craft as CraftFilterValue;
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [all]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const uniqueMakers = useMemo(() => {
    const seen = new Set<string>();
    for (const p of filtered) seen.add(p.creator.id);
    return seen.size;
  }, [filtered]);

  /** Active filter count, for the mobile button badge. */
  const activeCount =
    (search.craft !== "All" ? 1 : 0) +
    (search.region !== "All" ? 1 : 0) +
    (typeof search.minPrice === "number" || typeof search.maxPrice === "number"
      ? 1
      : 0) +
    (search.sort !== "newest" ? 1 : 0);

  function patchSearch(patch: Partial<typeof search>) {
    setVisible(PAGE_SIZE);
    navigate({
      search: (prev: typeof search) => ({ ...prev, ...patch }),
      replace: false,
    });
  }

  function resetFilters() {
    setVisible(PAGE_SIZE);
    navigate({
      search: () => ({
        craft: "All" as const,
        region: "All",
        sort: "newest" as const,
        minPrice: undefined,
        maxPrice: undefined,
      }),
    });
  }

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main className="pb-24 md:pb-0">
        {/* Compact editorial header — tight, leaves products visible above the fold */}
        <section className="bg-warm-white">
          <div className="mx-auto max-w-7xl px-5 pb-5 pt-6 md:px-10 md:pb-7 md:pt-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="max-w-2xl">
                <SectionLabel>The full catalogue</SectionLabel>
                <h1 className="mt-3 font-display text-[30px] leading-[1.05] tracking-tight text-charcoal sm:text-[34px] md:mt-3 md:text-[42px]">
                  Every piece,{" "}
                  <em className="italic text-terracotta">in one place</em>.
                </h1>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted md:text-sm">
                  Handmade in Kenya, attributed to the maker.{" "}
                  <Link
                    to="/explore"
                    className="font-medium text-clay underline-offset-4 transition-colors hover:text-clay-deep hover:underline"
                  >
                    Meet the makers first →
                  </Link>
                </p>
              </div>
              <div className="flex shrink-0 items-end gap-8 md:gap-10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    Pieces
                  </span>
                  <p className="font-display text-3xl tabular-nums leading-none text-charcoal md:text-4xl">
                    {String(all.length).padStart(2, "0")}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    Makers
                  </span>
                  <p className="font-display text-3xl tabular-nums leading-none text-charcoal md:text-4xl">
                    {String(uniqueMakers).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slim filter bar — single row, products visible immediately below */}
        <section className="sticky top-[60px] z-40 border-y border-border/60 bg-warm-white/95 backdrop-blur-md md:top-[76px]">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-2.5 md:px-10 md:py-3">
            {/* Mobile: single trigger that opens the sheet */}
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex min-h-[40px] flex-1 items-center justify-between gap-2 rounded-full border border-charcoal/25 bg-warm-white px-4 py-2 text-[13px] font-medium text-charcoal md:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter & Sort
              </span>
              {activeCount > 0 && (
                <span className="rounded-full bg-charcoal px-2 py-0.5 text-[10px] font-medium tabular-nums text-warm-white">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Desktop: compact toolbar — craft chips inline + a "More filters" trigger */}
            <div className="hidden flex-1 items-center gap-2 md:flex">
              {/* Craft chips inline (the most-used facet) */}
              <div className="flex flex-1 flex-wrap items-center gap-1.5">
                {(["All", ...CRAFTS] as CraftFilterValue[]).map((opt) => {
                  const active = opt === search.craft;
                  const count = craftCounts[opt];
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => patchSearch({ craft: opt })}
                      aria-pressed={active}
                      className={
                        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors " +
                        (active
                          ? "border-charcoal bg-charcoal text-warm-white"
                          : "border-border/70 bg-warm-white text-charcoal/70 hover:border-clay/60 hover:text-clay")
                      }
                    >
                      <span>{opt}</span>
                      {typeof count === "number" && (
                        <span
                          className={
                            "text-[10px] tabular-nums " +
                            (active ? "text-warm-white/60" : "text-ink-muted/70")
                          }
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* More filters trigger (region/price/sort live in the sheet on desktop too) */}
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex min-h-[36px] shrink-0 items-center gap-2 rounded-full border border-charcoal/25 bg-warm-white px-4 py-1.5 text-[12px] font-medium text-charcoal transition-colors hover:border-clay hover:text-clay"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                More filters
                {activeCount > 0 && (
                  <span className="ml-1 rounded-full bg-charcoal px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-warm-white">
                    {activeCount}
                  </span>
                )}
              </button>

              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex min-h-[36px] shrink-0 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted hover:text-clay"
                >
                  <X className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Mobile filter sheet */}
        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Filter & Sort"
          footer={
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-[13px] font-medium uppercase tracking-[0.18em] text-charcoal/70 hover:text-clay"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-charcoal px-6 text-[13px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay"
              >
                Show {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
              </button>
            </div>
          }
        >
          <ShopFilterPanel
            craft={search.craft}
            onCraftChange={(craft) => patchSearch({ craft })}
            craftCounts={craftCounts}
            region={search.region}
            onRegionChange={(region) => patchSearch({ region })}
            regions={regions}
            sort={search.sort}
            onSortChange={(sort) => patchSearch({ sort })}
            minPrice={search.minPrice}
            maxPrice={search.maxPrice}
            onPriceChange={(minPrice, maxPrice) =>
              patchSearch({ minPrice, maxPrice })
            }
          />
        </BottomSheet>

        {/* Grid — masonry on desktop via CSS columns, 2-col on mobile */}
        <section className="bg-warm-white pb-10 pt-6 md:pb-20 md:pt-8">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            {isLoading && shown.length === 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-cream" />
                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-cream" />
                    <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-cream" />
                  </div>
                ))}
              </div>
            ) : shown.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-display text-2xl italic text-charcoal md:text-3xl">
                  Nothing matches those filters yet.
                </p>
                <p className="mt-4 text-base text-ink-muted">
                  Try widening the price range or clearing a craft.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex min-h-[48px] items-center gap-3 rounded-full border border-charcoal/30 px-7 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-clay hover:bg-clay hover:text-warm-white"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                {/* Mobile: clean 2-col grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:hidden">
                  {shown.map((product, i) => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      onQuickView={setQuickProduct}
                    />
                  ))}
                </div>

                {/* Desktop: true masonry via CSS columns */}
                <div className="hidden gap-x-8 md:block md:columns-2 lg:columns-3">
                  {shown.map((product, i) => (
                    <div
                      key={product.id}
                      className="mb-12 break-inside-avoid"
                    >
                      <ShopProductCard
                        product={product}
                        index={i}
                        onQuickView={setQuickProduct}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {hasMore && (
              <div className="mt-12 flex flex-col items-center gap-4 md:mt-20">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="group inline-flex min-h-[48px] items-center gap-3 rounded-full border border-charcoal/30 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal transition-all duration-300 hover:border-clay hover:bg-clay hover:text-warm-white"
                >
                  More pieces
                  <span
                    aria-hidden
                    className="inline-block h-px w-6 bg-charcoal/40 transition-all duration-300 group-hover:w-10 group-hover:bg-warm-white/70"
                  />
                </button>
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  Showing {shown.length} of {filtered.length}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Quick view side drawer */}
      <QuickViewDrawer
        product={quickProduct}
        onClose={() => setQuickProduct(null)}
      />

      <Footer />
    </div>
  );
}

// Re-export for backward compatibility — the BottomSheet and other consumers
// previously imported this from the route file.
export type { ShopSortValue };
