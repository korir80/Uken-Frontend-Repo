import { Link } from "@tanstack/react-router";
import type { CreatorProfile } from "./creator-profile-data";
import { Reveal } from "./Reveal";
import { SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";

interface RelatedCreatorsProps {
  creator: CreatorProfile;
}

/**
 * SECTION 6 — Related creators.
 * Two story-first cards. Mirrors the editorial tone of the explore grid —
 * no products, no prices, no "view shop" buttons.
 */
export function RelatedCreators({ creator }: RelatedCreatorsProps) {
  if (creator.relatedCreators.length === 0) return null;

  return (
    <section className="bg-warm-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionLabel>Continue the journey</SectionLabel>
          <h2 className="mt-6 font-display text-[36px] leading-[1.05] tracking-tight text-charcoal md:text-[52px]">
            You might also{" "}
            <em className="italic text-terracotta">connect with</em>…
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-14">
          {creator.relatedCreators.map((rel, i) => (
            <Reveal key={rel.id} delay={i * 0.08}>
              <Link
                to="/creators/$creatorId"
                params={{ creatorId: rel.id }}
                className="group block"
              >
                <article className="overflow-hidden rounded-2xl bg-cream transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-sand-soft">
                    <LazyImage
                      src={rel.image}
                      alt={`Portrait of ${rel.firstName}, ${rel.craft.toLowerCase()}`}
                      wrapperClassName="absolute inset-0"
                      className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/45 via-charcoal/5 to-transparent" />
                    <div className="absolute inset-x-6 bottom-6">
                      <p className="font-display text-[36px] leading-none text-warm-white">
                        {rel.firstName}
                      </p>
                      <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-warm-white/85">
                        {rel.craft} · {rel.region}
                      </p>
                    </div>
                  </div>
                </article>
                <div className="px-1 pt-5">
                  <p className="text-[15px] leading-relaxed text-ink-muted">
                    {rel.hook}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-clay">
                    See {rel.firstName}'s story
                    <span
                      aria-hidden
                      className="inline-block h-px w-6 bg-clay transition-all duration-300 group-hover:w-9"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
