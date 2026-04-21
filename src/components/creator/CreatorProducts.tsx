import { ArrowUpRight } from "lucide-react";
import type { CreatorProfile } from "./creator-profile-data";
import { Reveal } from "./Reveal";
import { SectionLabel } from "@/components/ukena";

interface CreatorProductsProps {
  creator: CreatorProfile;
}

/**
 * SECTION 5 — Products, deliberately last.
 * Visually quieter than the storytelling above — restrained typography,
 * minimal chrome. Cards are an invitation, not a sales pitch.
 */
export function CreatorProducts({ creator }: CreatorProductsProps) {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <SectionLabel>From her hands</SectionLabel>
              <h2 className="mt-5 font-display text-[36px] leading-[1.05] tracking-tight text-charcoal md:text-[52px]">
                From {creator.firstName}'s{" "}
                <em className="italic text-clay">hands</em>.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed text-ink-muted">
              A small selection. Each piece carries the marks of the workshop
              you just walked through.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
          {creator.products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.06}>
              <a href={`/products/${product.id}`} className="group block">
                <div className="relative overflow-hidden rounded-xl bg-warm-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[22px] leading-tight text-charcoal">
                    {product.name}
                  </h3>
                  <span className="font-display text-[18px] text-clay-deep">
                    {product.price}
                  </span>
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                  {product.description}
                </p>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16 flex justify-center md:mt-20">
            <a
              href={`/creators/${creator.id}/pieces`}
              className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:text-clay"
            >
              See all {creator.firstName}'s pieces
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
