/**
 * Canonical helper for "is this creator suspended?".
 *
 * The backend uses two parallel signals depending on the endpoint:
 *   - `deletedAt` (timestamp) — set by the admin suspend endpoint
 *   - `status` ("SUSPENDED" / "ACTIVE") — used on some list responses
 *
 * Every UI surface that decides whether to show / hide / banner a creator
 * MUST route through this helper so the rules stay in one place.
 */
export interface CreatorStatusLike {
  deletedAt?: string | null;
  status?: string | null;
  suspended?: boolean | null;
}

export function isCreatorSuspended(c: CreatorStatusLike | null | undefined): boolean {
  if (!c) return false;
  if (c.suspended === true) return true;
  if (c.deletedAt != null) return true;
  if (typeof c.status === "string" && c.status.toUpperCase() === "SUSPENDED") return true;
  return false;
}
