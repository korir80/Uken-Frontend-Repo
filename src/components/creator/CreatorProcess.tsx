import type { CreatorProfile } from "./creator-profile-data";
import { Reveal } from "./Reveal";
import { SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";
import { cn } from "@/lib/utils";

interface CreatorProcessProps {
  creator: CreatorProfile;
}

/**
 * SECTION 3 — The craft in action.
 * Sequential moments alternating wide / half-width to feel like a film
 * contact sheet rather than a product gallery. Still no product mention.
 */
export function CreatorProcess({ creator }: CreatorProcessProps) {
  if (!creator.processSteps || creator.processSteps.length === 0) return null;
  return (
    <section className="bg-cream py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <SectionLabel>The craft in action</SectionLabel>
          <h2 className="mt-3 font-display text-[30px] leading-[1.05] tracking-tight text-charcoal sm:text-[38px] md:text-[46px]">
            How {creator.firstName}{" "}
            <em className="italic text-clay">works</em>.
          </h2>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-ink-muted md:text-[15px]">
            Four moments from a single basket — start to finish, the way
            she would walk a visitor through the workshop on a quiet afternoon.
          </p>
        </Reveal>

        {/* Mobile: horizontal snap-scroll contact sheet */}
        <ol className="mt-7 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 md:hidden">
          {creator.processSteps.map((step, i) => (
            <li
              key={i}
              className="w-[72%] shrink-0 snap-start"
            >
              <figure className="rounded-2xl border border-border/60 bg-warm-white p-3 shadow-[var(--shadow-card)]">
                <div className="overflow-hidden rounded-xl bg-sand-soft">
                  <LazyImage
                    src={step.image}
                    alt=""
                    ratio="4 / 3"
                    wrapperClassName="w-full"
                  />
                </div>
                <figcaption className="flex gap-3 px-1 pb-1 pt-3">
                  <span className="font-display text-2xl leading-none text-terracotta/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[14px] leading-relaxed text-charcoal/85">
                    {step.caption}
                  </p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        {/* Desktop: alternating contact sheet */}
        <ol className="mt-12 hidden space-y-12 md:mt-14 md:block md:space-y-16">
          {creator.processSteps.map((step, i) => {
            const isWide = i === 0 || i === creator.processSteps.length - 1;
            const isReversed = i % 2 === 1;
            return (
              <li key={i}>
                <Reveal>
                  {isWide ? (
                    <figure className="grid gap-5 md:grid-cols-12 md:gap-8">
                      <div className="md:col-span-12">
                        <div className="overflow-hidden rounded-2xl bg-sand-soft">
                          <LazyImage
                            src={step.image}
                            alt=""
                            ratio="16 / 9"
                            wrapperClassName="w-full"
                          />
                        </div>
                      </div>
                      <figcaption className="md:col-span-10 md:col-start-2 flex gap-4">
                        <span className="font-display text-3xl leading-none text-terracotta/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="max-w-2xl text-[15px] leading-relaxed text-charcoal/85 md:text-[16px]">
                          {step.caption}
                        </p>
                      </figcaption>
                    </figure>
                  ) : (
                    <figure
                      className={cn(
                        "grid items-center gap-7 md:grid-cols-12 md:gap-10",
                      )}
                    >
                      <div
                        className={cn(
                          "md:col-span-7",
                          isReversed && "md:order-2 md:col-start-6",
                        )}
                      >
                        <div className="overflow-hidden rounded-2xl bg-sand-soft">
                          <LazyImage
                            src={step.image}
                            alt=""
                            ratio="4 / 3"
                            wrapperClassName="w-full"
                          />
                        </div>
                      </div>
                      <figcaption
                        className={cn(
                          "md:col-span-4",
                          isReversed ? "md:order-1 md:col-start-2" : "md:col-start-9",
                        )}
                      >
                        <span className="font-display text-3xl leading-none text-terracotta/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="mt-3 text-[15px] leading-relaxed text-charcoal/85 md:text-[16px]">
                          {step.caption}
                        </p>
                      </figcaption>
                    </figure>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
