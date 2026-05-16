import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, LogOut, ChevronDown } from "lucide-react";
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

type NavTo =
  | "/shop"
  | "/explore"
  | "/about"
  | "/story"
  | "/sustainability"
  | "/contact"
  | "/join"
  | "/orders/track";

type NavItem =
  | { kind: "link"; label: string; to: NavTo }
  | { kind: "group"; label: string; items: { label: string; to: NavTo; hint?: string }[] };

const navItems: NavItem[] = [
  { kind: "link", label: "Shop", to: "/shop" },
  {
    kind: "group",
    label: "About",
    items: [
      { label: "About UKEN", to: "/about", hint: "Who we are & what we do" },
      { label: "Our mission", to: "/story", hint: "Why this exists" },
      { label: "Values", to: "/sustainability", hint: "How we trade" },
      { label: "Contact", to: "/contact", hint: "Talk to the team" },
    ],
  },
  {
    kind: "group",
    label: "Community",
    items: [
      { label: "Explore creators", to: "/explore", hint: "Meet the makers" },
      { label: "Join UKEN", to: "/join", hint: "Apply as a creator" },
    ],
  },
  { kind: "link", label: "Track order", to: "/orders/track" },
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

        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {navItems.map((item) => {
            const linkCls = cn(
              "text-[13px] font-medium tracking-wide transition-colors lg:text-[14px]",
              scrolled
                ? "text-charcoal/80 hover:text-clay"
                : "text-warm-white/85 hover:text-warm-white",
            );

            if (item.kind === "link") {
              return (
                <Link key={item.label} to={item.to} className={linkCls}>
                  {item.label}
                </Link>
              );
            }

            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger
                  className={cn(linkCls, "inline-flex items-center gap-1 outline-none")}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" strokeWidth={2} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={10} className="w-60 p-1">
                  {item.items.map((sub) => (
                    <DropdownMenuItem key={sub.to} asChild className="cursor-pointer">
                      <Link to={sub.to} className="flex flex-col items-start gap-0.5 px-3 py-2">
                        <span className="text-[13px] font-medium text-charcoal">{sub.label}</span>
                        {sub.hint && (
                          <span className="text-[11px] text-ink-muted">{sub.hint}</span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
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
