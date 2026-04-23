import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/**
 * UkenaPageLoader — full-bleed brand splash that covers the screen on the
 * very first visit and during route transitions. Replaces the previous slim
 * top-bar so navigation from / → /explore → /shop feels intentional and
 * cinematic, on-brand with the editorial typography.
 *
 * Behaviour:
 * - First visit: shows for ~700ms minimum so the brand mark lands.
 * - Subsequent route changes: shows while TanStack Router is loading or
 *   transitioning, with a min-visible window of 320ms to avoid flicker.
 * - Pairs with the LazyImage shimmer (per-image deferral).
 */
export function RouteProgress() {
  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });

  // First-paint splash — independent of router state.
  const [firstPaintDone, setFirstPaintDone] = useState(false);
  // Whether the overlay should currently be visible.
  const [visible, setVisible] = useState(true);
  // Drives the fade-out class.
  const [closing, setClosing] = useState(false);
  const shownAtRef = useRef<number>(typeof performance !== "undefined" ? performance.now() : Date.now());

  // Hide the initial splash after the brand has had time to register.
  useEffect(() => {
    const FIRST_PAINT_MS = 700;
    const t = setTimeout(() => setFirstPaintDone(true), FIRST_PAINT_MS);
    return () => clearTimeout(t);
  }, []);

  // React to router transitions after the first paint has settled.
  useEffect(() => {
    if (!firstPaintDone) return;

    const MIN_VISIBLE_MS = 320;

    if (isLoading) {
      shownAtRef.current = performance.now();
      setClosing(false);
      setVisible(true);
      return;
    }

    if (visible) {
      const elapsed = performance.now() - shownAtRef.current;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      const fadeT = setTimeout(() => setClosing(true), wait);
      const hideT = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, wait + 380);
      return () => {
        clearTimeout(fadeT);
        clearTimeout(hideT);
      };
    }
  }, [isLoading, firstPaintDone, visible]);

  // After first paint finishes, if router isn't loading, fade out.
  useEffect(() => {
    if (!firstPaintDone) return;
    if (isLoading) return;
    if (!visible) return;
    const fadeT = setTimeout(() => setClosing(true), 0);
    const hideT = setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 380);
    return () => {
      clearTimeout(fadeT);
      clearTimeout(hideT);
    };
    // We only want this to re-run when firstPaintDone flips true.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPaintDone]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-warm-white",
        "transition-opacity duration-[380ms] ease-out",
        closing ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      {/* Subtle warm wash so it doesn't feel like a flat white screen */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,oklch(0.96_0.012_78)_0%,oklch(0.93_0.018_70)_55%,oklch(0.88_0.022_60)_100%)]"
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Wordmark with a soft breathing animation */}
        <div className="overflow-hidden">
          <span className="block font-display text-4xl tracking-tight text-charcoal animate-[ukena-rise_700ms_ease-out_both] md:text-5xl">
            Ukena
          </span>
        </div>

        {/* Hairline progress arc — terracotta → gold */}
        <div className="relative h-px w-32 overflow-hidden bg-charcoal/[0.08]">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,oklch(0.62_0.16_38),oklch(0.78_0.13_75),transparent)] animate-[ukena-loader-sweep_1.2s_ease-in-out_infinite]" />
        </div>

        <span className="text-[10px] uppercase tracking-[0.32em] text-charcoal/55">
          A moment, please
        </span>
      </div>

      <style>{`
        @keyframes ukena-rise {
          0%   { transform: translateY(110%); opacity: 0; }
          100% { transform: translateY(0%);   opacity: 1; }
        }
        @keyframes ukena-loader-sweep {
          0%   { transform: translateX(-110%); }
          50%  { transform: translateX(140%); }
          100% { transform: translateX(280%); }
        }
      `}</style>
    </div>
  );
}
