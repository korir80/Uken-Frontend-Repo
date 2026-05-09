/**
 * Admin service — backed by /api/admin/*.
 */
import { api } from "./api";
import type {
  CreatorPayout,
  ProductReview,
  FeaturedSlot,
} from "@/components/admin/admin-data";

export type {
  CreatorPayout,
  ProductReview,
  FeaturedSlot,
} from "@/components/admin/admin-data";

export interface AdminBuyerRow {
  id: string;
  fullName: string;
  email: string;
  city?: string;
  orderCount?: number;
  totalPence?: number;
  lastOrderAt?: string;
  suspended: boolean;
}

export type ProductModerationStatus = "LIVE" | "DRAFT" | "TAKEN_DOWN";

export interface ProductModerationRow {
  productId: string;
  status: ProductModerationStatus;
}

export type ReviewStatusUpdate = { status: ProductReview["status"] };

export const adminService = {
  async listPayouts(): Promise<CreatorPayout[]> {
    return api.get<CreatorPayout[]>("/admin/payouts");
  },
  async payCreator(creatorId: string): Promise<CreatorPayout> {
    return api.post<CreatorPayout>(
      `/admin/payouts/${encodeURIComponent(creatorId)}/pay`,
      {},
    );
  },
  async runPayoutCycle(): Promise<CreatorPayout[]> {
    return api.post<CreatorPayout[]>("/admin/payouts/run", {});
  },
  async listReviews(): Promise<ProductReview[]> {
    return api.get<ProductReview[]>("/admin/reviews");
  },
  async updateReviewStatus(
    id: string,
    payload: ReviewStatusUpdate,
  ): Promise<ProductReview> {
    return api.patch<ProductReview>(
      `/admin/reviews/${encodeURIComponent(id)}/status`,
      payload,
    );
  },
  async getFeatured(): Promise<FeaturedSlot[]> {
    return api.get<FeaturedSlot[]>("/admin/featured");
  },
  async setFeatured(slots: FeaturedSlot[]): Promise<FeaturedSlot[]> {
    return api.put<FeaturedSlot[]>("/admin/featured", slots);
  },
  async listBuyers(): Promise<AdminBuyerRow[]> {
    return api.get<AdminBuyerRow[]>("/admin/buyers");
  },
  async suspendBuyer(buyerId: string): Promise<void> {
    await api.patch<void>(
      `/admin/buyers/${encodeURIComponent(buyerId)}/suspend`,
      {},
    );
  },
  async unsuspendBuyer(buyerId: string): Promise<void> {
    await api.patch<void>(
      `/admin/buyers/${encodeURIComponent(buyerId)}/unsuspend`,
      {},
    );
  },
  async suspendCreator(creatorId: string): Promise<void> {
    await api.patch<void>(
      `/admin/creators/${encodeURIComponent(creatorId)}/suspend`,
      {},
    );
  },
  async listProductStatuses(): Promise<ProductModerationRow[]> {
    return api.get<ProductModerationRow[]>("/admin/products/statuses");
  },
  async setProductStatus(
    productId: string,
    status: ProductModerationStatus,
  ): Promise<ProductModerationRow> {
    return api.patch<ProductModerationRow>(
      `/admin/products/${encodeURIComponent(productId)}/status`,
      { status },
    );
  },
};
