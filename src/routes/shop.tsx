import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import { getAllProducts } from "@/components/product/product-data";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import {
  ShopCraftFilter,
  type ShopCraftFilterValue,
} from "@/components/shop/ShopCraftFilter";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop all pieces — Ukena" },
      {
        name: "description",
        content:
          "Browse every piece in the Ukena catalogue — handcrafted in Kenya, attributed to its maker, ready to ship to the UK.",
      },
      { property: "og:title", content: "Shop all pieces — Ukena" },
      {
        property: "og:description",
        content:
          "Every Ukena piece, in one place. Filter by craft, see the maker behind each one.",
      },
    ],
  }),
  component: ShopPage,
});

const PAGE_SIZE = 9;

function ShopPage() {
  const [filter, setFilter] = useState<ShopCraftFilterValue>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Curated/editorial order — defined by the order in product-data.
  const all = useMemo(() => getAllProducts(), []);

  const filtered = useMemo(() => {
    if (filter === "All") return all;
    return all.filter((p) => p.creator.craft === filter);
  }, [all, filter]);

  const counts = useMemo(() => {
    const c: Partial<Record<ShopCraftFilterValue, number>> = {
      All: all.length,
    };
    for (const p of all) {
      const k = p.creator.craft as ShopCraftFilterValue;
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [all]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  // Unique makers in the current view — surfaced so the fast path
  // never quite forgets the people behind the catalogue.
  const uniqueMakers = useMemo(() => {
    const seen = new Set<string>();
    for (const p of filtered) seen.add(p.creator.id);
    return seen.size;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main>
        {/* Editorial header */}
        <section className="border-b border-border/60 bg-warm-white">
          <div className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:px-10 md:pb-20 md:pt-24">
            <SectionLabel>The full catalogue</SectionLabel>
            <h1 className="mt-6 font-display text-[40px] leading-[1.04] tracking-tight text-charcoal md:text-[80px] lg:text-[96px]">
              Every piece,{" "}
              <em className="italic text-terracotta">in one place</em>.
            </h1>
            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:gap-10">
              <p className="md:col-span-7 md:col-start-1 max-w-2xl text-[16px] leading-relaxed text-ink-muted md:text-[17px]">
                For when you already know what you're looking for. Every piece
                here is still made by hand in Kenya — the maker's name travels
                with it from the shelf to your door.{" "}
                <Link
                  to="/explore"
                  className="font-medium text-clay underline-offset-4 transition-colors hover:text-clay-deep hover:underline"
                >
                  Or meet the makers first →
                </Link>
              </p>
              <div className="md:col-span-4 md:col-start-9 flex flex-row items-end justify-between gap-6 md:flex-col md:items-end md:gap-2 md:text-right">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                    Pieces
                  </span>
                  <p className="font-display text-4xl tabular-nums text-charcoal md:text-6xl">
                    {String(all.length).padStart(2, "0")}
                  </p>
                </div>
                <div className="md:mt-4">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                    Makers
                  </span>
                  <p className="font-display text-4xl tabular-nums text-charcoal md:text-6xl">
                    {String(uniqueMakers).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter strip */}
        <section className="sticky top-[68px] z-40 border-b border-border/60 bg-warm-white/95 backdrop-blur-md md:top-[76px]">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4 md:px-10 md:py-5">
            <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.22em] text-ink-muted md:inline">
              Filter by craft
            </span>
            <ShopCraftFilter
              value={filter}
              onChange={(v) => {
                setFilter(v);
                setVisible(PAGE_SIZE);
              }}
              counts={counts}
            />
          </div>
        </section>

        {/* Grid */}
        <section className="bg-warm-white py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            {shown.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display text-3xl italic text-charcoal">
                  No pieces in this craft yet.
                </p>
                <p className="mt-4 text-[15px] text-ink-muted">
                  We're still expanding the catalogue. Try another craft for
                  now.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
                {shown.map((product, i) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    index={i}
                  />
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-14 flex flex-col items-center gap-4 md:mt-20">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="group inline-flex items-center gap-3 rounded-full border border-charcoal/30 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal transition-all duration-300 hover:border-clay hover:bg-clay hover:text-warm-white"
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

      <Footer />
    </div>
  );
}
