import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Creator } from "./creators-data";
import { cn } from "@/lib/utils";
import { LazyImage } from "@/components/ui/lazy-image";

interface CreatorCardProps {
  creator: Creator;
  /** index used for editorial numerals — 0-based */
  index: number;
}

export function CreatorCard({ creator, index }: CreatorCardProps) {
  const isTall = creator.emphasis === "tall";

  return (
    <Link
      to="/creators/$creatorId"
      params={{ creatorId: creator.id }}
      className="group block break-inside-avoid"
    >
      <article className="relative overflow-hidden rounded-2xl bg-cream transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)]">
        <div
          className={cn(
            "relative w-full overflow-hidden",
            isTall ? "aspect-[4/5]" : "aspect-[4/3]",
          )}
        >
          <LazyImage
            src={creator.image}
            alt={`Portrait of ${creator.fullName}, ${creator.craft.toLowerCase()} from ${creator.region}`}
            wrapperClassName="absolute inset-0"
            className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/55 via-charcoal/5 to-transparent" />

          {/* Editorial numeral */}
          <span className="absolute left-5 top-5 font-display text-2xl text-warm-white/90">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Craft chip */}
          <span className="absolute right-4 top-4 max-w-[52%] truncate rounded-full bg-warm-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-clay backdrop-blur sm:right-5 sm:top-5 sm:tracking-[0.22em]">
            {creator.craft}
          </span>

          {/* Bottom overlay caption */}
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-[28px] leading-none text-warm-white md:text-[32px]">
                {creator.firstName}
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-warm-white/80 sm:tracking-[0.22em]">
                <span className="h-px w-4 bg-warm-white/70" />
                {creator.region}
              </p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-warm-white/95 text-charcoal opacity-0 shadow-[var(--shadow-soft)] transition-all duration-500 group-hover:opacity-100">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>

      <div className="px-1 pt-5">
        <p className="text-[15px] leading-relaxed text-ink-muted">
          {creator.hook}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-clay transition-colors group-hover:text-clay-deep">
          See {creator.firstName}'s story
          <span
            aria-hidden
            className="inline-block h-px w-6 bg-clay transition-all duration-300 group-hover:w-9"
          />
        </span>
      </div>
    </Link>
  );
}
