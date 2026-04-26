import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import type { Product } from "@/components/product/product-data";
import { formatGBP } from "@/lib/cart";
import { LazyImage } from "@/components/ui/lazy-image";
import { SaveHeart } from "@/components/product/SaveHeart";
import { cn } from "@/lib/utils";

interface ShopProductCardProps {
  product: Product;
  /** index used for editorial numerals — 0-based */
  index: number;
  /** Open the right-side quick-view drawer with this product. */
  onQuickView?: (product: Product) => void;
}

/**
 * Quieter, product-led card for the /shop catalogue surface.
 *
 * - Hero image dominates. On hover, a process/detail shot from the gallery
 *   slides in to hint at how the piece was made — the story is *visible*
 *   without being mandatory.
 * - A "Learn the story" link surfaces only on hover, routing to the full
 *   creator profile.
 * - A "Quick view" button (also hover-only) opens the side drawer so a
 *   buyer can add to bag without leaving the grid.
 * - Creator attribution is preserved at the foot of every card so the
 *   "fast path" for returning buyers never strips the maker away.
 */
export function ShopProductCard({
  product,
  index,
  onQuickView,
}: ShopProductCardProps) {
  // Pick the first non-product image as the hover/process reveal. Falls
  // back to the hero so we never crash on partial datasets.
  const processImage =
    product.gallery.find((g) => g.kind === "process")?.src ??
    product.gallery.find((g) => g.src !== product.heroImage)?.src ??
    product.heroImage;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border/60 bg-cream/90 p-3 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-sand-soft">
        {/* Base image — the finished piece */}
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="absolute inset-0 block min-h-[44px]"
          aria-label={`View ${product.name}`}
        >
          <LazyImage
            src={product.heroImage}
            alt={`${product.name} by ${product.creator.fullName}`}
            wrapperClassName="absolute inset-0"
            className={cn(
              "transition-all duration-[900ms] ease-out",
              "md:group-hover:scale-[1.02] md:group-hover:opacity-0",
            )}
          />
          {/* Process image — fades in on hover (desktop only) */}
          <img
            src={processImage}
            alt=""
            aria-hidden
            loading="lazy"
            className={cn(
              "absolute inset-0 hidden h-full w-full object-cover opacity-0",
              "transition-opacity duration-[900ms] ease-out",
              "md:block md:group-hover:opacity-100",
            )}
          />
        </Link>

        {/* Editorial numeral — desktop only, keeps mobile cards clean */}
        <span className="pointer-events-none absolute left-3 top-3 hidden font-display text-xl text-charcoal/80 mix-blend-multiply md:left-4 md:top-4 md:block">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Craft chip — desktop only on overlay; mobile keeps image clean */}
        <span className="pointer-events-none absolute right-3 top-3 hidden rounded-full bg-warm-white/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-clay backdrop-blur md:right-4 md:top-4 md:inline-block">
          {product.creator.craft}
        </span>

        {/* Wishlist heart — top-left on mobile, alongside numeral on desktop */}
        <SaveHeart
          productId={product.id}
          productName={product.name}
          className="absolute right-2 top-2 md:hidden"
        />
        <SaveHeart
          productId={product.id}
          productName={product.name}
          className="absolute bottom-3 right-3 hidden md:inline-flex"
        />

        {/* Quick view — desktop hover only, with focus fallback for keyboard users */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className={cn(
              "absolute bottom-4 left-1/2 hidden -translate-x-1/2 translate-y-2 items-center gap-2 rounded-full bg-warm-white/95 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal opacity-0 backdrop-blur transition-all duration-300 md:inline-flex",
              "group-hover:translate-y-0 group-hover:opacity-100",
              "focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-clay/40",
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Quick view
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4 md:pt-5">
        <div className="flex flex-col gap-1 min-[380px]:flex-row min-[380px]:items-baseline min-[380px]:justify-between min-[380px]:gap-3">
          <h3 className="font-display text-[20px] leading-tight text-charcoal min-[380px]:text-[17px] md:text-[22px]">
            <Link
              to="/products/$productId"
              params={{ productId: product.id }}
              className="transition-colors hover:text-clay"
            >
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 font-display text-[17px] tabular-nums text-clay-deep min-[380px]:text-[16px] md:text-[18px]">
            {formatGBP(product.pricePence)}
          </span>
        </div>

        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted line-clamp-1 md:mt-2 md:line-clamp-2">
          <span className="md:hidden">{product.creator.craft}</span>
          <span className="hidden md:inline">
            {product.dimensions} · {product.materials[0]}
          </span>
        </p>

        {/* Creator byline — small, subtle, links to her profile */}
        <p className="mt-1.5 text-[13px] text-charcoal/75 md:mt-2">
          by{" "}
          <Link
            to="/creators/$creatorId"
            params={{ creatorId: product.creator.id }}
            className="font-medium text-charcoal underline-offset-4 transition-colors hover:text-clay hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {product.creator.fullName}
          </Link>
        </p>

        {/* Hover-only "Learn the story" — desktop. Tap-target equivalent on mobile is the byline link above. */}
        <Link
          to="/creators/$creatorId"
          params={{ creatorId: product.creator.id }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "mt-auto hidden items-center gap-1.5 pt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-clay opacity-0",
            "transition-opacity duration-300 md:inline-flex md:group-hover:opacity-100",
          )}
        >
          Learn the story
          <span aria-hidden className="h-px w-5 bg-clay" />
        </Link>
      </div>
    </article>
  );
}
