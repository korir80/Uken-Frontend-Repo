/**
 * Buyer mode — the homepage offers two equal entry paths:
 *   - "story": creator-first browsing (/explore)
 *   - "shop":  product-first browsing (/shop)
 *
 * The user's last choice is persisted to localStorage and surfaced as the
 * default highlight on return visits. Both paths remain visible — the mode
 * never hides the alternative, only emphasises it.
 */
import { useCallback, useEffect, useState } from "react";

export type UkenaMode = "story" | "shop";
const STORAGE_KEY = "ukena_mode";

export function readMode(): UkenaMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "story" || raw === "shop" ? raw : null;
  } catch {
    return null;
  }
}

export function writeMode(mode: UkenaMode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore quota/private-mode errors */
  }
}

/**
 * useUkenaMode — returns the persisted mode (or null on SSR / first visit)
 * plus a setter that updates both state and localStorage.
 */
export function useUkenaMode(): {
  mode: UkenaMode | null;
  setMode: (m: UkenaMode) => void;
} {
  const [mode, setModeState] = useState<UkenaMode | null>(null);

  useEffect(() => {
    setModeState(readMode());
  }, []);

  const setMode = useCallback((m: UkenaMode) => {
    setModeState(m);
    writeMode(m);
  }, []);

  return { mode, setMode };
}

/* ──────────────────────────────────────────────────────────────────────
 * Recently viewed products — feeds the personalised home for authed users.
 * Stored as an ordered list (most recent first) capped at 8 items.
 * ────────────────────────────────────────────────────────────────────── */

const RECENT_KEY = "ukena.recent_products";
const RECENT_MAX = 8;

export function readRecentProducts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function pushRecentProduct(productId: string) {
  if (typeof window === "undefined") return;
  try {
    const current = readRecentProducts().filter((id) => id !== productId);
    const next = [productId, ...current].slice(0, RECENT_MAX);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

/* ──────────────────────────────────────────────────────────────────────
 * Saved creators — feeds the personalised home for authed users.
 * ────────────────────────────────────────────────────────────────────── */

const SAVED_KEY = "ukena.saved_creators";

export function readSavedCreators(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
