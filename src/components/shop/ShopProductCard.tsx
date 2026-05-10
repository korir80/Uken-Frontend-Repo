import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { formatGBP } from "@/lib/cart";
import { LazyImage } from "@/components/ui/lazy-image";
import { SaveHeart } from "@/components/product/SaveHeart";
import { cn } from "@/lib/utils";

interface ShopProductCardProps {
  product: {
    id: string;
    name: string;
    pricePence: number;
    heroImage: string;
    creatorId?: string;
    creatorName?: string;
    craft?: string;
    dimensions?: string;
    materials?: string[];
    creator?: {
      id: string;
      fullName: string;
      craft: string;
      region: string;
      portrait?: string;
    };
    gallery?: { src: string; alt: string; kind?: string }[];
  };
  index: number;
  onQuickView?: (product: any) => void;
}

export function ShopProductCard({ product, index, onQuickView }: ShopProductCardProps) {
  // Support both ProductSummaryDto (flat) and ProductDto (nested creator)
  const creatorId = product.creator?.id ?? product.creatorId ?? "";
  const creatorName = product.creator?.fullName ?? product.creatorName ?? "";
  const craft = product.creator?.craft ?? product.craft ?? "";
  const dimensions = (product as any).dimensions ?? "";
  const materials: string[] = (product as any).materials ?? [];

  // Safe gallery — works with both old Product shape and new ProductDto
  const gallery = product.gallery ?? [];
  const processImage =
    gallery.find((g) => g.kind === "process")?.src ??
    gallery.find((g) => g.src !== product.heroImage)?.src ??
    product.heroImage;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border/60 bg-cream/90 p-3 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-sand-soft">
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="absolute inset-0 block min-h-[44px]"
          aria-label={`View ${product.name}`}
        >
          <LazyImage
            src={product.heroImage}
            alt={`${product.name} by ${creatorName}`}
            wrapperClassName="absolute inset-0"
            className={cn(
              "transition-all duration-[900ms] ease-out",
              "md:group-hover:scale-[1.02] md:group-hover:opacity-0",
            )}
          />
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

        <span className="pointer-events-none absolute left-3 top-3 hidden font-display text-xl text-charcoal/80 mix-blend-multiply md:left-4 md:top-4 md:block">
          {String(index + 1).padStart(2, "0")}
        </span>

        {craft && (
          <span className="pointer-events-none absolute right-3 top-3 hidden rounded-full bg-warm-white/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-clay backdrop-blur md:right-4 md:top-4 md:inline-block">
            {craft}
          </span>
        )}

        <SaveHeart productId={product.id} productName={product.name} className="absolute right-2 top-2 md:hidden" />
        <SaveHeart
          productId={product.id}
          productName={product.name}
          className="absolute bottom-3 right-3 hidden md:inline-flex"
        />

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
          <span className="md:hidden">{craft}</span>
          <span className="hidden md:inline">
            {dimensions}
            {materials[0] ? ` · ${materials[0]}` : ""}
          </span>
        </p>

        {creatorName && (
          <p className="mt-1.5 text-[13px] text-charcoal/75 md:mt-2">
            by{" "}
            <Link
              to="/creators/$creatorId"
              params={{ creatorId }}
              className="font-medium text-charcoal underline-offset-4 transition-colors hover:text-clay hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {creatorName}
            </Link>
          </p>
        )}

        {creatorId && (
          <Link
            to="/creators/$creatorId"
            params={{ creatorId }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "mt-auto hidden items-center gap-1.5 pt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-clay opacity-0",
              "transition-opacity duration-300 md:inline-flex md:group-hover:opacity-100",
            )}
          >
            Learn the story
            <span aria-hidden className="h-px w-5 bg-clay" />
          </Link>
        )}
      </div>
    </article>
  );
}
