import { Link } from "@tanstack/react-router";
import type { Product } from "@/components/product/product-data";
import { formatGBP } from "@/lib/cart";
import { LazyImage } from "@/components/ui/lazy-image";

interface ShopProductCardProps {
  product: Product;
  /** index used for editorial numerals — 0-based */
  index: number;
}

/**
 * Quieter, product-led card for the /shop catalogue surface.
 * Creator attribution is preserved at the foot of every card so the
 * "fast path" for returning buyers never strips the maker away.
 */
export function ShopProductCard({ product, index }: ShopProductCardProps) {
  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id }}
      className="group block min-h-[44px]"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream sm:aspect-[4/5]">
          <LazyImage
            src={product.heroImage}
            alt={`${product.name} by ${product.creator.fullName}`}
            wrapperClassName="absolute inset-0"
            className="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />

          {/* Editorial numeral — desktop only, keeps mobile cards clean */}
          <span className="absolute left-3 top-3 hidden font-display text-xl text-charcoal/80 mix-blend-multiply md:left-4 md:top-4 md:block">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Craft chip — desktop only on overlay; mobile keeps image clean */}
          <span className="absolute right-3 top-3 hidden rounded-full bg-warm-white/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-clay backdrop-blur md:right-4 md:top-4 md:inline-block">
            {product.creator.craft}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-1 pt-3 md:pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[17px] leading-tight text-charcoal md:text-[24px]">
              {product.name}
            </h3>
            <span className="shrink-0 font-display text-[16px] tabular-nums text-clay-deep md:text-[18px]">
              {formatGBP(product.pricePence)}
            </span>
          </div>

          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted line-clamp-1 md:mt-2 md:line-clamp-2">
            <span className="md:hidden">{product.creator.craft}</span>
            <span className="hidden md:inline">
              {product.dimensions} · {product.materials[0]}
            </span>
          </p>

          {/* Creator attribution — non-negotiable, even on the fast path */}
          <div className="mt-auto flex items-center gap-2.5 pt-3 md:gap-3 md:pt-5">
            <img
              src={product.creator.portrait}
              alt=""
              aria-hidden
              className="h-8 w-8 rounded-full object-cover md:h-9 md:w-9"
            />
            <div className="min-w-0">
              <p className="hidden text-[12px] uppercase tracking-[0.18em] text-ink-muted md:block">
                Made by
              </p>
              <p className="truncate text-[13px] font-medium text-charcoal transition-colors group-hover:text-clay">
                {product.creator.firstName} · {product.creator.region}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
