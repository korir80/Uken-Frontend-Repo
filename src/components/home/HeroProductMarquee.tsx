import { useEffect, useState } from "react";
import p1 from "@/assets/hero-product-1.jpg";
import p2 from "@/assets/hero-product-2.jpg";
import p3 from "@/assets/hero-product-3.jpg";
import p4 from "@/assets/hero-product-4.jpg";

/**
 * Hero product carousel.
 * 3 visible slides at all times: previous (small) · active (large) · next (small).
 * Every 3s the next image becomes active and slides smoothly to centre.
 * Forward-only, infinite, very tight spacing, fades on all four sides.
 */
export const heroProducts: { src: string; alt: string; tag: string }[] = [
  { src: p1, alt: "Maasai beaded fringe earrings", tag: "Beadwork · Kajiado" },
  { src: p2, alt: "Orange triple-disc beaded earrings", tag: "Beadwork · Narok" },
  { src: p3, alt: "Green disc beaded earrings", tag: "Beadwork · Loitokitok" },
  { src: p4, alt: "Stacked Maasai bracelets", tag: "Bracelets · Magadi" },
];

const FOUR_SIDE_MASK =
  "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), " +
  "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)";

const STEP_MS = 3000;
const TRANSITION_MS = 1100;
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

type Size = {
  base: number;        // base slide width (inactive baseline) in px
  gap: number;         // visual gap between neighbouring slides in px
  activeScale: number; // scale applied to the active slide
  inactiveScale: number; // scale applied to all other slides
  height: number;      // container height in px
};

function Carousel({ size }: Size extends never ? never : { size: Size }) {
  const [tick, setTick] = useState(0);
  const n = heroProducts.length;

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setTick((t) => t + 1), STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  // Render a long ribbon so we never run out of slides while moving forward.
  const REPEATS = 40;
  const list = Array.from({ length: REPEATS }, (_, k) => heroProducts[k % n]);
  // Active index keeps marching forward (no jumps -> no visual seams).
  const activeIndex = Math.floor(REPEATS / 4) + tick;

  const step = size.base + size.gap;
  // Centre the active slide: shift ribbon so activeIndex sits at 50% of container.
  const translate = `calc(50% - ${size.base / 2}px - ${activeIndex * step}px)`;

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
          const isActive = i === activeIndex;
          const scale = isActive ? size.activeScale : size.inactiveScale;
          return (
            <figure
              key={i}
              className={[
                "relative flex-none overflow-hidden rounded-sm border bg-charcoal/40",
                isActive
                  ? "z-10 border-gold-soft/70 shadow-[0_28px_60px_-18px_rgba(0,0,0,0.7)]"
                  : "border-warm-white/15",
              ].join(" ")}
              style={{
                width: size.base,
                height: size.height,
                transform: `scale(${scale})`,
                opacity: isActive ? 1 : 0.5,
                transition:
                  `transform ${TRANSITION_MS}ms ${EASING}, ` +
                  `opacity ${TRANSITION_MS}ms ease`,
                transformOrigin: "center center",
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                draggable={false}
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
      className="pointer-events-none absolute right-6 top-1/2 hidden w-[560px] -translate-y-1/2 lg:block xl:right-10 xl:w-[620px]"
    >
      <Carousel
        size={{
          base: 170,
          gap: 6,
          activeScale: 1.35,
          inactiveScale: 0.62,
          height: 230,
        }}
      />
    </aside>
  );
}

/** Mobile placement — below CTAs, smaller. */
export function HeroProductStripMobile() {
  return (
    <div className="mt-10 -mx-2 lg:hidden">
      <Carousel
        size={{
          base: 130,
          gap: 5,
          activeScale: 1.3,
          inactiveScale: 0.62,
          height: 180,
        }}
      />
    </div>
  );
}
