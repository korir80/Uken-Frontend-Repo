import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import savanna from "@/assets/authentic-savanna.jpg";
import beadMarket from "@/assets/authentic-bead-market.jpg";

/**
 * Hero — dark cinematic, editorial.
 * Balanced height, wavy bottom divider,
 * safari background, brief editorial copy.
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

      {/* 3 — Woven crosshatch texture */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: 0.12,
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(from var(--gold-soft) l c h / 0.42) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, oklch(from var(--sand) l c h / 0.26) 0 1px, transparent 1px 11px)",
        }}
      />

      {/* Content shell — snug, vertically centred */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-20"
        style={{ minHeight: "520px" }}
      >
        {/* LEFT — copy block, tight grouping */}
        <div className="max-w-[600px] md:pl-[44px]">
          <h1 className="m-0 max-w-[680px] font-display text-5xl font-light leading-tight text-warm-white md:text-6xl">
            Kenyan craft,
            <span className="block italic text-gold-soft">safari soul.</span>
          </h1>

          {/* Sub-copy */}
          <p
            className="mb-7 mt-5 max-w-[420px] font-sans text-base font-light leading-relaxed text-warm-white/68"
          >
            Handmade Kenyan pieces for thoughtful UK homes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              to="/shop"
              className="group/cta inline-flex items-center justify-center rounded-sm bg-gold-soft px-7 py-3 font-sans text-xs font-medium uppercase leading-none tracking-[0.08em] text-charcoal transition-colors hover:bg-gold"
            >
              Shop collection
              <ArrowRight className="ml-2 h-3.5 w-3.5" strokeWidth={2} />
            </Link>

            <Link
              to="/explore"
              className="group/meet inline-flex items-center py-3 font-sans text-xs font-normal uppercase leading-none tracking-[0.07em] text-warm-white/50 transition-colors hover:text-warm-white/85"
            >
              <span
                aria-hidden
                className="mr-3 block h-px w-[22px] bg-warm-white/30 transition-all duration-300 group-hover/meet:w-[34px]"
              />
              Meet the makers
            </Link>
          </div>
        </div>

        {/* RIGHT — floating product card */}
        <div className="mt-8 md:mt-0 md:pr-[52px]">
          <FloatingProductCard />
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span
          className="font-sans uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "oklch(from var(--warm-white) l c h / 0.24)",
          }}
        >
          Scroll
        </span>
        <span
          className="relative block overflow-hidden"
          style={{
            width: 1,
            height: 32,
            backgroundColor: "oklch(from var(--warm-white) l c h / 0.12)",
          }}
        >
          <span
            className="absolute left-0 top-0 block animate-[hero-scroll-cue_2s_ease-in-out_infinite]"
            style={{
              width: 1,
              height: 12,
              backgroundColor: "oklch(from var(--gold) l c h / 0.72)",
            }}
          />
        </span>
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

      <style>{`
        @keyframes hero-scroll-cue {
          0%   { transform: translateY(-100%); }
          70%  { transform: translateY(220%); }
          100% { transform: translateY(220%); }
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * FloatingProductCard
 * ────────────────────────────────────────────────────────────────────── */
function FloatingProductCard() {
  return (
    <div
      className="group/card mx-auto block w-[calc(100%-32px)] overflow-hidden rounded-lg border border-gold/25 bg-charcoal/75 shadow-hero backdrop-blur-xl transition-all duration-300 hover:border-gold/45 md:mx-0 md:w-[278px]"
    >
      {/* Image collage: craft foreground against the safari mood */}
      <Link
        to="/shop"
        aria-label="Shop the collection"
        className="relative block h-[178px] overflow-hidden"
      >
        <img
          src={beadMarket}
          alt="Kenyan beadwork and craft materials arranged by artisans"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,oklch(from_var(--charcoal)_l_c_h_/_0.24)_48%,oklch(from_var(--charcoal)_l_c_h_/_0.86)_100%)]" />
        <img
          src={baskets}
          alt="Handwoven Kenyan baskets"
          className="absolute bottom-3 right-3 h-20 w-20 rounded-md border border-warm-white/20 object-cover shadow-lift"
        />
        <img
          src={craftMarket}
          alt="Kenyan craft market textiles and handmade pieces"
          className="absolute bottom-8 left-3 h-14 w-14 rounded-md border border-gold/30 object-cover shadow-card"
        />
        <span className="absolute left-4 top-4 rounded-sm border border-gold/35 bg-charcoal/55 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.16em] text-gold-soft backdrop-blur-md">
          Field notes
        </span>
      </Link>

      {/* Body */}
      <div style={{ padding: "16px 18px 18px" }}>
        <p
          className="m-0 font-sans text-[10px] tracking-[0.05em] text-gold-soft/75"
        >
          Mara light · beadwork · woven fibre
        </p>
        <h3
          className="my-2 mb-4 font-display text-[19px] font-normal leading-tight text-warm-white"
        >
          Safari-born pieces with a maker's hand
        </h3>

        <div className="flex items-center justify-between">
          <span
            className="font-display"
            style={{ fontSize: 20, fontWeight: 400, color: "var(--warm-white)" }}
          >
            From £34
          </span>
          <Link
            to="/shop"
            className="rounded-sm bg-gold-soft px-3.5 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.04em] text-charcoal transition-colors hover:bg-gold"
          >
            Explore
          </Link>
        </div>

        {/* Divider + secondary card CTAs */}
        <div
          aria-hidden
          className="mt-4 h-px bg-gold/20"
        />
        <div className="flex flex-col gap-2 pt-3">
          <Link
            to="/creators/$creatorId"
            params={{ creatorId: "wanjiru-kamau" }}
            className="group/talent inline-flex items-center justify-between font-sans text-[11px] tracking-[0.03em] text-gold-soft/75 transition-colors hover:text-gold-soft"
          >
            <span>Meet the makers behind it</span>
            <ArrowRight className="ml-2 h-3 w-3" strokeWidth={2} />
          </Link>
          <Link
            to="/shop"
            search={{ craft: "Beadwork", region: "All", sort: "newest", minPrice: undefined, maxPrice: undefined }}
            className="group/similar inline-flex items-center justify-between font-sans text-[11px] tracking-[0.03em] text-warm-white/45 transition-colors hover:text-warm-white/75"
          >
            <span>See safari-toned pieces</span>
            <ArrowRight className="ml-2 h-3 w-3" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
