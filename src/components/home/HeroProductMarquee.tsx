import p1 from "@/assets/hero-product-1.jpg";
import p2 from "@/assets/hero-product-2.jpg";
import p3 from "@/assets/hero-product-3.jpg";
import p4 from "@/assets/hero-product-4.jpg";

/**
 * Hero product marquee — pure-CSS vertical auto-scroll with faded edges.
 * Showcases restaged Maasai beadwork product photography on the hero right column.
 * Honors `prefers-reduced-motion` (animation paused).
 *
 * Mobile uses the same source list as a horizontal strip below the CTAs.
 */
export const heroProducts: { src: string; alt: string; tag: string }[] = [
  { src: p1, alt: "Maasai beaded fringe earrings", tag: "Beadwork · Kajiado" },
  { src: p2, alt: "Orange triple-disc beaded earrings", tag: "Beadwork · Narok" },
  { src: p3, alt: "Green disc beaded earrings", tag: "Beadwork · Loitokitok" },
  { src: p4, alt: "Stacked Maasai bracelets", tag: "Bracelets · Magadi" },
];

export function HeroProductMarquee() {
  // Duplicate the list so the keyframe can translate -50% for a seamless loop.
  const loop = [...heroProducts, ...heroProducts];

  return (
    <aside
      aria-label="Featured artisan pieces"
      className="pointer-events-none absolute right-8 top-1/2 hidden h-[520px] w-[260px] -translate-y-1/2 lg:block xl:right-12"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
      }}
    >
      <div className="hero-marquee-track flex flex-col gap-5">
        {loop.map((item, i) => {
          // Middle of a 3-up viewport reads as "active" — every (i % 3 === 1) gets emphasis.
          const isActive = i % 3 === 1;
          return (
            <figure
              key={`${item.src}-${i}`}
              className={[
                "relative overflow-hidden rounded-sm border bg-charcoal/40 backdrop-blur-sm transition-transform duration-500",
                isActive
                  ? "scale-[1.04] border-gold-soft/60 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
                  : "scale-[0.94] border-warm-white/10 opacity-80",
              ].join(" ")}
            >
              <img
                src={item.src}
                alt={item.alt}
                width={400}
                height={500}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent px-3 py-2.5">
                <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-gold-soft/90">
                  {item.tag}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <style>{`
        .hero-marquee-track {
          animation: hero-marquee 38s linear infinite;
          will-change: transform;
        }
        @keyframes hero-marquee {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-marquee-track { animation: none; }
        }
      `}</style>
    </aside>
  );
}

/** Horizontal strip for mobile — same images, scrolls under the CTAs. */
export function HeroProductStripMobile() {
  const loop = [...heroProducts, ...heroProducts];
  return (
    <div
      aria-hidden
      className="pointer-events-none mt-10 -mx-6 overflow-hidden lg:hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div className="hero-strip-track flex w-max gap-3 px-6">
        {loop.map((item, i) => (
          <div
            key={`${item.src}-m-${i}`}
            className="h-24 w-20 flex-none overflow-hidden rounded-sm border border-warm-white/15 bg-charcoal/40"
          >
            <img
              src={item.src}
              alt=""
              width={160}
              height={200}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
      <style>{`
        .hero-strip-track {
          animation: hero-strip 28s linear infinite;
          will-change: transform;
        }
        @keyframes hero-strip {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-strip-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
