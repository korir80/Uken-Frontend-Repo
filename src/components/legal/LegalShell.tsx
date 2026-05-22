import { Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import { ArrowUp, ChevronRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

interface LegalShellProps {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  lastUpdated: string;
  toc?: { id: string; label: string }[];
  children: ReactNode;
}

export function LegalShell({
  eyebrow = "Legal",
  title,
  intro,
  lastUpdated,
  toc,
  children,
}: LegalShellProps) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-cream via-warm-white to-sand-soft/40">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-terracotta/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[12px] uppercase tracking-[0.18em] text-ink-muted"
          >
            <Link to="/" className="hover:text-terracotta">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-charcoal">{title}</span>
          </nav>
          <div className="mt-5">
            <SectionLabel tone="terracotta">{eyebrow}</SectionLabel>
          </div>
          <h1 className="mt-3 font-display text-[36px] leading-[1.05] tracking-tight text-charcoal md:text-[58px]">
            {title}
          </h1>
          {intro && (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-[17px]">
              {intro}
            </p>
          )}
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-warm-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-ink-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
            Last updated · {lastUpdated}
          </p>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <div className="grid gap-10 md:grid-cols-[220px_1fr] md:gap-12">
          {/* TOC */}
          {toc && toc.length > 0 && (
            <aside className="hidden md:block">
              <div className="sticky top-24">
                <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                  On this page
                </p>
                <ol className="mt-4 space-y-2 border-l border-border pl-4 text-[13.5px] leading-relaxed text-ink-muted">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block transition-colors hover:text-terracotta"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          )}

          {/* Content card */}
          <article className="rounded-2xl border border-border/60 bg-warm-white/80 p-6 shadow-soft backdrop-blur md:p-10">
            <div className="legal-prose">{children}</div>

            <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-[13.5px] text-ink-muted sm:flex-row sm:items-center">
              <p>
                Questions? Call{" "}
                <a href="tel:+447425241649" className="text-terracotta hover:underline">
                  +44 7425 241649
                </a>{" "}
                (UK) or{" "}
                <a href="tel:+254720848695" className="text-terracotta hover:underline">
                  +254 720 848 695
                </a>{" "}
                (Kenya).
              </p>
              <div className="flex gap-3">
                <Link
                  to="/privacy"
                  className="rounded-full border border-border bg-warm-white px-3 py-1.5 text-[12px] hover:border-terracotta hover:text-terracotta"
                >
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  className="rounded-full border border-border bg-warm-white px-3 py-1.5 text-[12px] hover:border-terracotta hover:text-terracotta"
                >
                  Terms
                </Link>
                <Link
                  to="/refunds"
                  className="rounded-full border border-border bg-warm-white px-3 py-1.5 text-[12px] hover:border-terracotta hover:text-terracotta"
                >
                  Refunds
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-warm-white text-charcoal shadow-lift transition-all hover:border-terracotta hover:text-terracotta ${
          showTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>

      <Footer />
    </div>
  );
}

/* Shared prose primitives — anchor-aware */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 first:mt-0 mt-12">
      <h2 className="font-display text-[24px] leading-tight text-charcoal md:text-[30px]">
        <a href={`#${id}`} className="group inline-flex items-baseline gap-2">
          {title}
          <span className="text-[14px] text-terracotta opacity-0 transition-opacity group-hover:opacity-100">
            #
          </span>
        </a>
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 font-display text-[18px] leading-tight text-charcoal md:text-[20px]">
      {children}
    </h3>
  );
}
export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
      {children}
    </p>
  );
}
export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-muted marker:text-terracotta md:text-[16px]">
      {children}
    </ul>
  );
}
