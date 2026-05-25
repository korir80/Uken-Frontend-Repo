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
const TRANSITION_MS = 900;

// Preload all images so first paint is instant
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

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), TRANSITION_MS);
    return () => clearTimeout(t);
  }, [prev]);

  // Slots: prev(-1) · active(0) · next(+1) · far(+2)
  const slots = [-1, 0, 1, 2].map((offset) => {
    const idx = mod(activeIndex + offset);
    const isActive = offset === 0;
    const isAdjacent = offset === -1 || offset === 1;
    return { idx, isActive, isAdjacent, offset };
  });

  return (
    <div
      aria-label="Featured artisan pieces"
      className={`relative w-full overflow-hidden ${heightClass}`}
      style={{
        // Aggressive top/bottom fade so cards bleed into hero bg naturally
        // Left starts at 14% so prev is partially visible; right mirrors it
        maskImage: [
          "linear-gradient(to right,  transparent 0%, black 14%, black 86%, transparent 100%)",
          "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        ].join(", "),
        WebkitMaskImage: [
          "linear-gradient(to right,  transparent 0%, black 14%, black 86%, transparent 100%)",
          "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        ].join(", "),
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      {/* Flex row with negative margin-left on every card except first to create overlap */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center" style={{ gap: 0 }}>
        {slots.map(({ idx, isActive, isAdjacent, offset }, slotI) => {
          const item = heroProducts[idx];

          const height = isActive ? "90%" : isAdjacent ? "65%" : "50%";
          const opacity = isActive ? 1 : isAdjacent ? 0.62 : 0.32;
          // z-index: active on top, then adjacent, then far
          const zIndex = isActive ? 10 : isAdjacent ? 5 : 1;
          // Overlap: shift every card left except the first slot
          const marginLeft = slotI === 0 ? 0 : -18;

          return (
            <figure
              key={offset}
              className="relative flex-none overflow-hidden rounded-sm border bg-charcoal/40"
              style={{
                aspectRatio: "4 / 5",
                height,
                opacity,
                zIndex,
                marginLeft,
                borderColor: isActive ? "rgba(212,175,90,0.55)" : "rgba(255,255,255,0.07)",
                transition: [
                  `height ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
                  `opacity ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
                  `border-color ${TRANSITION_MS}ms ease`,
                  `margin-left ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)`,
                ].join(", "),
                willChange: "height, opacity",
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                width={400}
                height={500}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={idx === 0 ? "high" : "auto"}
                className="h-full w-full object-cover"
              />

              {/* Caption — active only, deliberately dim */}
              <figcaption
                className="absolute inset-x-0 bottom-0 px-3 py-3"
                style={{
                  background:
                    "linear-gradient(to top, rgba(18,12,6,0.75) 0%, rgba(18,12,6,0.25) 55%, transparent 100%)",
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
                    color: "rgba(212,175,90,0.42)",
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
