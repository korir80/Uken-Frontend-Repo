import { Button, SectionLabel } from "@/components/ukena";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-artisan.jpg";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-charcoal">
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
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-charcoal/45" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pt-32 pb-24 md:px-10 md:pb-32">
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

          <p className="mt-8 max-w-xl text-base leading-relaxed text-warm-white/80 md:text-lg">
            Handcrafted by Kenyan artisans. For those who want to know where
            things come from.
          </p>

          <div className="mt-10">
            <Button
              variant="primary"
              size="lg"
              className="bg-terracotta hover:bg-[oklch(0.52_0.13_38)]"
            >
              Meet the creators <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#creators"
        aria-label="Scroll to discover creators"
        className="group absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-3 text-warm-white/70 transition-colors hover:text-warm-white"
      >
        <span className="text-[10px] uppercase tracking-[0.32em]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-warm-white/25">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scroll-cue_2.2s_ease-in-out_infinite] bg-warm-white" />
        </span>
      </a>

      <style>{`
        @keyframes scroll-cue {
          0% { transform: translateY(-100%); }
          60% { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
