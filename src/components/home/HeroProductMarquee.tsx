import { useEffect, useState } from "react";
import p1 from "@/assets/hero-product-1.jpg";
import p2 from "@/assets/hero-product-2.jpg";
import p3 from "@/assets/hero-product-3.jpg";
import p4 from "@/assets/hero-product-4.jpg";

/**
 * Hero product carousel — stepped, forward-only, infinite.
 * Every 3s the next image becomes the active one (large, centered, opaque);
 * neighbours shrink hard and dim. Inactive slots use negative margins so the
 * visual gap stays minimal regardless of scale.
 */
export const heroProducts: { src: string; alt: string; tag: string }[] = [
  { src: p1, alt: "Maasai beaded fringe earrings", tag: "Beadwork · Kajiado" },
  { src: p2, alt: "Orange triple-disc beaded earrings", tag: "Beadwork · Narok" },
  { src: p3, alt: "Green disc beaded earrings", tag: "Beadwork · Loitokitok" },
  { src: p4, alt: "Stacked Maasai bracelets", tag: "Bracelets · Magadi" },
];

const FOUR_SIDE_MASK =
  "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), " +
  "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)";

const STEP_MS = 3000;
const TRANSITION_MS = 1100;
const INACTIVE_SCALE = 0.45; // strong size difference vs active (1.0)
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

type Size = {
  slide: number; // px — width/height of an active slide
  gap: number;   // px — visible gap between slides
  height: number;
};

function Carousel({ size }: { size: Size }) {
  const [active, setActive] = useState(0);
  const n = heroProducts.length;

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setActive((i) => i + 1), STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  // Render enough repeats so we never run off the edge while always advancing
  // forward. We use modulo on `active` only for the highlight calculation.
  const REPEATS = 12;
  const list = Array.from({ length: REPEATS }, () => heroProducts).flat();
  // Keep the highlight pointer roughly centred in the rendered list.
  const centerIndex = Math.floor(REPEATS / 2) * n + (active % n);
  // But translate based on the *true* monotonically increasing active count,
  // so the strip keeps sliding forward forever.
  const monotonicIndex = Math.floor(REPEATS / 2) * n + active;

  // Layout: each figure reserves `slide` px. Inactive ones get a negative
  // horizontal margin equal to half the scaled-away space, so visually the
  // neighbours hug the active slide with only `gap` px between them.
  const shrinkPx = (size.slide * (1 - INACTIVE_SCALE)) / 2;

  const step = size.slide + size.gap;
  const translate = `calc(50% - ${size.slide / 2}px - ${monotonicIndex * step}px)`;

  return (
    <div
      aria-label="Featured artisan pieces"
      className="pointer-events-none relative w-full overflow-hidden"
      style={{
        height: size.height,
        WebkitMaskImage: FOUR_SIDE_MASK,
        maskImage: FOUR_SIDE_MASK,
        WebkitMaskComposite: "source-in",
        maskComposite: "intersect",
      }}
    >
      <div
        className="absolute inset-y-0 left-0 flex items-center"
        style={{
          gap: size.gap,
          transform: `translateX(${translate})`,
          transition: `transform ${TRANSITION_MS}ms ${EASING}`,
          willChange: "transform",
        }}
      >
        {list.map((item, i) => {
          const isActive = i === centerIndex;
          return (
            <figure
              key={i}
              className={[
                "relative flex-none overflow-hidden rounded-sm border bg-charcoal/40 backdrop-blur-sm",
                isActive
                  ? "z-10 border-gold-soft/70 shadow-[0_24px_55px_-14px_rgba(0,0,0,0.65)]"
                  : "border-warm-white/10",
              ].join(" ")}
              style={{
                width: size.slide,
                height: size.height,
                transform: isActive ? "scale(1)" : `scale(${INACTIVE_SCALE})`,
                opacity: isActive ? 1 : 0.42,
                marginLeft: isActive ? 0 : -shrinkPx,
                marginRight: isActive ? 0 : -shrinkPx,
                transition:
                  `transform ${TRANSITION_MS}ms ${EASING}, ` +
                  `opacity ${TRANSITION_MS}ms ease, ` +
                  `margin ${TRANSITION_MS}ms ${EASING}`,
                transformOrigin: "center center",
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              {isActive && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent px-3 py-2.5">
                  <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-gold-soft/90">
                    {item.tag}
                  </span>
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
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
      <Carousel size={{ slide: 260, gap: 4, height: 330 }} />
    </aside>
  );
}

/** Mobile placement — below CTAs, smaller. */
export function HeroProductStripMobile() {
  return (
    <div className="mt-10 -mx-2 lg:hidden">
      <Carousel size={{ slide: 200, gap: 3, height: 250 }} />
    </div>
  );
}
