/**
 * Admin service — moderation, payouts, curation, content.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Admin):
 *   GET   /api/admin/buyers                      → AdminBuyerRow[]
 *   PATCH /api/admin/buyers/{id}/suspend         → 204
 *   GET   /api/admin/payouts                     → CreatorPayout[]
 *   POST  /api/admin/payouts/{creatorId}/pay     → CreatorPayout
 *   GET   /api/admin/reviews                     → ProductReview[]
 *   PATCH /api/admin/reviews/{id}/status         → ProductReview
 *   GET   /api/admin/featured                    → FeaturedSlot[]
 *   PUT   /api/admin/featured                    → FeaturedSlot[]
 */
import { api, fakeResolve, USE_MOCK_API } from "./api";
import {
  payouts as seedPayouts,
  reviews as seedReviews,
  featuredSlots as seedFeatured,
  type CreatorPayout,
  type ProductReview,
  type FeaturedSlot,
} from "@/components/admin/admin-data";

export type { CreatorPayout, ProductReview, FeaturedSlot } from "@/components/admin/admin-data";

export interface AdminBuyerRow {
  id: string;
  fullName: string;
  email: string;
  city: string;
  orderCount: number;
  totalPence: number;
  lastOrderAt: string;
  suspended: boolean;
}

export type ReviewStatusUpdate = {
  status: ProductReview["status"];
};

export const adminService = {
  /* ---------------- Payouts ---------------- */
  async listPayouts(): Promise<CreatorPayout[]> {
    if (USE_MOCK_API) return fakeResolve(seedPayouts);
    const res = await api.get<CreatorPayout[]>("/admin/payouts");
    return res.data;
  },

  async payCreator(creatorId: string): Promise<CreatorPayout> {
    if (USE_MOCK_API) {
      const p = seedPayouts.find((x) => x.creatorId === creatorId);
      if (!p) throw new Error(`Creator not found: ${creatorId}`);
      p.paidThisMonthPence += p.pendingPence;
      p.totalLifetimePence += p.pendingPence;
      p.pendingPence = 0;
      p.lastPaidAt = new Date().toISOString();
      return fakeResolve(p);
    }
    const res = await api.post<CreatorPayout>(`/admin/payouts/${encodeURIComponent(creatorId)}/pay`, {});
    return res.data;
  },

  /* ---------------- Reviews ---------------- */
  async listReviews(): Promise<ProductReview[]> {
    if (USE_MOCK_API) return fakeResolve(seedReviews);
    const res = await api.get<ProductReview[]>("/admin/reviews");
    return res.data;
  },

  async updateReviewStatus(id: string, payload: ReviewStatusUpdate): Promise<ProductReview> {
    if (USE_MOCK_API) {
      const r = seedReviews.find((x) => x.id === id);
      if (!r) throw new Error(`Review not found: ${id}`);
      r.status = payload.status;
      return fakeResolve(r);
    }
    const res = await api.patch<ProductReview>(`/admin/reviews/${encodeURIComponent(id)}/status`, payload);
    return res.data;
  },

  /* ---------------- Featured curation ---------------- */
  async getFeatured(): Promise<FeaturedSlot[]> {
    if (USE_MOCK_API) return fakeResolve(seedFeatured);
    const res = await api.get<FeaturedSlot[]>("/admin/featured");
    return res.data;
  },

  async setFeatured(slots: FeaturedSlot[]): Promise<FeaturedSlot[]> {
    if (USE_MOCK_API) {
      slots.forEach((s, i) => Object.assign(seedFeatured[i] ?? {}, s));
      return fakeResolve(seedFeatured);
    }
    const res = await api.put<FeaturedSlot[]>("/admin/featured", slots);
    return res.data;
  },

  /* ---------------- Buyers ---------------- */
  async listBuyers(): Promise<AdminBuyerRow[]> {
    if (USE_MOCK_API) {
      // Derived from seed orders; the dashboard already builds this view client-side.
      return fakeResolve([]);
    }
    const res = await api.get<AdminBuyerRow[]>("/admin/buyers");
    return res.data;
  },

  async suspendBuyer(buyerId: string): Promise<void> {
    if (USE_MOCK_API) return fakeResolve(undefined);
    await api.patch<void>(`/admin/buyers/${encodeURIComponent(buyerId)}/suspend`, {});
  },
};
