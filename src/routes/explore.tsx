import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import {
  CraftFilter,
  type CraftFilterValue,
} from "@/components/explore/CraftFilter";
import { CreatorCard } from "@/components/explore/CreatorCard";
import { creators } from "@/components/explore/creators-data";

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

      <main>
        {/* Editorial header */}
        <section className="border-b border-border/60 bg-warm-white">
          <div className="mx-auto max-w-7xl px-6 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24">
            <SectionLabel>An ongoing index</SectionLabel>
            <h1 className="mt-6 font-display text-[44px] leading-[1.02] tracking-tight text-charcoal md:text-[80px] lg:text-[96px]">
              The makers{" "}
              <em className="italic text-terracotta">of Kenya</em>.
            </h1>
            <div className="mt-10 grid gap-10 md:grid-cols-12">
              <p className="md:col-span-7 md:col-start-1 max-w-2xl text-[16px] leading-relaxed text-ink-muted md:text-[17px]">
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
        <section className="sticky top-[68px] z-40 border-b border-border/60 bg-warm-white/95 backdrop-blur-md md:top-[76px]">
          <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-5 md:px-10">
            <span className="hidden shrink-0 text-[11px] uppercase tracking-[0.22em] text-ink-muted md:inline">
              Filter by craft
            </span>
            <CraftFilter value={filter} onChange={(v) => { setFilter(v); setVisible(PAGE_SIZE); }} counts={counts} />
          </div>
        </section>

        {/* Grid */}
        <section className="bg-warm-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-10">
            {shown.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-display text-3xl italic text-charcoal">
                  No makers in this craft yet.
                </p>
                <p className="mt-4 text-[15px] text-ink-muted">
                  We're still expanding the index. Try another craft for now.
                </p>
              </div>
            ) : (
              <div className="columns-1 gap-8 md:columns-2 md:gap-10 lg:columns-3">
                {shown.map((creator, i) => (
                  <div key={creator.id} className="mb-10 md:mb-12">
                    <CreatorCard creator={creator} index={i} />
                  </div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-16 flex flex-col items-center gap-4 md:mt-20">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="group inline-flex items-center gap-3 rounded-full border border-charcoal/30 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal transition-all duration-300 hover:border-clay hover:bg-clay hover:text-warm-white"
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
