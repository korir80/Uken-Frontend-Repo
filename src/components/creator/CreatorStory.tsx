import type { CreatorProfile } from "./creator-profile-data";
import { Reveal } from "./Reveal";
import { SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";

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
    <section className="bg-warm-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Portrait */}
          <div className="md:col-span-5 md:sticky md:top-28 md:self-start">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl bg-cream shadow-[var(--shadow-card)]">
                <img
                  src={creator.portraitImage}
                  alt={`Portrait of ${creator.fullName}`}
                  width={1024}
                  height={1280}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <p className="mt-5 text-[12px] uppercase tracking-[0.22em] text-ink-muted">
                {creator.fullName} · {creator.region}
              </p>
            </Reveal>
          </div>

          {/* Narrative */}
          <div className="md:col-span-7">
            <Reveal>
              <SectionLabel>The human story</SectionLabel>
              <h2 className="mt-6 font-display text-[40px] leading-[1.05] tracking-tight text-charcoal md:text-[56px]">
                Where {creator.firstName}{" "}
                <em className="italic text-terracotta">comes from</em>.
              </h2>
            </Reveal>

            <div className="mt-12 space-y-7">
              {opening.map((para, i) => (
                <Reveal key={`o-${i}`} delay={i * 0.05}>
                  <p className="text-[17px] leading-[1.75] text-charcoal/85 md:text-[18px]">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* Pull quote */}
            <Reveal>
              <figure className="my-16 border-y border-border/70 py-12 text-center md:my-20 md:py-16">
                <span
                  aria-hidden
                  className="font-display text-7xl leading-none text-terracotta/40"
                >
                  &ldquo;
                </span>
                <blockquote className="-mt-4 font-display text-[30px] italic leading-[1.25] text-charcoal md:text-[40px]">
                  {creator.pullQuote}
                </blockquote>
                <figcaption className="mt-8 text-[11px] uppercase tracking-[0.28em] text-ink-muted">
                  — {creator.firstName}
                </figcaption>
              </figure>
            </Reveal>

            <div className="space-y-7">
              {closing.map((para, i) => (
                <Reveal key={`c-${i}`} delay={i * 0.05}>
                  <p className="text-[17px] leading-[1.75] text-charcoal/85 md:text-[18px]">
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
