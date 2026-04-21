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
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionLabel>The craft in action</SectionLabel>
          <h2 className="mt-6 font-display text-[40px] leading-[1.05] tracking-tight text-charcoal md:text-[64px]">
            How {creator.firstName}{" "}
            <em className="italic text-clay">works</em>.
          </h2>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-muted md:text-[17px]">
            Four moments from a single basket — start to finish, the way
            she would walk a visitor through the workshop on a quiet afternoon.
          </p>
        </Reveal>

        <ol className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {creator.processSteps.map((step, i) => {
            const isWide = i === 0 || i === creator.processSteps.length - 1;
            const isReversed = i % 2 === 1;
            return (
              <li key={i}>
                <Reveal>
                  {isWide ? (
                    <figure className="grid gap-6 md:grid-cols-12 md:gap-10">
                      <div className="md:col-span-12">
                        <div className="overflow-hidden rounded-2xl bg-sand-soft">
                          <img
                            src={step.image}
                            alt=""
                            width={1280}
                            height={960}
                            loading="lazy"
                            className="aspect-[16/9] w-full object-cover"
                          />
                        </div>
                      </div>
                      <figcaption className="md:col-span-10 md:col-start-2 flex gap-6">
                        <span className="font-display text-3xl leading-none text-terracotta/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="max-w-2xl text-[17px] leading-relaxed text-charcoal/85 md:text-[18px]">
                          {step.caption}
                        </p>
                      </figcaption>
                    </figure>
                  ) : (
                    <figure
                      className={cn(
                        "grid items-center gap-10 md:grid-cols-12 md:gap-14",
                      )}
                    >
                      <div
                        className={cn(
                          "md:col-span-7",
                          isReversed && "md:order-2 md:col-start-6",
                        )}
                      >
                        <div className="overflow-hidden rounded-2xl bg-sand-soft">
                          <img
                            src={step.image}
                            alt=""
                            width={1280}
                            height={960}
                            loading="lazy"
                            className="aspect-[4/3] w-full object-cover"
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
                        <p className="mt-4 text-[17px] leading-relaxed text-charcoal/85 md:text-[18px]">
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
