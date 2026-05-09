import { SectionLabel } from "@/components/ukena";
import { ArrowRight } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { useCreators } from "@/lib/queries";
import type { CreatorSummary } from "@/services";

export function FeaturedCreators() {
  const { data: all = [], isLoading } = useCreators();
  const creators = all.slice(0, 3);

  return (
    <section id="creators" className="bg-warm-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Meet the makers</SectionLabel>
            <h2 className="mt-2 font-display text-[30px] leading-[1.05] tracking-tight text-charcoal md:text-[40px]">
              Begin with a person.{" "}
              <em className="italic text-terracotta">Not a product.</em>
            </h2>
            <p className="mt-2.5 max-w-lg text-[14px] leading-relaxed text-ink-muted">
              The makers shaping this season's collection. Each has a workshop, a
              region, and a reason for the craft they keep alive.
            </p>
          </div>
          <a
            href="/creators"
            className="group inline-flex items-center gap-2 self-start text-[13px] font-medium uppercase tracking-[0.18em] text-clay md:self-end"
          >
            All creators
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {isLoading ? (
          <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="min-w-0">
                <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-cream" />
                <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-cream" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-cream" />
              </li>
            ))}
          </ul>
        ) : creators.length === 0 ? (
          <p className="rounded-2xl border border-border/60 bg-cream/40 px-5 py-10 text-center font-sans text-[13px] text-ink-muted">
            No makers in the index yet.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {creators.map((c, i) => (
              <li key={c.id} className="min-w-0">
                <CreatorCard creator={c} index={i} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function CreatorCard({ creator, index }: { creator: CreatorSummary; index: number }) {
  return (
    <article className="group h-full rounded-2xl border border-border/60 bg-cream/90 p-3 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative overflow-hidden rounded-xl bg-sand-soft">
        <div className="aspect-[4/3] w-full">
          <LazyImage
            src={creator.image}
            alt={`Portrait of ${creator.fullName}, ${creator.craft}`}
            wrapperClassName="h-full w-full"
            className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
        <span className="absolute left-5 top-5 font-display text-2xl text-warm-white/90">
          0{index + 1}
        </span>
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-warm-white/90">
          <span className="h-px w-5 bg-warm-white/70" />
          {creator.region}
        </span>
      </div>

      <div className="px-1 pb-1 pt-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          {creator.craft}
        </p>
        <h3 className="mt-2 font-display text-[24px] leading-tight text-charcoal">
          {creator.fullName}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
          {creator.hook}
        </p>
        <a
          href={`/creators/${creator.id}`}
          className="group/link mt-4 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-clay"
        >
          Read their story
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>
    </article>
  );
}
