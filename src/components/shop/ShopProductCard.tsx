import { Link } from "@tanstack/react-router";
import type { Product } from "./product-data";
import { formatGBP } from "@/lib/cart";

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
      className="group block"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-cream">
          <img
            src={product.heroImage}
            alt={`${product.name} by ${product.creator.fullName}`}
            width={1024}
            height={1280}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />

          {/* Editorial numeral */}
          <span className="absolute left-4 top-4 font-display text-xl text-charcoal/80 mix-blend-multiply">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Craft chip */}
          <span className="absolute right-4 top-4 rounded-full bg-warm-white/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-clay backdrop-blur">
            {product.creator.craft}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-1 pt-5">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-[22px] leading-tight text-charcoal md:text-[24px]">
              {product.name}
            </h3>
            <span className="shrink-0 font-display text-[18px] tabular-nums text-clay-deep">
              {formatGBP(product.pricePence)}
            </span>
          </div>

          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted line-clamp-2">
            {product.dimensions} · {product.materials[0]}
          </p>

          {/* Creator attribution — non-negotiable, even on the fast path */}
          <div className="mt-auto flex items-center gap-3 pt-5">
            <img
              src={product.creator.portrait}
              alt=""
              aria-hidden
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="text-[12px] uppercase tracking-[0.18em] text-ink-muted">
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
