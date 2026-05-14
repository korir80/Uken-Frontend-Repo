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
  { label: "Mission", to: "/story" as const },
  { label: "Values", to: "/sustainability" as const },
  { label: "Contact", to: "/contact" as const },
  { label: "Join UKEN", to: "/join" as const },
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
        <Link to="/" aria-label="UKEN home" className="inline-flex items-center">
          <Logo className="h-9 md:h-10" />
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              activeProps={{ className: "text-clay" }}
              className="text-[13px] font-medium tracking-wide text-charcoal/80 transition-colors hover:text-clay lg:text-[14px]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <Link
            to="/search"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full text-charcoal/70 transition-colors hover:bg-cream hover:text-clay"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </Link>
          <ExploreAuthItem />
          <BagIndicator tone="light" />
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

function ExploreAuthItem() {
  const { isAuthenticated, isLoading, role, user, logout } = useAuth();
  if (isLoading) return null;

  if (!isAuthenticated || !role || !user) {
    return (
      <Link
        to="/signin"
        className="rounded-full px-3.5 py-1.5 font-sans text-[12px] font-medium text-charcoal/80 transition-colors hover:bg-cream hover:text-clay"
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
        className="grid h-9 w-9 place-items-center rounded-full bg-clay font-sans text-[11px] font-semibold tracking-wide text-warm-white transition-colors outline-none hover:bg-clay-deep"
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
