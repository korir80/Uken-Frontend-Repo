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
const TRANSITION_MS = 700;

function ProductCarousel({ heightClass }: { heightClass: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const count = heroProducts.length;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % count);
        setIsTransitioning(false);
      }, TRANSITION_MS);
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [count]);

  // Build a window: [prev, active, next, next+1] — always show 4, centered on active
  const getItem = (offset: number) => heroProducts[(activeIndex + offset + count * 10) % count];

  // Render items: one before active + active + two after
  const slots = [
    { item: getItem(-1), role: "prev" },
    { item: getItem(0), role: "active" },
    { item: getItem(1), role: "next" },
    { item: getItem(2), role: "far" },
  ];

  return (
    <div
      aria-label="Featured artisan pieces"
      className={`relative w-full overflow-hidden ${heightClass}`}
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center gap-1.5">
        {slots.map(({ item, role }, i) => {
          const isActive = role === "active";
          const isAdjacent = role === "prev" || role === "next";

          return (
            <figure
              key={`${role}-${item.src}`}
              className="relative flex-none overflow-hidden rounded-sm border bg-charcoal/40"
              style={{
                aspectRatio: "4 / 5",
                height: isActive ? "88%" : isAdjacent ? "66%" : "52%",
                transition: `height ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1),
                             opacity ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1),
                             border-color ${TRANSITION_MS}ms ease`,
                opacity: isActive ? 1 : isAdjacent ? 0.65 : 0.35,
                borderColor: isActive ? "rgba(var(--gold-soft-rgb, 212,175,90), 0.6)" : "rgba(255,255,255,0.08)",
                willChange: "height, opacity",
              }}
            >
              <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
              {isActive && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-transparent px-3 py-2.5">
                  <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-gold-soft/90">{item.tag}</span>
                </figcaption>
              )}
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
