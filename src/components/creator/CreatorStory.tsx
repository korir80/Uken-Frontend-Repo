import type { CreatorProfile } from "./creator-profile-data";
import { Reveal } from "./Reveal";
import { SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";
import { safeImg } from "@/lib/safeImage";

interface CreatorStoryProps {
  creator: CreatorProfile;
}

/**
 * SECTION 2 — The human story.
 * Two-column layout with a tall warm portrait on the left and the long-form
 * narrative on the right, broken at the midpoint by an italic pull quote.
 * Intentionally has no CTA.
 */
export function CreatorStory({ creator }: CreatorStoryProps) {
  const mid = Math.ceil(creator.storyParagraphs.length / 2);
  const opening = creator.storyParagraphs.slice(0, mid);
  const closing = creator.storyParagraphs.slice(mid);

  return (
    <section className="bg-warm-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10 lg:gap-12">
          {/* Portrait */}
          <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
            <Reveal>
              <figure className="rounded-2xl border border-border/60 bg-cream p-3 shadow-[var(--shadow-card)]">
              <div className="relative overflow-hidden rounded-xl bg-sand-soft">
                <img
                  src={creator.portraitImage}
                  alt={`Portrait of ${creator.fullName}`}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <figcaption className="px-1 pb-1 pt-3 text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                {creator.fullName} · {creator.region}
              </figcaption>
              </figure>
            </Reveal>
          </div>

          {/* Narrative */}
          <div className="md:col-span-7">
            <Reveal>
              <SectionLabel>The human story</SectionLabel>
              <h2 className="mt-3 font-display text-[32px] leading-[1.05] tracking-tight text-charcoal md:text-[44px]">
                Where {creator.firstName}{" "}
                <em className="italic text-terracotta">comes from</em>.
              </h2>
            </Reveal>

            <div className="mt-7 space-y-4 md:mt-8 md:space-y-5">
              {opening.map((para, i) => (
                <Reveal key={`o-${i}`} delay={i * 0.05}>
                  <p className="text-[15px] leading-[1.65] text-charcoal/85 md:text-[16px]">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Pull quote */}
            <Reveal>
              <figure className="my-10 border-y border-border/70 py-8 text-center md:my-12 md:py-10">
                <span
                  aria-hidden
                  className="font-display text-7xl leading-none text-terracotta/40"
                >
                  &ldquo;
                </span>
                <blockquote className="-mt-4 font-display text-[26px] italic leading-[1.22] text-charcoal md:text-[34px]">
                  {creator.pullQuote}
                </blockquote>
                <figcaption className="mt-5 text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                  — {creator.firstName}
                </figcaption>
              </figure>
            </Reveal>

            <div className="space-y-4 md:space-y-5">
              {closing.map((para, i) => (
                <Reveal key={`c-${i}`} delay={i * 0.05}>
                  <p className="text-[15px] leading-[1.65] text-charcoal/85 md:text-[16px]">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
