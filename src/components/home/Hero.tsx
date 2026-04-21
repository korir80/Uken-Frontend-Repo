import { Button, SectionLabel } from "@/components/ukena";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-artisan.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-charcoal">
      {/* Background image */}
      <img
        src={heroImage}
        alt="A Kenyan artisan shaping a clay vessel at golden hour"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Vignettes — preserve image warmth, anchor text bottom-left */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/15 to-charcoal/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-end px-6 pt-32 pb-20 md:px-10 md:pb-28">
        <div className="max-w-3xl">
          <SectionLabel
            tone="terracotta"
            className="!text-[oklch(0.85_0.08_38)] before:!bg-[oklch(0.85_0.08_38)]"
          >
            Stories from Kenyan workshops
          </SectionLabel>

          <h1 className="mt-7 font-display text-[44px] leading-[1.04] tracking-tight text-warm-white sm:text-6xl md:text-7xl lg:text-[88px]">
            Every piece carries{" "}
            <em className="italic text-[oklch(0.88_0.06_55)]">a story.</em>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-warm-white/80 md:text-lg">
            Handcrafted by Kenyan artisans. Made to last a lifetime.
          </p>

          <div className="mt-10">
            <Button
              variant="primary"
              size="lg"
              className="bg-terracotta hover:bg-[oklch(0.52_0.13_38)]"
            >
              Meet the Creators <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editorial caption */}
        <div className="mt-16 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-warm-white/55">
          <span className="h-px w-10 bg-warm-white/40" />
          <span>Photographed in Kajiado · Issue No. 01</span>
        </div>
      </div>
    </section>
  );
}
