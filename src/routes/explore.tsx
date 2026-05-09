import { routeSeo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import {
  CraftFilter,
  type CraftFilterValue,
} from "@/components/explore/CraftFilter";
import { CreatorCard } from "@/components/explore/CreatorCard";
import type { Creator, Craft } from "@/components/explore/creators-data";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useCreators, creatorsQueryOptions } from "@/lib/queries";
import type { CreatorSummary } from "@/services";

export const Route = createFileRoute("/explore")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(creatorsQueryOptions());
  },
  head: () => routeSeo({
    path: "/explore",
    title: "Meet the makers of Kenya — UKEN",
    description:
      "Browse the Kenyan farmers, artisans, and makers behind every UKEN product. Discover the people behind the work.",
  }),
  component: ExplorePage,
});

const PAGE_SIZE = 6;

/** Adapt a CreatorSummary into the layout-aware Creator shape used by cards. */
function toCreator(c: CreatorSummary, index: number): Creator {
  return {
    id: c.id,
    firstName: c.firstName,
    fullName: c.fullName,
    craft: c.craft as Craft,
    region: c.region,
    hook: c.hook,
    image: c.image,
    // Every 4th card stretches taller, breaking the masonry rhythm.
    emphasis: index % 4 === 0 ? "tall" : "standard",
  };
}

function ExplorePage() {
  const [filter, setFilter] = useState<CraftFilterValue>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftFilter, setDraftFilter] = useState<CraftFilterValue>("All");

  const { data: rawCreators = [], isLoading } = useCreators();

  const creators = useMemo(
    () => rawCreators.map((c, i) => toCreator(c, i)),
    [rawCreators],
  );

  const filtered = useMemo(() => {
    if (filter === "All") return creators;
    return creators.filter((c) => c.craft === filter);
  }, [filter, creators]);

  const counts = useMemo(() => {
    const c: Partial<Record<CraftFilterValue, number>> = { All: creators.length };
    for (const creator of creators) {
      c[creator.craft] = (c[creator.craft] ?? 0) + 1;
    }
    return c;
  }, [creators]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main className="pb-24 md:pb-0">
        {/* Compact editorial header — tight, leaves cards visible above the fold */}
        <section className="bg-warm-white">
          <div className="mx-auto max-w-7xl px-5 pb-5 pt-6 md:px-10 md:pb-7 md:pt-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="max-w-2xl">
                <SectionLabel>An ongoing index</SectionLabel>
                <h1 className="mt-3 font-display text-[30px] leading-[1.05] tracking-tight text-charcoal sm:text-[34px] md:mt-3 md:text-[42px]">
                  The makers{" "}
                  <em className="italic text-terracotta">of Kenya</em>.
                </h1>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-muted md:text-sm">
                  Seven regions. Farms, studios, and workshops. Begin with whoever holds your eye — the products will follow.
                </p>
              </div>
              <div className="flex shrink-0 items-end gap-8 md:gap-10">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    In the index
                  </span>
                  <p className="font-display text-3xl tabular-nums leading-none text-charcoal md:text-4xl">
                    {String(creators.length).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Slim filter strip — single row, cards visible immediately below */}
        <section className="sticky top-[64px] z-40 border-y border-border/60 bg-warm-white/95 backdrop-blur-md md:top-[76px]">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-2.5 md:px-10 md:py-3">
            <button
              type="button"
              onClick={() => {
                setDraftFilter(filter);
                setSheetOpen(true);
              }}
              className="inline-flex min-h-[44px] flex-1 items-center justify-between gap-2 rounded-full border border-charcoal/25 bg-warm-white px-5 py-2.5 text-[14px] font-medium text-charcoal md:hidden"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filter & Sort
              </span>
              <span className="max-w-[45%] truncate rounded-full bg-charcoal px-2 py-0.5 text-[11px] font-medium tabular-nums text-warm-white">
                {filter === "All" ? "All" : filter}
              </span>
            </button>

            <div className="hidden flex-1 md:block">
              <div className="flex items-center gap-6">
                <span className="shrink-0 text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  Filter by craft
                </span>
                <CraftFilter
                  value={filter}
                  onChange={(v) => {
                    setFilter(v);
                    setVisible(PAGE_SIZE);
                  }}
                  counts={counts}
                />
              </div>
            </div>
          </div>
        </section>

        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Filter & Sort"
          footer={
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDraftFilter("All")}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-[13px] font-medium uppercase tracking-[0.18em] text-charcoal/70 hover:text-clay"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilter(draftFilter);
                  setVisible(PAGE_SIZE);
                  setSheetOpen(false);
                }}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-charcoal px-6 text-[13px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay"
              >
                Apply
              </button>
            </div>
          }
        >
          <div className="space-y-6 pt-2">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                Craft
              </p>
              <CraftFilter
                value={draftFilter}
                onChange={setDraftFilter}
                counts={counts}
              />
            </div>
          </div>
        </BottomSheet>

        {/* Grid — single column on mobile, masonry from md */}
        <section className="bg-warm-white pb-10 pt-6 md:pb-20 md:pt-8">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            {isLoading && shown.length === 0 ? (
              <div className="columns-1 gap-8 md:columns-2 md:gap-10 lg:columns-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="mb-8 md:mb-12">
                    <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-cream" />
                    <div className="mt-5 h-4 w-3/4 animate-pulse rounded bg-cream" />
                    <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-cream" />
                  </div>
                ))}
              </div>
            ) : shown.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-display text-2xl italic text-charcoal md:text-3xl">
                  No makers in this craft yet.
                </p>
                <p className="mt-4 text-base text-ink-muted">
                  We're still expanding the index. Try another craft for now.
                </p>
              </div>
            ) : (
              <div className="columns-1 gap-8 md:columns-2 md:gap-10 lg:columns-3">
                {shown.map((creator, i) => (
                  <div key={creator.id} className="mb-8 md:mb-12">
                    <CreatorCard creator={creator} index={i} />
                  </div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-12 flex flex-col items-center gap-4 md:mt-20">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="group inline-flex min-h-[48px] items-center gap-3 rounded-full border border-charcoal/30 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal transition-all duration-300 hover:border-clay hover:bg-clay hover:text-warm-white"
                >
                  More makers
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
