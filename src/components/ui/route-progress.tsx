import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/**
 * RouteProgress — slim editorial loading bar that animates across the top of
 * the viewport while TanStack Router is transitioning between pages. Uses the
 * brand terracotta → gold gradient and a subtle indeterminate sweep so the
 * wait between routes feels intentional, not janky.
 *
 * Pairs with the LazyImage shimmer: this handles route-level pending state,
 * LazyImage handles per-image network deferral.
 */
export function RouteProgress() {
  const isLoading = useRouterState({
    select: (s) => s.isLoading || s.isTransitioning,
  });

  // Keep the bar visible briefly after load so quick transitions still register.
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let doneTimer: ReturnType<typeof setTimeout> | undefined;

    if (isLoading) {
      setDone(false);
      setVisible(true);
    } else if (visible) {
      // Snap to "complete" then fade.
      setDone(true);
      doneTimer = setTimeout(() => {
        setVisible(false);
        setDone(false);
      }, 320);
    }

    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      if (doneTimer) clearTimeout(doneTimer);
    };
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px]"
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden bg-charcoal/[0.06] transition-opacity duration-300",
          done ? "opacity-0" : "opacity-100",
        )}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 bg-[linear-gradient(90deg,transparent,oklch(0.62_0.16_38),oklch(0.78_0.13_75),transparent)]",
            done
              ? "w-full transition-[width] duration-300 ease-out"
              : "w-2/5 animate-[ukena-route-sweep_1.1s_ease-in-out_infinite]",
          )}
        />
      </div>

      <style>{`
        @keyframes ukena-route-sweep {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(120%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </div>
  );
}
