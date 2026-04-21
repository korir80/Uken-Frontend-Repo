import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Explore Creators", to: "/explore" },
  { label: "Our Story", to: "/story" },
  { label: "Join as Artisan", to: "/join" },
] as const;

/**
 * A solid-background variant of the marketing NavBar — used on interior
 * pages that don't open with a full-bleed dark hero (Explore, Join).
 */
export function ExploreNav() {
  const [open, setOpen] = useState(false);
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <Link
          to="/"
          className="font-display text-3xl tracking-tight text-charcoal"
        >
          Ukena
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="text-[13px] font-medium tracking-wide text-charcoal/80 transition-colors hover:text-clay"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="grid h-10 w-10 place-items-center rounded-md text-charcoal md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="space-y-5 border-t border-border/60 bg-warm-white px-6 py-6 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.to}
              onClick={() => setOpen(false)}
              className="block text-base text-charcoal hover:text-clay"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
