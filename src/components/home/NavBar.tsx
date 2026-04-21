import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ukena";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Explore Creators", to: "/creators" },
  { label: "Our Story", to: "/story" },
  { label: "For Artisans", to: "/artisans" },
] as const;

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-warm-white/85 backdrop-blur-md border-b border-border/60"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <Link
          to="/"
          className={cn(
            "font-display text-3xl tracking-tight transition-colors",
            scrolled ? "text-charcoal" : "text-warm-white",
          )}
        >
          Ukena
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className={cn(
                "text-[13px] font-medium tracking-wide transition-colors",
                scrolled
                  ? "text-charcoal/80 hover:text-clay"
                  : "text-warm-white/85 hover:text-warm-white",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            variant="primary"
            size="sm"
            className="bg-terracotta hover:bg-[oklch(0.52_0.13_38)]"
          >
            Start Exploring
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "md:hidden grid h-10 w-10 place-items-center rounded-md transition-colors",
            scrolled ? "text-charcoal" : "text-warm-white",
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-warm-white px-6 py-6 space-y-5">
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
          <Button
            variant="primary"
            size="md"
            className="w-full bg-terracotta hover:bg-[oklch(0.52_0.13_38)]"
          >
            Start Exploring
          </Button>
        </div>
      )}
    </header>
  );
}
