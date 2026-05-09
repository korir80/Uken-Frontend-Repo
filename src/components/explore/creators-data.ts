/**
 * Creator types + craft taxonomy.
 *
 * The hardcoded `creators` array previously seeded here has been removed —
 * all creator data must come from GET /api/creators. This module now only
 * exports types and the static craft taxonomy used by filter UI.
 */

export type Craft =
  | "Weaving"
  | "Beadwork"
  | "Pottery"
  | "Leatherwork"
  | "Woodcarving"
  | "Beekeeping";

export interface Creator {
  id: string;
  firstName: string;
  fullName: string;
  craft: Craft;
  region: string;
  hook: string;
  image: string;
  emphasis?: "tall" | "standard";
}

export const CRAFTS: readonly Craft[] = [
  "Weaving",
  "Beadwork",
  "Pottery",
  "Leatherwork",
  "Woodcarving",
  "Beekeeping",
] as const;

/** Empty — kept only so legacy imports still compile while consumers migrate to useCreators(). */
export const creators: Creator[] = [];
