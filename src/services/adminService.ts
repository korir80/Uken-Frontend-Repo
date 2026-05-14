/**
 * Admin service — backed by /api/admin/*.
 */
import { api, unwrapList } from "./api";
import type {
  CreatorPayout,
  ProductReview,
  FeaturedSlot,
} from "@/components/admin/admin-data";
import type { OrderDto } from "./orderService";

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

export type ProductModerationStatus =
  | "ACTIVE"
  | "OUT_OF_STOCK"
  | "SUSPENDED_BY_CREATOR"
  | "SUSPENDED_BY_ADMIN"
  // legacy-compat for any existing imports
  | "LIVE"
  | "DRAFT"
  | "TAKEN_DOWN";

export interface ProductModerationRow {
  productId: string;
  status: ProductModerationStatus;
}

export type ReviewStatusUpdate = { status: ProductReview["status"] };

export interface PayCreatorPayload {
  accountNumber: string;
  accountName: string;
}

export const adminService = {
  async listPayouts(): Promise<CreatorPayout[]> {
    return unwrapList<CreatorPayout>(await api.get<unknown>("/admin/payouts"));
  },
  async payCreator(
    creatorId: string,
    payload: PayCreatorPayload,
  ): Promise<CreatorPayout> {
    return api.post<CreatorPayout>(
      `/admin/payouts/${encodeURIComponent(creatorId)}/pay`,
      payload,
    );
  },
  async listReviews(): Promise<ProductReview[]> {
    return unwrapList<ProductReview>(await api.get<unknown>("/admin/reviews"));
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
    return unwrapList<FeaturedSlot>(await api.get<unknown>("/admin/featured"));
  },
  async setFeatured(slots: FeaturedSlot[]): Promise<FeaturedSlot[]> {
    return api.put<FeaturedSlot[]>("/admin/featured", slots);
  },
  async listBuyers(): Promise<AdminBuyerRow[]> {
    return unwrapList<AdminBuyerRow>(await api.get<unknown>("/admin/buyers"));
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
  async deleteCreator(creatorId: string): Promise<void> {
    await api.delete<void>(`/admin/creators/${encodeURIComponent(creatorId)}`);
  },
  async suspendCreator(creatorId: string): Promise<void> {
    await api.patch<void>(
      `/admin/creators/${encodeURIComponent(creatorId)}/suspend`,
      {},
    );
  },
  async unsuspendCreator(creatorId: string): Promise<void> {
    await api.patch<void>(
      `/admin/creators/${encodeURIComponent(creatorId)}/unsuspend`,
      {},
    );
  },
  async setProductStatus(
    productId: string,
    status: "ACTIVE" | "SUSPENDED_BY_ADMIN",
  ): Promise<void> {
    await api.patch<void>(
      `/admin/products/${encodeURIComponent(productId)}/status`,
      { status },
    );
  },
  async deleteProduct(productId: string): Promise<void> {
    await api.delete<void>(`/admin/products/${encodeURIComponent(productId)}`);
  },
  async listOrders(): Promise<OrderDto[]> {
    const list = unwrapList<any>(await api.get<unknown>("/admin/orders"));
    return list.map((raw) => {
      const displayId = raw.displayId ?? raw.id ?? "";
      return {
        ...raw,
        id: displayId,
        displayId,
        createdAt: raw.createdAt ?? new Date().toISOString(),
        productsTotalPence:
          typeof raw.productsTotalPence === "number"
            ? raw.productsTotalPence
            : Math.max(0, (raw.totalPence ?? 0) - (raw.shippingPence ?? 0)),
        shippingPence: raw.shippingPence ?? 0,
        items: Array.isArray(raw.items) ? raw.items : [],
      } as OrderDto;
    });
  },
  async refundOrder(displayId: string): Promise<void> {
    await api.patch<void>(
      `/admin/orders/${encodeURIComponent(displayId)}/refund`,
      {},
    );
  },
};
