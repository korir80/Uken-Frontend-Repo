import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "ukena_cookie_consent_v1";

type Choice = "accepted" | "essential";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) {
        // small delay so it doesn't compete with hero animations
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice, at: new Date().toISOString() }),
      );
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300 sm:inset-x-4 sm:bottom-4"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-warm-white/95 p-4 shadow-hero backdrop-blur-md sm:p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-terracotta/10 blur-2xl"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1 text-[13.5px] leading-relaxed text-ink-muted sm:text-[14px]">
            <p>
              <span className="font-medium text-charcoal">We use a few cookies.</span>{" "}
              Essential ones keep your bag and account working; optional ones help us
              understand which makers you love. See our{" "}
              <Link
                to="/privacy"
                className="text-terracotta underline decoration-terracotta/40 underline-offset-2 hover:decoration-terracotta"
              >
                Privacy Notice
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => decide("essential")}
              className="rounded-full border border-border bg-warm-white px-4 py-2 text-[13px] font-medium text-charcoal transition-colors hover:border-charcoal/40"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => decide("accepted")}
              className="rounded-full bg-terracotta px-4 py-2 text-[13px] font-medium text-warm-white shadow-soft transition-colors hover:bg-clay"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => decide("essential")}
              aria-label="Dismiss"
              className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-cream hover:text-charcoal sm:flex"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
