import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import savanna from "@/assets/authentic-savanna.jpg";
import { Logo } from "@/components/ukena/Logo";


/**
 * Hero — dark cinematic, editorial.
 * Tall first-screen hero with a safari background,
 * brief editorial copy and a wavy bottom divider.
 */
export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-charcoal">
      {/* 1 — Safari landscape foundation */}
      <div
        aria-label="Kenyan savanna at dawn with open grassland and distant trees"
        role="img"
        className="absolute inset-0 bg-cover bg-center opacity-70 md:bg-fixed"
        style={{ backgroundImage: `url(${savanna})` }}
      />

      {/* 2 — Theme blend + directional vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,var(--charcoal)_0%,oklch(from_var(--charcoal)_l_c_h_/_0.92)_34%,oklch(from_var(--clay-deep)_l_c_h_/_0.62)_62%,oklch(from_var(--gold)_l_c_h_/_0.28)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,oklch(from_var(--gold-soft)_l_c_h_/_0.22)_0%,transparent_45%)]" />

      {/* Content shell — snug, vertically centred */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 pb-20 pt-24 md:px-10 md:py-20"
        style={{ minHeight: "clamp(560px, 92svh, 720px)" }}
      >
        {/* LEFT — copy block, tight grouping */}
        <div className="max-w-[600px] md:pl-[44px]">
          <h1 className="m-1 max-w-[680px] font-display text-[46px] font-light leading-[1.02] text-warm-white sm:text-5xl md:text-6xl">
            Kenya,
            <span className="block italic text-gold-soft">brought home.</span>
          </h1>

          {/* Sub-copy */}
          <p className="mb-7 mt-5 max-w-[420px] font-sans text-[15px] font-light leading-relaxed text-warm-white/72 sm:text-base">
            From the farmers, artisans, and makers of Kenya — to your home in the UK.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              to="/shop"
              className="group/cta inline-flex min-h-[48px] items-center justify-center rounded-sm bg-gold-soft px-6 py-3 font-sans text-[12px] font-medium uppercase leading-none tracking-[0.08em] text-charcoal transition-colors hover:bg-gold sm:px-7"
            >
              Shop collection
              <ArrowRight className="ml-2 h-3.5 w-3.5" strokeWidth={2} />
            </Link>

            <Link
              to="/explore"
              className="group/meet inline-flex min-h-[44px] items-center py-3 font-sans text-xs font-normal uppercase leading-none tracking-[0.07em] text-warm-white/60 transition-colors hover:text-warm-white/85"
            >
              <span
                aria-hidden
                className="mr-3 block h-px w-[22px] bg-warm-white/30 transition-all duration-300 group-hover/meet:w-[34px]"
              />
              Meet the makers
            </Link>
          </div>
        </div>
      </div>

      {/* Wavy bottom border — sits above bg, below text/card */}
      <svg
        aria-hidden
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
          className="absolute bottom-0 left-0 z-[5] block h-9 w-full md:h-14"
      >
        <path
          d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z"
          fill="var(--warm-white)"
        />
      </svg>

    </section>
  );
}
