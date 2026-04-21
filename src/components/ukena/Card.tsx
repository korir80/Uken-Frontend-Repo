import { cn } from "@/lib/utils";
import { Badge } from "./Badge";
import { Avatar } from "./Avatar";
import { ArrowUpRight } from "lucide-react";
import type { HTMLAttributes } from "react";

/* ---------- Base Card ---------- */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevation?: "flat" | "soft" | "lift";
  tone?: "cream" | "warm-white" | "sand";
}

const elevationMap = {
  flat: "",
  soft: "shadow-[var(--shadow-soft)]",
  lift: "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lift)]",
} as const;

const toneMap = {
  cream: "bg-cream",
  "warm-white": "bg-warm-white",
  sand: "bg-sand-soft",
} as const;

export function Card({
  className,
  elevation = "soft",
  tone = "cream",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 transition-all duration-500 ease-out",
        toneMap[tone],
        elevationMap[elevation],
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Story Card ---------- */

interface StoryCardProps extends HTMLAttributes<HTMLElement> {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  excerpt: string;
  author?: { name: string; avatar?: string; location?: string };
  readTime?: string;
}

export function StoryCard({
  image,
  imageAlt,
  eyebrow,
  title,
  excerpt,
  author,
  readTime,
  className,
  ...props
}: StoryCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-warm-white",
        "shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)]",
        "border border-border/60 transition-all duration-700 ease-out",
        className,
      )}
      {...props}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand-soft">
        <img
          src={image}
          alt={imageAlt ?? title}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent" />
        {eyebrow && (
          <span className="absolute left-5 top-5 rounded-full bg-warm-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-clay backdrop-blur">
            {eyebrow}
          </span>
        )}
      </div>

      <div className="space-y-4 p-7">
        <h3 className="font-display text-[26px] leading-[1.15] text-charcoal">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-ink-muted line-clamp-3">
          {excerpt}
        </p>

        {(author || readTime) && (
          <div className="flex items-center justify-between border-t border-border/70 pt-5">
            {author && (
              <div className="flex items-center gap-3">
                <Avatar src={author.avatar} name={author.name} size="sm" />
                <div className="leading-tight">
                  <div className="text-[13px] font-medium text-charcoal">
                    {author.name}
                  </div>
                  {author.location && (
                    <div className="text-[11px] uppercase tracking-wider text-ink-muted">
                      {author.location}
                    </div>
                  )}
                </div>
              </div>
            )}
            {readTime && (
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                {readTime}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------- Product Card ---------- */

interface ProductCardProps extends HTMLAttributes<HTMLElement> {
  image: string;
  imageAlt?: string;
  name: string;
  artisan: string;
  region?: string;
  price: string;
  badge?: { label: string; tone?: "clay" | "terracotta" | "gold" | "sand" };
}

export function ProductCard({
  image,
  imageAlt,
  name,
  artisan,
  region,
  price,
  badge,
  className,
  ...props
}: ProductCardProps) {
  return (
    <article
      className={cn(
        "group relative cursor-pointer rounded-xl bg-warm-white",
        "border border-border/60 transition-all duration-500 ease-out",
        "hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      <div className="relative overflow-hidden rounded-t-xl aspect-square bg-cream">
        <img
          src={image}
          alt={imageAlt ?? name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          loading="lazy"
        />
        {badge && (
          <div className="absolute left-3 top-3">
            <Badge variant={badge.tone ?? "cream"}>{badge.label}</Badge>
          </div>
        )}
        <button
          type="button"
          aria-label={`View ${name}`}
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-warm-white/95 text-charcoal opacity-0 shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:opacity-100 hover:bg-clay hover:text-warm-white"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="font-display text-xl leading-snug text-charcoal truncate">
              {name}
            </h4>
            <p className="mt-0.5 text-[12px] uppercase tracking-[0.16em] text-ink-muted truncate">
              by {artisan}
              {region ? ` · ${region}` : ""}
            </p>
          </div>
          <div className="font-display text-lg text-clay-deep whitespace-nowrap">
            {price}
          </div>
        </div>
      </div>
    </article>
  );
}
