import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { BagIndicator } from "@/components/product/BagIndicator";

const navLinks = [
  { label: "Shop", to: "/shop" as const },
  { label: "Explore Creators", to: "/explore" as const },
  { label: "Our Story", to: "/story" as const },
  { label: "Join as Artisan", to: "/join" as const },
];

/**
 * A solid-background variant of the marketing NavBar — used on interior
 * pages that don't open with a full-bleed dark hero (Explore, Shop, Join).
 *
 * Mobile navigation is handled by the floating MobileNavFab (mounted in
 * __root). The header keeps the wordmark + bag visible on mobile and
 * shows the full link set ≥md.
 */
export function ExploreNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-warm-white/90 backdrop-blur-md transition-all duration-500",
        scrolled ? "border-b border-border/70" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-10 md:py-5">
        <Link
          to="/"
          className="font-display text-2xl tracking-tight text-charcoal md:text-3xl"
        >
          Ukena
        </Link>

        <nav className="hidden items-center gap-8 md:flex lg:gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              activeProps={{ className: "text-clay" }}
              className="text-[14px] font-medium tracking-wide text-charcoal/80 transition-colors hover:text-clay"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <BagIndicator tone="light" />
        </div>
      </div>
    </header>
  );
}
