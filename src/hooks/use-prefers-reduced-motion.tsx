import { useEffect, useState } from "react";

/**
 * Returns true when the user prefers reduced motion OR when the viewport is
 * narrower than the mobile breakpoint. Used to disable Framer scroll reveals
 * on small/mid-range devices where they cause jank.
 */
const MOBILE_BREAKPOINT = 768;

export function useReducedMotionOrMobile(): boolean {
  const [should, setShould] = useState(false);

  useEffect(() => {
    const mqlMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqlSize = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setShould(mqlMotion.matches || mqlSize.matches);
    update();
    mqlMotion.addEventListener("change", update);
    mqlSize.addEventListener("change", update);
    return () => {
      mqlMotion.removeEventListener("change", update);
      mqlSize.removeEventListener("change", update);
    };
  }, []);

  return should;
}
