import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import type { CreatorProfile } from "./creator-profile-data";
import { LazyImage } from "@/components/ui/lazy-image";

interface CreatorHeaderProps {
  creator: CreatorProfile;
}

/**
 * SECTION 1 — Editorial header.
 *
 * The portrait progressively falls back through every related image the
 * creator has — header, avatar, process steps, then product hero shots —
 * before ever surfacing the illustrated placeholder.
 */
export function CreatorHeader({ creator }: CreatorHeaderProps) {
  const primary = creator.headerImage || creator.coverImage;
  const fallbacks: string[] = [
    creator.coverImage,
    creator.avatar,
    creator.portraitImage,
    ...(creator.processSteps?.map((s) => s.image) ?? []),
    ...(creator.products?.map((p) => p.image) ?? []),
  ].filter(Boolean) as string[];

  return (
    <section className="relative bg-warm-white pt-24 pb-10 md:pt-28 md:pb-16 lg:pt-32 lg:pb-20">
      {/* Soft sand gradient behind the whole stage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-cream/80 to-transparent"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 md:gap-10 md:px-10 lg:gap-14">
        {/* LEFT — editorial copy */}
        <div className="order-2 flex flex-col justify-center md:order-1 md:col-span-6 lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] font-medium uppercase tracking-[0.28em] text-terracotta"
          >
            A UKEN Maker · No. {creator.id.slice(0, 2).toUpperCase()}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-[44px] leading-[0.95] tracking-tight text-charcoal sm:text-[64px] md:text-[88px] lg:text-[112px]"
          >
            {creator.firstName}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-charcoal/75 md:mt-7"
          >
            <span className="text-[12px] uppercase tracking-[0.22em]">
              {creator.craft}
            </span>
            <span className="h-px w-8 bg-charcoal/30" aria-hidden />
            <span className="text-[12px] uppercase tracking-[0.22em]">
              {creator.region}
            </span>
          </motion.div>

          {creator.pullQuote && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45 }}
              className="mt-7 max-w-md font-display text-[18px] italic leading-[1.4] text-charcoal/75 md:text-[20px]"
            >
              &ldquo;{creator.pullQuote}&rdquo;
            </motion.p>
          )}

          {/* Scroll cue (desktop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 hidden items-center gap-2 text-charcoal/55 md:flex"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">
              The story
            </span>
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT — framed portrait card with stacked accent */}
        <div className="order-1 md:order-2 md:col-span-6 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[440px] md:max-w-none"
          >
            {/* Accent tile behind */}
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 h-full w-full rounded-2xl bg-terracotta/15 md:-bottom-5 md:-right-5"
            />
            <div
              aria-hidden
              className="absolute -top-3 -left-3 h-24 w-24 rounded-2xl border border-terracotta/40 md:-top-4 md:-left-4 md:h-32 md:w-32"
            />

            <figure className="relative overflow-hidden rounded-2xl border border-border/70 bg-cream p-2 shadow-[var(--shadow-card)]">
              <div className="relative overflow-hidden rounded-xl bg-sand-soft">
                <LazyImage
                  src={primary}
                  fallbackSrcs={fallbacks}
                  alt={`${creator.fullName}, ${creator.craft.toLowerCase()} from ${creator.region}`}
                  eager
                  ratio="4/5"
                  wrapperClassName="w-full"
                  className="h-full w-full object-cover"
                />
                {/* gentle inner vignette for warmth */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/15 via-transparent to-transparent"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                <span>{creator.fullName}</span>
                <span className="text-terracotta">·</span>
                <span>{creator.region}</span>
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
