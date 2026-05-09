/**
 * Admin moderation types only — no seed data.
 *
 * All admin data must come from the backend (`/api/admin/*`). This module
 * keeps the type contracts so existing imports continue to compile.
 */

export type ApplicationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export interface ArtisanApplication {
  id: string;
  fullName: string;
  email: string;
  region: string;
  craft: string;
  yearsOfPractice: number;
  story: string;
  submittedAt: string;
  status: ApplicationStatus;
  portrait: string;
  workSample: string;
}

export interface CreatorPayout {
  creatorId: string;
  fullName: string;
  region: string;
  craft: string;
  pendingPence: number;
  paidThisMonthPence: number;
  lastPaidAt: string;
  totalLifetimePence: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  rating: number;
  body: string;
  submittedAt: string;
  status: "PUBLISHED" | "PENDING" | "FLAGGED" | "REMOVED";
}

export interface FeaturedSlot {
  position: number;
  creatorId: string | null;
  productId: string | null;
}

/** Empty arrays — present only so legacy imports compile. */
export const applications: ArtisanApplication[] = [];
export const payouts: CreatorPayout[] = [];
export const reviews: ProductReview[] = [];
export const featuredSlots: FeaturedSlot[] = [];
