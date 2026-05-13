import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ProductCreatorRef } from "@/components/product/product-data";
import { safeImg } from "@/lib/safeImage";

const hideOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

interface CreatorAttributionProps {
  creator: ProductCreatorRef | {
    id: string;
    fullName: string;
    region: string;
    portrait?: string;
  };
  /**
   * Visual weight:
   *  - prominent: large, sits at top of product page
   *  - inline: compact, used inside bag lines and order summaries
   *  - footer: full creator card variant for "always visible" reassurance
   */
  variant?: "prominent" | "inline" | "footer";
  className?: string;
}

/**
 * The single source of truth for "made by …" attribution. Used everywhere
 * a buyer sees a product so the artisan never disappears from the journey.
 */
export function CreatorAttribution({
  creator,
  variant = "prominent",
  className,
}: CreatorAttributionProps) {
  const portrait = "portrait" in creator ? creator.portrait : undefined;

  if (variant === "inline") {
    return (
      <Link
        to="/creators/$creatorId"
        params={{ creatorId: creator.id }}
        className={cn(
          "inline-flex items-center gap-2 text-[12px] text-ink-muted transition-colors hover:text-clay",
          className,
        )}
      >
        {portrait && (
          <img
            src={portrait}
            alt=""
            className="h-5 w-5 rounded-full object-cover"
            width={20}
            height={20}
            loading="lazy"
          />
        )}
        <span>
          Made by{" "}
          <span className="font-medium text-charcoal">{creator.fullName}</span>
        </span>
      </Link>
    );
  }

  if (variant === "footer") {
    const craft = "craft" in creator ? creator.craft : undefined;
    const firstName =
      "firstName" in creator
        ? creator.firstName
        : creator.fullName.split(" ")[0];
    return (
      <Link
        to="/creators/$creatorId"
        params={{ creatorId: creator.id }}
        className={cn(
          "group flex items-center gap-5 rounded-2xl border border-border/70 bg-cream p-5 transition-all duration-500 hover:shadow-[var(--shadow-card)] md:gap-6 md:p-6",
          className,
        )}
      >
        {portrait && (
          <img
            src={portrait}
            alt={creator.fullName}
            width={120}
            height={120}
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-full object-cover md:h-24 md:w-24"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta">
            The maker
          </p>
          <p className="mt-2 font-display text-2xl text-charcoal">
            {creator.fullName}
          </p>
          <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-ink-muted">
            {craft ? `${craft} · ` : ""}
            {creator.region}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-clay">
            Read {firstName}'s full story
            <span
              aria-hidden
              className="inline-block h-px w-6 bg-clay transition-all duration-300 group-hover:w-10"
            />
          </span>
        </div>
      </Link>
    );
  }

  // prominent (default)
  return (
    <Link
      to="/creators/$creatorId"
      params={{ creatorId: creator.id }}
      className={cn(
        "group inline-flex items-center gap-3 text-charcoal/85 transition-colors hover:text-clay",
        className,
      )}
    >
      {portrait && (
        <img
          src={portrait}
          alt={creator.fullName}
          width={48}
          height={48}
          loading="lazy"
          className="h-10 w-10 rounded-full object-cover ring-1 ring-border/70"
        />
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.22em] text-terracotta">
          By the maker
        </span>
        <span className="mt-1 text-[14px]">
          <span className="font-medium">{creator.fullName}</span>
          <span className="text-ink-muted"> — {creator.region}</span>
        </span>
      </span>
    </Link>
  );
}
