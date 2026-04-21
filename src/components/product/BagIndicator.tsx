import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface BagIndicatorProps {
  /** Tone of the surrounding nav (light surface vs. dark hero overlay). */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Small bag icon + count, suitable for any nav variant. Pure read from
 * the cart context — never mutates state itself.
 */
export function BagIndicator({ tone = "light", className }: BagIndicatorProps) {
  const { itemCount } = useCart();

  return (
    <Link
      to="/bag"
      aria-label={`Bag — ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        tone === "dark"
          ? "text-warm-white/90 hover:bg-warm-white/10 hover:text-warm-white"
          : "text-charcoal/85 hover:bg-sand-soft/60 hover:text-charcoal",
        className,
      )}
    >
      <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
      {itemCount > 0 && (
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-medium tabular-nums",
            "bg-terracotta text-warm-white ring-2",
            tone === "dark" ? "ring-charcoal" : "ring-warm-white",
          )}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
