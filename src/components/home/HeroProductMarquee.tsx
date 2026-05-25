import { useEffect, useState } from "react";
import p1 from "@/assets/hero-product-1.jpg";
import p2 from "@/assets/hero-product-2.jpg";
import p3 from "@/assets/hero-product-3.jpg";
import p4 from "@/assets/hero-product-4.jpg";

/**
 * Hero product carousel — stepped, 3s per slide.
 * One image is "active" (large, centered, fully opaque). Its neighbours peek
 * on either side, smaller and dimmer. Every 3 seconds the next image slides
 * in and becomes active. All four edges fade into the hero background.
 * Honors `prefers-reduced-motion` (animation paused on the active slide).
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
const TRANSITION_MS = 900;

type Size = {
  /** width of each slide in px */
  slide: number;
  /** gap between slides in px */
  gap: number;
  /** total track height in px */
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
    const id = window.setInterval(() => setActive((i) => (i + 1) % n), STEP_MS);
    return () => window.clearInterval(id);
  }, [n]);

  // Render a wide strip with repeats so neighbours are always present.
  // We render 3 copies and keep `active` pointing into the middle copy.
  const REPEATS = 3;
  const list = Array.from({ length: REPEATS }, () => heroProducts).flat();
  const middleOffset = n; // index into `list` corresponding to original[0] in middle copy
  const centerIndex = middleOffset + active;

  const step = size.slide + size.gap;
  // translate so that `centerIndex` slide is centred in the container.
  const translate = `calc(50% - ${size.slide / 2}px - ${centerIndex * step}px)`;

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
          transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
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
                  ? "border-gold-soft/70 shadow-[0_22px_50px_-14px_rgba(0,0,0,0.6)]"
                  : "border-warm-white/10",
              ].join(" ")}
              style={{
                width: size.slide,
                height: size.height,
                transform: isActive ? "scale(1)" : "scale(0.58)",
                opacity: isActive ? 1 : 0.5,
                transition: `transform ${TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1), opacity ${TRANSITION_MS}ms ease`,
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
      <Carousel size={{ slide: 240, gap: 6, height: 320 }} />
    </aside>
  );
}

/** Mobile placement — below CTAs, smaller. */
export function HeroProductStripMobile() {
  return (
    <div className="mt-10 -mx-2 lg:hidden">
      <Carousel size={{ slide: 180, gap: 4, height: 230 }} />
    </div>
  );
}
