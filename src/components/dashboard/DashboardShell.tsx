import { Link, useLocation } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  /** "creator" or "admin" — chooses sidebar links + accent. */
  variant: "creator" | "admin";
  /** Sidebar nav links. */
  links: { to: string; label: string; description?: string }[];
  children: ReactNode;
}

/**
 * Shared chrome for the creator and admin dashboards.
 *
 * - Sidebar on desktop (≥md), top scroll bar on mobile.
 * - Wordmark links home; sign-out lives in the footer.
 * - Visual tone is editorial — same warm palette as the marketing site,
 *   never SaaS-grey.
 */
export function DashboardShell({ variant, links, children }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const eyebrow = variant === "admin" ? "Admin Studio" : "Maker Studio";

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <div className="mx-auto flex max-w-[1400px] flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="md:sticky md:top-0 md:h-screen md:w-64 md:flex-shrink-0 md:border-r md:border-border/60 md:bg-cream/40">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-5 md:block md:border-b-0 md:py-7">
            <Link to="/" className="font-display text-2xl text-charcoal">
              Ukena
            </Link>
            <p className="hidden font-sans text-[11px] uppercase tracking-[0.24em] text-clay md:mt-2 md:block">
              {eyebrow}
            </p>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-4 py-3 md:flex-col md:gap-1 md:px-4 md:py-5">
            {links.map((link) => {
              const active =
                location.pathname === link.to ||
                location.pathname.startsWith(link.to + "/");
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex-shrink-0 whitespace-nowrap rounded-lg px-4 py-2.5 font-sans text-[13px] font-medium transition-colors md:whitespace-normal",
                    active
                      ? "bg-clay text-warm-white"
                      : "text-charcoal/70 hover:bg-sand-soft/50 hover:text-charcoal",
                  )}
                >
                  <span>{link.label}</span>
                  {link.description && (
                    <span
                      className={cn(
                        "mt-0.5 hidden text-[11px] font-normal md:block",
                        active ? "text-warm-white/75" : "text-charcoal/50",
                      )}
                    >
                      {link.description}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden border-t border-border/60 px-6 py-5 md:block">
            {user && (
              <>
                <p className="font-sans text-[12px] text-charcoal/60">
                  Signed in as
                </p>
                <p className="mt-1 font-display text-base text-charcoal">
                  {user.fullName}
                </p>
                <p className="font-sans text-[11px] text-charcoal/50">
                  {user.email}
                </p>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="mt-4 font-sans text-[12px] text-clay underline-offset-2 hover:underline"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-5 py-8 md:px-10 md:py-12">{children}</main>
      </div>
    </div>
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
        <h1 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
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
