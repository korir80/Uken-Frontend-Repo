import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import workshop from "@/assets/uken-weavers-wide.jpg";
import baskets from "@/assets/uken-baskets-row.jpg";
import hands from "@/assets/uken-weavers-hands.jpg";
import detail from "@/assets/uken-baskets-detail.jpg";

const SLIDES = [
  { src: workshop, alt: "Kenyan weavers seated together coiling sisal baskets under banana trees" },
  { src: baskets,  alt: "A row of finished handwoven sisal baskets in indigo, terracotta and natural fibre" },
  { src: hands,    alt: "Hands at work on a half-finished sisal basket, fibres fanning outward" },
  { src: detail,   alt: "Close-up of a stacked, striped sisal basket — the maker's signature pattern" },
];

const INTERVAL = 5200;

/**
 * Mid-page cinematic montage. Four warm, nostalgic images cross-fade
 * with a slow Ken Burns drift. Static quote sits over the top.
 */
export function ParallaxBand() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative h-[52vh] min-h-[340px] w-full overflow-hidden bg-charcoal md:h-[62vh] md:min-h-[420px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0, scale: 1.0 }}
          transition={{
            opacity: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: INTERVAL / 1000 + 2, ease: "linear" },
          }}
          className="absolute inset-0"
        >
          <img
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            width={1600}
            height={900}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Warm wash + vignette so text stays legible across all slides */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/35 to-charcoal/65" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,oklch(from_var(--charcoal)_l_c_h_/_0.55)_100%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-warm-white/85">
          From the land they belong to
        </span>
        <p className="mt-4 font-display text-[28px] italic leading-tight text-warm-white md:text-[42px] lg:text-[48px]">
          “Every piece begins where the maker stands —{" "}
          <span className="text-[oklch(0.88_0.06_55)]">in the soil, the herd, the morning light.”</span>
        </p>

        {/* Slide indicator dots */}
        <div className="mt-8 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-px transition-all duration-700 ${
                i === index ? "w-10 bg-warm-white/85" : "w-5 bg-warm-white/30"
              }`}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </section>
  );
}
