import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BagIndicator } from "@/components/product/BagIndicator";

const navLinks = [
  { label: "Shop", to: "/shop" as const },
  { label: "Explore Creators", to: "/explore" as const },
  { label: "Our Story", to: "/story" as const },
  { label: "Join as Artisan", to: "/join" as const },
];

/**
 * Marketing NavBar for the homepage hero. Mobile nav is handled by the
 * global MobileNavFab — this header just keeps the wordmark + bag visible
 * on small screens and shows the full link set ≥md.
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

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
          ? "bg-warm-white shadow-[0_1px_0_0_var(--border)]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-10 md:py-5">
        <Link
          to="/"
          className={cn(
            "font-display text-2xl tracking-tight transition-colors md:text-3xl",
            scrolled ? "text-charcoal" : "text-warm-white",
          )}
        >
          Ukena
        </Link>

        <nav className="hidden items-center gap-8 md:flex lg:gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={cn(
                "text-[14px] font-medium tracking-wide transition-colors",
                scrolled
                  ? "text-charcoal/80 hover:text-clay"
                  : "text-warm-white/85 hover:text-warm-white",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <DashboardLink scrolled={scrolled} />
          <BagIndicator tone={scrolled ? "light" : "dark"} />
        </div>
      </div>
    </header>
  );
}

function DashboardLink({ scrolled }: { scrolled: boolean }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated || !role || role === "ROLE_BUYER") return null;
  const to = defaultPathForRole(role);
  return (
    <Link
      to={to}
      className={cn(
        "hidden rounded-full px-3.5 py-1.5 font-sans text-[12px] font-medium transition-colors md:inline-flex",
        scrolled
          ? "bg-clay text-warm-white hover:bg-clay-deep"
          : "bg-warm-white/15 text-warm-white ring-1 ring-warm-white/30 hover:bg-warm-white/25",
      )}
    >
      {role === "ROLE_ADMIN" ? "Admin Studio" : "Maker Studio"}
    </Link>
  );
}
