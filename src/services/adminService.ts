/**
 * Admin service — moderation, payouts, curation, content, buyers.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Admin):
 *   GET   /api/admin/buyers                      → AdminBuyerRow[]
 *   PATCH /api/admin/buyers/{id}/suspend         → 204
 *   GET   /api/admin/payouts                     → CreatorPayout[]
 *   POST  /api/admin/payouts/{creatorId}/pay     → CreatorPayout
 *   POST  /api/admin/payouts/run                 → CreatorPayout[]
 *   GET   /api/admin/reviews                     → ProductReview[]
 *   PATCH /api/admin/reviews/{id}/status         → ProductReview
 *   GET   /api/admin/featured                    → FeaturedSlot[]
 *   PUT   /api/admin/featured                    → FeaturedSlot[]
 *   PATCH /api/admin/products/{id}/status        → { id, status }
 *   PATCH /api/admin/creators/{id}/suspend       → 204
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
import { orderService, type OrderDto } from "./orderService";

export type {
  CreatorPayout,
  ProductReview,
  FeaturedSlot,
} from "@/components/admin/admin-data";

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

export type ProductModerationStatus = "LIVE" | "DRAFT" | "TAKEN_DOWN";

export interface ProductModerationRow {
  productId: string;
  status: ProductModerationStatus;
}

export type ReviewStatusUpdate = { status: ProductReview["status"] };

/* ─── In-memory stores (mock branch only) ─── */

const mockProductStatus: Record<string, ProductModerationStatus> = {};
const mockSuspendedCreators = new Set<string>();
const mockSuspendedBuyers = new Set<string>();

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
    const res = await api.post<CreatorPayout>(
      `/admin/payouts/${encodeURIComponent(creatorId)}/pay`,
      {},
    );
    return res.data;
  },

  async runPayoutCycle(): Promise<CreatorPayout[]> {
    if (USE_MOCK_API) {
      seedPayouts.forEach((p) => {
        p.paidThisMonthPence += p.pendingPence;
        p.totalLifetimePence += p.pendingPence;
        p.pendingPence = 0;
        p.lastPaidAt = new Date().toISOString();
      });
      return fakeResolve(seedPayouts);
    }
    const res = await api.post<CreatorPayout[]>("/admin/payouts/run", {});
    return res.data;
  },

  /* ---------------- Reviews / content ---------------- */
  async listReviews(): Promise<ProductReview[]> {
    if (USE_MOCK_API) return fakeResolve(seedReviews);
    const res = await api.get<ProductReview[]>("/admin/reviews");
    return res.data;
  },

  async updateReviewStatus(
    id: string,
    payload: ReviewStatusUpdate,
  ): Promise<ProductReview> {
    if (USE_MOCK_API) {
      const r = seedReviews.find((x) => x.id === id);
      if (!r) throw new Error(`Review not found: ${id}`);
      r.status = payload.status;
      return fakeResolve(r);
    }
    const res = await api.patch<ProductReview>(
      `/admin/reviews/${encodeURIComponent(id)}/status`,
      payload,
    );
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
      // Replace contents in-place so other consumers see the update.
      seedFeatured.length = 0;
      seedFeatured.push(...slots);
      return fakeResolve(seedFeatured);
    }
    const res = await api.put<FeaturedSlot[]>("/admin/featured", slots);
    return res.data;
  },

  /* ---------------- Buyers (derived from orders in mock) ---------------- */
  async listBuyers(): Promise<AdminBuyerRow[]> {
    if (USE_MOCK_API) {
      const orders: OrderDto[] = await orderService.getAllOrders();
      const byEmail = new Map<string, AdminBuyerRow>();
      for (const o of orders) {
        const key = o.buyer.email.toLowerCase();
        const prev = byEmail.get(key);
        const row: AdminBuyerRow = prev ?? {
          id: key,
          fullName: o.buyer.fullName,
          email: o.buyer.email,
          city: o.delivery.city,
          orderCount: 0,
          totalPence: 0,
          lastOrderAt: o.createdAt,
          suspended: mockSuspendedBuyers.has(key),
        };
        row.orderCount += 1;
        row.totalPence += o.totalPence;
        if (new Date(o.createdAt) > new Date(row.lastOrderAt))
          row.lastOrderAt = o.createdAt;
        byEmail.set(key, row);
      }
      return [...byEmail.values()].sort((a, b) => b.totalPence - a.totalPence);
    }
    const res = await api.get<AdminBuyerRow[]>("/admin/buyers");
    return res.data;
  },

  async suspendBuyer(buyerId: string): Promise<void> {
    if (USE_MOCK_API) {
      mockSuspendedBuyers.add(buyerId);
      return fakeResolve(undefined);
    }
    await api.patch<void>(
      `/admin/buyers/${encodeURIComponent(buyerId)}/suspend`,
      {},
    );
  },

  /* ---------------- Creators (admin) ---------------- */
  async suspendCreator(creatorId: string): Promise<void> {
    if (USE_MOCK_API) {
      mockSuspendedCreators.add(creatorId);
      return fakeResolve(undefined);
    }
    await api.patch<void>(
      `/admin/creators/${encodeURIComponent(creatorId)}/suspend`,
      {},
    );
  },

  /* ---------------- Products (admin moderation) ---------------- */
  async listProductStatuses(): Promise<ProductModerationRow[]> {
    if (USE_MOCK_API) {
      const rows: ProductModerationRow[] = Object.entries(mockProductStatus).map(
        ([productId, status]) => ({ productId, status }),
      );
      return fakeResolve(rows);
    }
    const res = await api.get<ProductModerationRow[]>(
      "/admin/products/statuses",
    );
    return res.data;
  },

  async setProductStatus(
    productId: string,
    status: ProductModerationStatus,
  ): Promise<ProductModerationRow> {
    if (USE_MOCK_API) {
      mockProductStatus[productId] = status;
      return fakeResolve({ productId, status });
    }
    const res = await api.patch<ProductModerationRow>(
      `/admin/products/${encodeURIComponent(productId)}/status`,
      { status },
    );
    return res.data;
  },
};
