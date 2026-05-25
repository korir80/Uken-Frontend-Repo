import { useEffect, useRef, useState } from "react";
import p1 from "@/assets/hero-product-1.jpg";
import p2 from "@/assets/hero-product-2.jpg";
import p3 from "@/assets/hero-product-3.jpg";
import p4 from "@/assets/hero-product-4.jpg";

export const heroProducts: { src: string; alt: string; tag: string }[] = [
  { src: p1, alt: "Maasai beaded fringe earrings", tag: "Beadwork · Kajiado" },
  { src: p2, alt: "Orange triple-disc beaded earrings", tag: "Beadwork · Narok" },
  { src: p3, alt: "Green disc beaded earrings", tag: "Beadwork · Loitokitok" },
  { src: p4, alt: "Stacked Maasai bracelets", tag: "Bracelets · Magadi" },
];

const INTERVAL = 3000;
const TRANSITION_MS = 800;

// Preload all images upfront so first paint is instant
heroProducts.forEach(({ src }) => {
  const img = new Image();
  img.src = src;
});

function ProductCarousel({ heightClass }: { heightClass: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = heroProducts.length;

  const mod = (n: number) => ((n % count) + count) % count;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((cur) => {
        setPrev(cur);
        return mod(cur + 1);
      });
    }, INTERVAL);
    return () => clearInterval(intervalRef.current!);
  }, []);

  // Clear "prev" after transition so it stops being highlighted
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), TRANSITION_MS);
    return () => clearTimeout(t);
  }, [prev]);

  // Slots: prev(-1) · active(0) · next(+1) · far(+2)
  const slots = [-1, 0, 1, 2].map((offset) => {
    const idx = mod(activeIndex + offset);
    const isActive = offset === 0;
    const isLeaving = idx === prev && !isActive;
    const isAdjacent = offset === -1 || offset === 1;
    return { idx, isActive, isAdjacent, isLeaving, offset };
  });

  return (
    <div
      aria-label="Featured artisan pieces"
      className={`relative w-full overflow-hidden ${heightClass}`}
      style={{
        maskImage: [
          "linear-gradient(to right,  transparent 0%,  black 18%, black 82%, transparent 100%)",
          "linear-gradient(to bottom, transparent 0%,  black 14%, black 86%, transparent 100%)",
        ].join(", "),
        WebkitMaskImage: [
          "linear-gradient(to right,  transparent 0%,  black 18%, black 82%, transparent 100%)",
          "linear-gradient(to bottom, transparent 0%,  black 14%, black 86%, transparent 100%)",
        ].join(", "),
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center gap-2">
        {slots.map(({ idx, isActive, isAdjacent, isLeaving, offset }) => {
          const item = heroProducts[idx];

          // Height: active tallest, adjacent mid, far smallest
          const height = isActive ? "88%" : isAdjacent ? "64%" : "48%";

          const opacity = isActive ? 1 : isAdjacent ? 0.6 : 0.3;

          return (
            <figure
              key={offset} // stable key by slot position, not item — avoids remount flicker
              className="relative flex-none overflow-hidden rounded-sm border bg-charcoal/40"
              style={{
                aspectRatio: "4 / 5",
                height,
                opacity,
                borderColor: isActive ? "rgba(212,175,90,0.55)" : "rgba(255,255,255,0.07)",
                transition: [
                  `height ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
                  `opacity ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
                  `border-color ${TRANSITION_MS}ms ease`,
                ].join(", "),
                willChange: "height, opacity",
              }}
            >
              {/* Blur placeholder — replaced by real img once loaded */}
              <img
                src={item.src}
                alt={item.alt}
                width={400}
                height={500}
                // First image eager, rest lazy
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={idx === 0 ? "high" : "low"}
                className="h-full w-full object-cover"
                style={{
                  transition: `opacity ${TRANSITION_MS}ms ease`,
                }}
              />

              {/* Caption — active only, deliberately faded/subtle */}
              <figcaption
                className="absolute inset-x-0 bottom-0 px-3 py-3"
                style={{
                  background:
                    "linear-gradient(to top, rgba(18,12,6,0.72) 0%, rgba(18,12,6,0.28) 60%, transparent 100%)",
                  opacity: isActive ? 1 : 0,
                  transition: `opacity ${TRANSITION_MS}ms ease`,
                  pointerEvents: "none",
                }}
              >
                <span
                  className="font-sans uppercase"
                  style={{
                    fontSize: "8px",
                    letterSpacing: "0.20em",
                    color: "rgba(212,175,90,0.45)", // intentionally dim
                  }}
                >
                  {item.tag}
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

export function HeroProductMarquee() {
  return (
    <aside
      aria-label="Featured artisan pieces"
      className="pointer-events-none absolute right-6 top-1/2 hidden w-[520px] -translate-y-1/2 lg:block xl:right-10 xl:w-[560px]"
    >
      <ProductCarousel heightClass="h-[300px] xl:h-[330px]" />
    </aside>
  );
}

export function HeroProductStripMobile() {
  return (
    <div className="mt-10 -mx-2 lg:hidden">
      <ProductCarousel heightClass="h-[210px] sm:h-[240px]" />
    </div>
  );
}
