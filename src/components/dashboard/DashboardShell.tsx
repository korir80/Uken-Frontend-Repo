import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

async function signOutWithToast(logout: () => Promise<void>) {
  await logout();
  toast.success("Signed out");
}

interface DashboardShellProps {
  /** "creator", "admin", or "buyer" — chooses sidebar links + eyebrow. */
  variant: "creator" | "admin" | "buyer";
  /** Sidebar nav links. */
  links: { to: string; label: string; description?: string }[];
  children: ReactNode;
}

/**
 * Shared chrome for the creator and admin dashboards.
 *
 * Layout
 * - ≥lg (1024px+): persistent sidebar, scrollable independently of main.
 * - <lg: top bar with hamburger that opens a slide-in drawer.
 * - Sign out is always reachable: in the sidebar footer on desktop,
 *   in the top bar + drawer footer on mobile/tablet.
 */
export function DashboardShell({ variant, links, children }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const eyebrow =
    variant === "admin"
      ? "Admin Studio"
      : variant === "creator"
        ? "Maker Studio"
        : "Your Account";

  // Close drawer on route change.
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll while drawer is open (mobile).
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  const navContent = (
    <NavList
      links={links}
      currentPath={location.pathname}
      onNavigate={() => setDrawerOpen(false)}
    />
  );

  const userFooter = user && (
    <div className="border-t border-border/60 px-6 py-5">
      <p className="font-sans text-[12px] text-charcoal/60">Signed in as</p>
      <p className="mt-1 font-display text-base text-charcoal">{user.fullName}</p>
      <p className="truncate font-sans text-[11px] text-charcoal/50">{user.email}</p>
      <button
        type="button"
        onClick={() => {
          setDrawerOpen(false);
          void signOutWithToast(logout);
        }}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-clay/40 px-4 py-2 font-sans text-[12px] font-medium text-clay transition-colors hover:bg-clay hover:text-warm-white"
      >
        <LogoutIcon />
        Sign out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-warm-white/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/70 hover:bg-sand-soft/60 hover:text-charcoal"
          >
            <MenuIcon />
          </button>
          <Link to="/" className="font-display text-xl text-charcoal">
            Ukena
          </Link>
          <span className="hidden font-sans text-[10px] uppercase tracking-[0.22em] text-clay sm:inline">
            {eyebrow}
          </span>
        </div>
        {user && (
          <button
            type="button"
            onClick={() => void signOutWithToast(logout)}
            aria-label="Sign out"
            className="inline-flex items-center gap-1.5 rounded-full border border-clay/40 px-3 py-1.5 font-sans text-[12px] font-medium text-clay hover:bg-clay hover:text-warm-white"
          >
            <LogoutIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        )}
      </header>

      <div className="mx-auto flex max-w-[1400px] lg:flex-row">
        {/* Desktop sidebar — sticky column, internally scrollable */}
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-shrink-0 lg:flex-col lg:border-r lg:border-border/60 lg:bg-cream/40">
          <div className="flex-shrink-0 px-6 py-7">
            <Link to="/" className="font-display text-2xl text-charcoal">
              Ukena
            </Link>
            <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.24em] text-clay">
              {eyebrow}
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pb-4">{navContent}</nav>

          <div className="flex-shrink-0">{userFooter}</div>
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm lg:hidden"
            />
            <aside
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-sm flex-col border-r border-border/60 bg-warm-white shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex flex-shrink-0 items-center justify-between border-b border-border/60 px-6 py-5">
                <div>
                  <Link
                    to="/"
                    className="font-display text-2xl text-charcoal"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Ukena
                  </Link>
                  <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.24em] text-clay">
                    {eyebrow}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-charcoal/70 hover:bg-sand-soft/60 hover:text-charcoal"
                >
                  <CloseIcon />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4">{navContent}</nav>

              <div className="flex-shrink-0">{userFooter}</div>
            </aside>
          </>
        )}

        {/* Main — independently scrollable */}
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-7 md:px-10 md:py-12">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavList({
  links,
  currentPath,
  onNavigate,
}: {
  links: { to: string; label: string; description?: string }[];
  currentPath: string;
  onNavigate: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {links.map((link) => {
        const active =
          currentPath === link.to || currentPath.startsWith(link.to + "/");
        return (
          <li key={link.to}>
            <Link
              to={link.to}
              onClick={onNavigate}
              className={cn(
                "block rounded-lg px-4 py-2.5 font-sans text-[13px] font-medium transition-colors",
                active
                  ? "bg-clay text-warm-white"
                  : "text-charcoal/70 hover:bg-sand-soft/50 hover:text-charcoal",
              )}
            >
              <span>{link.label}</span>
              {link.description && (
                <span
                  className={cn(
                    "mt-0.5 block text-[11px] font-normal",
                    active ? "text-warm-white/75" : "text-charcoal/50",
                  )}
                >
                  {link.description}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}

/* ---------- Small primitives reused across dashboard pages ---------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/60 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="section-label">{eyebrow}</p>
        <h1 className="mt-3 font-display text-2xl leading-tight text-charcoal sm:text-3xl md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl font-sans text-sm text-charcoal/70">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-cream/50 p-5">
      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl text-charcoal">{value}</p>
      {hint && (
        <p className="mt-1 font-sans text-[12px] text-charcoal/55">{hint}</p>
      )}
    </div>
  );
}

export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "good" | "warn" | "bad" | "info";
}) {
  const styles: Record<string, string> = {
    neutral: "bg-sand-soft/60 text-charcoal/70",
    good: "bg-gold-soft/60 text-charcoal",
    warn: "bg-terracotta-soft/60 text-charcoal",
    bad: "bg-destructive/15 text-destructive",
    info: "bg-clay/15 text-clay-deep",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[11px] font-medium tracking-wide",
        styles[tone],
      )}
    >
      {label}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-cream/30 px-8 py-14 text-center">
      <p className="font-display text-2xl italic text-charcoal/70">{title}</p>
      {body && (
        <p className="mx-auto mt-2 max-w-md font-sans text-sm text-charcoal/60">
          {body}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
