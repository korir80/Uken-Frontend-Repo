import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { CreatorProfile } from "./creator-profile-data";
import { Reveal } from "./Reveal";
import { SectionLabel } from "@/components/ukena";
import { safeImg } from "@/lib/safeImage";
import { cn } from "@/lib/utils";

interface CreatorGalleryProps {
  creator: CreatorProfile;
}

/**
 * SECTION — Workshop gallery.
 *
 * Collects every image we have for the maker (header, portrait, process
 * stills) into a single Unsplash/Pexels-style editorial masonry. The grid
 * shows a tasteful first set on load; tapping "See more" expands the rest,
 * and any tile opens a lightbox with prev/next navigation. The layout is
 * fully responsive: 1 column on small phones, 2 on tablet, 3 on desktop,
 * with varied row spans so the masonry feels intentional rather than
 * uniform.
 */
export function CreatorGallery({ creator }: CreatorGalleryProps) {
  // Build a de-duplicated image list from every source we have.
  const images = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    const push = (src?: string) => {
      if (!src) return;
      const safe = safeImg(src);
      if (!safe || seen.has(safe)) return;
      seen.add(safe);
      out.push(safe);
    };
    push(creator.headerImage);
    push(creator.portraitImage);
    creator.processSteps?.forEach((s) => push(s.image));
    return out;
  }, [creator]);

  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  // Don't render the section if there is nothing to show beyond the hero.
  if (images.length < 2) return null;

  const INITIAL = 6;
  const visible = expanded ? images : images.slice(0, INITIAL);
  const hasMore = images.length > INITIAL;

  // Varied row spans for masonry feel — deterministic, not random.
  const spanFor = (i: number) => {
    const pattern = [
      "row-span-2",
      "row-span-1",
      "row-span-1",
      "row-span-2",
      "row-span-1",
      "row-span-2",
      "row-span-1",
      "row-span-1",
    ];
    return pattern[i % pattern.length];
  };

  return (
    <section className="bg-warm-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              <SectionLabel>Inside the workshop</SectionLabel>
              <h2 className="mt-3 font-display text-[28px] leading-[1.05] tracking-tight text-charcoal sm:text-[34px] md:text-[42px]">
                A closer look at{" "}
                <em className="italic text-terracotta">
                  {creator.firstName}&rsquo;s
                </em>{" "}
                world.
              </h2>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-ink-muted">
              {images.length} photograph{images.length === 1 ? "" : "s"} from
              the workshop, hands and finished pieces. Tap any image to view
              full size.
            </p>
          </div>
        </Reveal>

        {/* Masonry grid — auto-rows + spans give the editorial Unsplash feel */}
        <div className="mt-8 grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[160px] sm:gap-4 md:mt-10 md:auto-rows-[180px] md:grid-cols-3 lg:auto-rows-[200px]">
          {visible.map((src, i) => (
            <motion.button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              className={cn(
                "group relative overflow-hidden rounded-xl bg-sand-soft outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2",
                spanFor(i),
              )}
              aria-label={`View photograph ${i + 1} of ${images.length}`}
            >
              <img
                src={src}
                alt=""
                loading={i < 3 ? "eager" : "lazy"}
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display =
                    "none";
                }}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              />
              {/* hover overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-warm-white/80 text-charcoal opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                <Maximize2 className="h-3.5 w-3.5" />
              </div>
            </motion.button>
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center md:mt-10">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="group inline-flex items-center gap-3 rounded-full border border-charcoal/15 bg-warm-white px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.22em] text-charcoal transition-colors hover:border-terracotta hover:text-terracotta"
            >
              {expanded
                ? "Show fewer"
                : `See all ${images.length} photographs`}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <Lightbox
            images={images}
            index={active}
            onClose={() => setActive(null)}
            onChange={setActive}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onChange,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        onChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onChange, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur transition hover:bg-warm-white/20"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index - 1 + images.length) % images.length);
        }}
        className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur transition hover:bg-warm-white/20 sm:left-6"
        aria-label="Previous photograph"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <motion.img
        key={index}
        src={images[index]}
        alt=""
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] max-w-full rounded-lg object-contain shadow-2xl"
      />

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange((index + 1) % images.length);
        }}
        className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-warm-white/10 text-warm-white backdrop-blur transition hover:bg-warm-white/20 sm:right-6"
        aria-label="Next photograph"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-warm-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-warm-white backdrop-blur">
        {index + 1} / {images.length}
      </div>
    </motion.div>
  );
}
