import p1 from "@/assets/hero-product-1.jpg";
import p2 from "@/assets/hero-product-2.jpg";
import p3 from "@/assets/hero-product-3.jpg";
import p4 from "@/assets/hero-product-4.jpg";

/**
 * Hero product carousel — pure-CSS horizontal auto-scroll, infinite loop.
 * 3 images visible, middle one scaled up and ringed as the "active" piece.
 * All four edges fade into the hero background via mask-image.
 * Honors `prefers-reduced-motion` (animation paused).
 */
export const heroProducts: { src: string; alt: string; tag: string }[] = [
  { src: p1, alt: "Maasai beaded fringe earrings", tag: "Beadwork · Kajiado" },
  { src: p2, alt: "Orange triple-disc beaded earrings", tag: "Beadwork · Narok" },
  { src: p3, alt: "Green disc beaded earrings", tag: "Beadwork · Loitokitok" },
  { src: p4, alt: "Stacked Maasai bracelets", tag: "Bracelets · Magadi" },
];

// 4-sided fade mask — soft top/bottom and left/right so the strip melts into
// the hero gradient on every edge. Implemented as two intersecting linear
// gradients composited via mask-composite: intersect.
const FOUR_SIDE_MASK =
  "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%), " +
  "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)";

function HorizontalCarousel({ heightClass }: { heightClass: string }) {
  // Duplicate the list so the keyframe can translate -50% for a seamless loop.
  const loop = [...heroProducts, ...heroProducts, ...heroProducts, ...heroProducts];

  return (
    <div
      aria-label="Featured artisan pieces"
      className={`pointer-events-none relative w-full overflow-hidden ${heightClass}`}
      style={{
        WebkitMaskImage: FOUR_SIDE_MASK,
        maskImage: FOUR_SIDE_MASK,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <div className="hero-h-marquee-track absolute inset-y-0 left-0 flex items-center gap-4">
        {loop.map((item, i) => {
          // Every 3rd item reads as "active" — middle of a 3-up viewport.
          const isActive = i % 3 === 1;
          return (
            <figure
              key={`${item.src}-${i}`}
              className={[
                "relative h-full flex-none overflow-hidden rounded-sm border bg-charcoal/40 backdrop-blur-sm transition-transform duration-500",
                isActive
                  ? "scale-[1.06] border-gold-soft/60 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)]"
                  : "scale-[0.86] border-warm-white/10 opacity-75",
              ].join(" ")}
              style={{ aspectRatio: "4 / 5" }}
            >
              <img
                src={item.src}
                alt={item.alt}
                width={400}
                height={500}
                loading="lazy"
                className="h-full w-full object-cover"
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
        .hero-h-marquee-track {
          animation: hero-h-marquee 32s linear infinite;
          will-change: transform;
        }
        @keyframes hero-h-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-h-marquee-track { animation: none; }
        }
      `}</style>
    </div>
  );
}

/** Desktop placement — inside the hero right column. */
export function HeroProductMarquee() {
  return (
    <aside
      aria-label="Featured artisan pieces"
      className="pointer-events-none absolute right-6 top-1/2 hidden w-[520px] -translate-y-1/2 lg:block xl:right-10 xl:w-[560px]"
    >
      <HorizontalCarousel heightClass="h-[300px] xl:h-[330px]" />
    </aside>
  );
}

/** Mobile placement — below CTAs, same 3-up horizontal carousel, smaller. */
export function HeroProductStripMobile() {
  return (
    <div className="mt-10 -mx-2 lg:hidden">
      <HorizontalCarousel heightClass="h-[210px] sm:h-[240px]" />
    </div>
  );
}
