/**
 * Returns a safe image URL, or undefined if the URL is missing,
 * a stale `blob:` URL (which won't resolve outside the original tab),
 * or otherwise unusable.
 */
export function safeImg(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("blob:")) return undefined;
  return trimmed;
}

/** Default onError handler — hides broken images without throwing. */
export function hideBrokenImage(e: React.SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget;
  if (el.dataset.fallback === "applied") return;
  el.dataset.fallback = "applied";
  el.style.visibility = "hidden";
}
