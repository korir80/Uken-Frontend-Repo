import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { BagIndicator } from "@/components/product/BagIndicator";
import { Logo } from "@/components/ukena";
import { useAuth, defaultPathForRole } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Shop", to: "/shop" as const },
  { label: "Explore Creators", to: "/explore" as const },
  { label: "About", to: "/about" as const },
  { label: "Mission", to: "/story" as const },
  { label: "Values", to: "/sustainability" as const },
  { label: "Contact", to: "/contact" as const },
  { label: "Join UKEN", to: "/join" as const },
  { label: "Track order", to: "/orders/track" as const },
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
        <Link to="/" aria-label="UKEN home" className="inline-flex items-center">
          <Logo
            variant={scrolled ? "dark" : "light"}
            className="h-9 md:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={cn(
                "text-[13px] font-medium tracking-wide transition-colors lg:text-[14px]",
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
          <Link
            to="/search"
            aria-label="Search"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full transition-colors",
              scrolled
                ? "text-charcoal/70 hover:bg-cream hover:text-clay"
                : "text-warm-white/85 hover:bg-warm-white/15 hover:text-warm-white",
            )}
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </Link>
          <AuthNavItem scrolled={scrolled} />
          <BagIndicator tone={scrolled ? "light" : "dark"} />
        </div>
      </div>
    </header>
  );
}

function getInitials(name: string | undefined, email: string | undefined): string {
  const src = (name && name.trim()) || email || "";
  if (!src) return "U";
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function AuthNavItem({ scrolled }: { scrolled: boolean }) {
  const { isAuthenticated, isLoading, role, user, logout } = useAuth();
  if (isLoading) return null;

  if (!isAuthenticated || !role || !user) {
    return (
      <Link
        to="/signin"
        className={cn(
          "rounded-full px-3.5 py-1.5 font-sans text-[12px] font-medium transition-colors",
          scrolled
            ? "text-charcoal/80 hover:bg-cream hover:text-clay"
            : "text-warm-white/85 hover:bg-warm-white/15 hover:text-warm-white",
        )}
      >
        Sign in
      </Link>
    );
  }

  const dashPath = defaultPathForRole(role);
  const dashLabel =
    role === "ROLE_ADMIN"
      ? "Admin Studio"
      : role === "ROLE_CREATOR"
        ? "Maker Studio"
        : "Your Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full font-sans text-[11px] font-semibold tracking-wide transition-colors outline-none",
          scrolled
            ? "bg-clay text-warm-white hover:bg-clay-deep"
            : "bg-warm-white/15 text-warm-white ring-1 ring-warm-white/30 hover:bg-warm-white/25",
        )}
      >
        {getInitials(user.fullName, user.email)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link to={dashPath}>{dashLabel}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
