import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { X, ArrowRight, ShoppingBag } from "lucide-react";
import type { Product } from "@/components/product/product-data";
import { LazyImage } from "@/components/ui/lazy-image";
import { useCart, formatGBP } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface QuickViewDrawerProps {
  product: Product | null;
  onClose: () => void;
}

/**
 * QuickViewDrawer — right-side panel that lets a buyer add a piece to the
 * bag without leaving the gallery. The creator attribution remains the
 * signature beneath the product (signature, not headline) and a "See full
 * story" link routes to the full PDP for the longer narrative.
 */
export function QuickViewDrawer({ product, onClose }: QuickViewDrawerProps) {
  const { addItem } = useCart();
  const open = Boolean(product);

  // Lock body scroll while the drawer is open and wire Escape-to-close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function handleAdd() {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      pricePence: product.pricePence,
      image: product.heroImage,
      creator: {
        id: product.creator.id,
        fullName: product.creator.fullName,
        region: product.creator.region,
      },
    });
  }

  return (
    <div
      aria-hidden={!open}
      className={cn("fixed inset-0 z-[80]", !open && "pointer-events-none")}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close quick view"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-charcoal/55 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={product ? `Quick view — ${product.name}` : undefined}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-warm-white shadow-[-12px_0_40px_-12px_rgba(0,0,0,0.35)] transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-5">
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Quick view
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-11 w-11 place-items-center rounded-full text-charcoal/70 transition-colors hover:bg-cream hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {product && (
          <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 md:px-8 md:pb-8">
            <div className="overflow-hidden rounded-2xl bg-cream">
              <LazyImage
                src={product.heroImage}
                alt={product.name}
                ratio="4/5"
                wrapperClassName="w-full"
              />
            </div>

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
                {product.name}
              </h2>
              <span className="shrink-0 font-display text-2xl tabular-nums text-clay-deep md:text-3xl">
                {formatGBP(product.pricePence)}
              </span>
            </div>

            <p className="mt-2 text-[12px] uppercase tracking-[0.22em] text-clay">
              {product.creator.craft}
            </p>

            {/* One-line piece story */}
            <p className="mt-5 text-[15px] leading-relaxed text-charcoal/80 md:text-base">
              {product.pieceStory.split(/(?<=\.)\s+/)[0]}
            </p>

            {/* Creator attribution — signature, not hero */}
            <Link
              to="/creators/$creatorId"
              params={{ creatorId: product.creator.id }}
              className="group mt-7 flex items-center gap-4 rounded-2xl border border-border/70 bg-cream/40 p-4 transition-colors hover:border-clay/50"
            >
              <img
                src={product.creator.portrait}
                alt=""
                aria-hidden
                className="h-14 w-14 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  Made by
                </p>
                <p className="font-display text-lg leading-tight text-charcoal transition-colors group-hover:text-clay">
                  {product.creator.fullName}
                </p>
                <p className="text-[12px] text-ink-muted">
                  {product.creator.region}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-charcoal/40 transition-all group-hover:translate-x-1 group-hover:text-clay" />
            </Link>

            {/* Sticky footer actions */}
            <div className="mt-auto pt-8">
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-charcoal px-6 text-[12px] font-medium uppercase tracking-[0.22em] text-warm-white transition-colors hover:bg-clay"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to bag
              </button>
              <Link
                to="/products/$productId"
                params={{ productId: product.id }}
                onClick={onClose}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal/70 transition-colors hover:text-clay"
              >
                See the full story
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
