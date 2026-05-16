import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Home,
  ShoppingBag,
  Compass,
  Bookmark,
  User,
  BookOpen,
  HeartHandshake,
  Mail,
  Menu,
  X,
  Sparkles,
  LogIn,
  PackageSearch,
  Info,
} from "lucide-react";
import { useAuth, defaultPathForRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * MobileNavFab — primary navigation on <768px.
 *
  * A floating circular trigger anchored bottom-right. On tap the five primary
  * destinations (Home / Shop / Explore / Saved / Account) emanate vertically
  * above the trigger. Hidden ≥md, where the top horizontal navigation handles
  * wayfinding instead.
 *
 * No hamburger drawer, no bottom tab bar — just the trigger + radial menu.
 */
const baseItems = [
  { label: "Home",    to: "/" as const,        icon: Home },
  { label: "Shop",    to: "/shop" as const,    icon: ShoppingBag },
  { label: "Explore", to: "/explore" as const, icon: Compass },
  { label: "About",   to: "/about" as const,   icon: Info },
  { label: "Mission", to: "/story" as const,   icon: BookOpen },
  { label: "Values",  to: "/sustainability" as const, icon: HeartHandshake },
  { label: "Contact", to: "/contact" as const, icon: Mail },
  { label: "Join UKEN", to: "/join" as const,  icon: Sparkles },
  { label: "Saved",   to: "/saved" as const,   icon: Bookmark },
  { label: "Track order", to: "/orders/track" as const, icon: PackageSearch },
] as const;

export function MobileNavFab() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  const items = [
    ...baseItems,
    isAuthenticated && role
      ? { label: "Account", to: defaultPathForRole(role) as "/account", icon: User }
      : { label: "Sign in", to: "/signin" as const, icon: LogIn },
  ];

  // Close when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside tap / Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const node = containerRef.current;
      if (node && !node.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-[60] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Backdrop — soft scrim only when open */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 -z-10 bg-charcoal/30 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Vertical items — emanate upward from the FAB */}
      <ul className="absolute bottom-0 right-0">
        {items.map((item, i) => {
          const total = items.length;
          const y = -50 * (i + 1);
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);

          const Icon = item.icon;

          return (
            <li
              key={item.label}
              className="absolute bottom-0 right-0"
              style={{
                transform: open
                  ? `translate(0px, ${y}px)`
                  : "translate(0px, 0px)",
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
                transition: `transform 380ms cubic-bezier(0.22, 1, 0.36, 1) ${
                  open ? i * 40 : (total - 1 - i) * 25
                }ms, opacity 240ms ease ${open ? i * 40 : 0}ms`,
              }}
            >
              <Link
                to={item.to}
                aria-label={item.label}
                className={cn(
                  "group flex h-11 w-11 items-center justify-center rounded-full shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-colors",
                  isActive
                    ? "bg-clay text-warm-white"
                    : "bg-warm-white text-charcoal hover:bg-cream",
                )}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                <span
                  className={cn(
                    "pointer-events-none absolute right-[52px] whitespace-nowrap rounded-full bg-charcoal/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-warm-white transition-opacity duration-200",
                    open ? "opacity-100" : "opacity-0",
                  )}
                  style={{ transitionDelay: open ? `${200 + i * 40}ms` : "0ms" }}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Trigger */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative grid h-[52px] w-[52px] place-items-center rounded-full shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] transition-all duration-300",
          open
            ? "rotate-90 bg-charcoal text-warm-white"
            : "bg-clay text-warm-white hover:bg-clay-deep",
        )}
      >
        {open ? (
          <X className="h-5 w-5" strokeWidth={2} />
        ) : (
          <Menu className="h-5 w-5" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
