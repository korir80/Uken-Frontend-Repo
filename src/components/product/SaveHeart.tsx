import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  isProductSaved,
  subscribeSavedProducts,
  toggleSavedProduct,
} from "@/lib/ukena-mode";
import { cn } from "@/lib/utils";

interface SaveHeartProps {
  productId: string;
  productName?: string;
  /**
   * "overlay" — translucent pill, sits on a product image (cards, PDP gallery)
   * "ghost"   — borderless, for inline use in a toolbar
   */
  variant?: "overlay" | "ghost";
  className?: string;
}

/**
 * Heart toggle that wishlists a product to localStorage. Stays in sync
 * across every mounted instance via the subscribeSavedProducts bus, so a
 * heart on the PDP and a heart on a related-products card always agree.
 */
export function SaveHeart({
  productId,
  productName,
  variant = "overlay",
  className,
}: SaveHeartProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isProductSaved(productId));
    const off = subscribeSavedProducts((ids) =>
      setSaved(ids.includes(productId)),
    );
    return off;
  }, [productId]);

  function onClick(e: React.MouseEvent) {
    // Hearts often live inside Link cards — don't navigate when tapped.
    e.preventDefault();
    e.stopPropagation();
    const next = toggleSavedProduct(productId);
    setSaved(next.includes(productId));
  }

  const label = saved
    ? `Remove ${productName ?? "piece"} from saved`
    : `Save ${productName ?? "piece"}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={cn(
        "group/heart inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300",
        variant === "overlay"
          ? "bg-warm-white/95 text-charcoal/70 shadow-[var(--shadow-soft)] backdrop-blur hover:bg-warm-white hover:text-clay"
          : "text-charcoal/70 hover:bg-cream hover:text-clay",
        saved && "text-clay",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-transform duration-300 group-hover/heart:scale-110",
          saved && "fill-current",
        )}
      />
    </button>
  );
}
