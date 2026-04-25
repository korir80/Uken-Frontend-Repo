import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import type { CreatorProfile } from "./creator-profile-data";

interface CreatorHeaderProps {
  creator: CreatorProfile;
}

/**
 * SECTION 1 — Immersive header.
 * 85vh environmental shot of where the creator works, with their first
 * name set very large in serif. No CTA, only a gentle scroll cue.
 */
export function CreatorHeader({ creator }: CreatorHeaderProps) {
  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-charcoal">
      <img
        src={creator.headerImage}
        alt={`Inside ${creator.firstName}'s workshop in ${creator.region}`}
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Top fade for nav legibility */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-charcoal/65 to-transparent" />
      {/* Bottom vignette for headline legibility */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 md:px-10 md:pb-28">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[11px] font-medium uppercase tracking-[0.28em] text-warm-white/80"
        >
          A Uken Maker · No. {creator.id.slice(0, 2).toUpperCase()}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.1,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-6 font-display text-[64px] leading-[0.92] tracking-tight text-warm-white md:text-[140px] lg:text-[176px]"
        >
          {creator.firstName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-warm-white/85"
        >
          <span className="text-[13px] uppercase tracking-[0.22em]">
            {creator.craft}
          </span>
          <span className="h-px w-8 bg-warm-white/40" aria-hidden />
          <span className="text-[13px] uppercase tracking-[0.22em]">
            {creator.region}
          </span>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-warm-white/70"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">
          Her story
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
