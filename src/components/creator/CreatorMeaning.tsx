import type { CreatorProfile } from "./creator-profile-data";
import { Reveal } from "./Reveal";
import { SectionLabel } from "@/components/ukena";

interface CreatorMeaningProps {
  creator: CreatorProfile;
}

/**
 * SECTION 4 — Cultural meaning.
 * Two paragraphs framed as editorial prose, with a small decorative map
 * pin showing the creator's region. The map is illustrative — not
 * interactive — and degrades gracefully if mapPin is absent.
 */
export function CreatorMeaning({ creator }: CreatorMeaningProps) {
  return (
    <section className="bg-warm-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-16 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7">
            <Reveal>
              <SectionLabel>Why this matters</SectionLabel>
              <h2 className="mt-6 font-display text-[40px] leading-[1.05] tracking-tight text-charcoal md:text-[56px]">
                The lineage behind{" "}
                <em className="italic text-terracotta">every coil</em>.
              </h2>
            </Reveal>

            <div className="mt-12 space-y-7">
              {creator.culturalMeaning.map((para, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className="text-[17px] leading-[1.75] text-charcoal/85 md:text-[18px]">
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Decorative map */}
          {creator.mapPin && (
            <div className="md:col-span-4 md:col-start-9">
              <Reveal delay={0.1}>
                <DecorativeKenyaMap label={creator.mapPin.label} />
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DecorativeKenyaMap({ label }: { label: string }) {
  return (
    <figure className="rounded-2xl border border-border/70 bg-cream p-7">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
        Where she works
      </p>

      <div className="relative mt-5 aspect-[4/5] overflow-hidden rounded-lg bg-sand-soft/60">
        {/* Simplified Kenya silhouette — illustrative, not geographic */}
        <svg
          viewBox="0 0 200 250"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <pattern
              id="grain"
              x="0"
              y="0"
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="0.4" fill="oklch(0.45 0.11 47 / 0.12)" />
            </pattern>
          </defs>
          <path
            d="M40,50 Q35,30 60,28 L120,22 Q160,25 170,55 L178,110 Q175,150 160,180 L130,225 Q100,238 75,225 L45,200 Q22,170 25,130 L30,90 Q33,68 40,50 Z"
            fill="oklch(0.88 0.035 78)"
            stroke="oklch(0.45 0.11 47 / 0.45)"
            strokeWidth="1.2"
          />
          <path
            d="M40,50 Q35,30 60,28 L120,22 Q160,25 170,55 L178,110 Q175,150 160,180 L130,225 Q100,238 75,225 L45,200 Q22,170 25,130 L30,90 Q33,68 40,50 Z"
            fill="url(#grain)"
          />
          {/* Pin — roughly central highlands */}
          <g>
            <circle
              cx="105"
              cy="115"
              r="14"
              fill="oklch(0.58 0.13 38 / 0.18)"
            >
              <animate
                attributeName="r"
                values="10;18;10"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0;0.4"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="105" cy="115" r="5" fill="oklch(0.58 0.13 38)" />
            <circle cx="105" cy="115" r="1.6" fill="oklch(0.985 0.006 78)" />
          </g>
        </svg>
      </div>

      <figcaption className="mt-5 flex items-baseline justify-between gap-3">
        <span className="font-display text-xl text-charcoal">Kenya</span>
        <span className="text-right text-[12px] uppercase tracking-[0.18em] text-terracotta">
          {label}
        </span>
      </figcaption>
    </figure>
  );
}
