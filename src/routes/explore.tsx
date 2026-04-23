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
import { creators } from "@/components/explore/creators-data";
import { BottomSheet } from "@/components/ui/bottom-sheet";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "The makers of Kenya — Ukena" },
      {
        name: "description",
        content:
          "Browse the artisans behind every Ukena piece. Weavers, potters, beadworkers and woodcarvers — discover the people first.",
      },
      { property: "og:title", content: "The makers of Kenya — Ukena" },
      {
        property: "og:description",
        content:
          "Discover Kenyan artisans, the regions they work from and the stories behind their craft.",
      },
    ],
  }),
  component: ExplorePage,
});

const PAGE_SIZE = 6;

function ExplorePage() {
  const [filter, setFilter] = useState<CraftFilterValue>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draftFilter, setDraftFilter] = useState<CraftFilterValue>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return creators;
    return creators.filter((c) => c.craft === filter);
  }, [filter]);

  const counts = useMemo(() => {
    const c: Partial<Record<CraftFilterValue, number>> = { All: creators.length };
    for (const creator of creators) {
      c[creator.craft] = (c[creator.craft] ?? 0) + 1;
    }
    return c;
  }, []);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main className="pb-24 md:pb-0">
        {/* Editorial header */}
        <section className="border-b border-border/60 bg-warm-white">
          <div className="mx-auto max-w-7xl px-5 pb-12 pt-12 md:px-10 md:pb-20 md:pt-24">
            <SectionLabel>An ongoing index</SectionLabel>
            <h1 className="mt-5 font-display text-[40px] leading-[1.04] tracking-tight text-charcoal sm:text-6xl md:mt-6 md:text-[80px] lg:text-[96px]">
              The makers{" "}
              <em className="italic text-terracotta">of Kenya</em>.
            </h1>
            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:gap-10">
              <p className="md:col-span-7 md:col-start-1 max-w-2xl text-base leading-relaxed text-ink-muted md:text-[17px]">
                Seven regions. Five crafts. Every name here belongs to a person
                who learned their work from someone who came before them. Begin
                with whoever holds your eye — the pieces will follow.
              </p>
              <div className="md:col-span-4 md:col-start-9 flex flex-col items-start gap-2 md:items-end md:text-right">
                <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  In the index today
                </span>
                <span className="font-display text-5xl tabular-nums text-charcoal md:text-6xl">
                  {String(creators.length).padStart(2, "0")}
                </span>
                <span className="text-[12px] uppercase tracking-[0.18em] text-ink-muted">
                  Makers
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter strip */}
        <section className="sticky top-[60px] z-40 border-b border-border/60 bg-warm-white/95 backdrop-blur-md md:top-[76px]">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-3 md:px-10 md:py-5">
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
              <span className="rounded-full bg-charcoal px-2 py-0.5 text-[11px] font-medium tabular-nums text-warm-white">
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
        <section className="bg-warm-white py-10 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            {shown.length === 0 ? (
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
