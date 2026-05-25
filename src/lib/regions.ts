/**
 * East African Community countries UKEN sources from.
 * Kenya remains the flagship; other EAC partner states are featured
 * as the network grows.
 */
export const EAC_COUNTRIES = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Burundi",
  "South Sudan",
  "DR Congo",
] as const;

export type EACountry = (typeof EAC_COUNTRIES)[number];

/** Short label used in copy. */
export const REGION_LABEL = "East Africa";
