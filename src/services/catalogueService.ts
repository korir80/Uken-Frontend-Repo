/**
 * Catalogue service — Uken-owned products.
 *
 * Public:
 *  GET    /catalogue                         → list
 *
 * Admin:
 *  POST   /admin/catalogue                   → create
 *  PUT    /admin/catalogue/{id}              → update
 *  PATCH  /admin/catalogue/{id}/status       → status
 *  DELETE /admin/catalogue/{id}
 *  POST   /admin/catalogue/{id}/images
 *  DELETE /admin/catalogue/{id}/images/{imageId}
 *
 *  GET    /admin/revenue                     → revenue stats
 */
import { api } from "./api";
import type {
  ProductSummaryDto,
  ProductDto,
  ProductCreatePayload,
  ProductUpdatePayload,
} from "./productService";

export interface RevenueStats {
  totalRevenuePence: number;
  ukenaRevenuePence: number;
  platformCommissionPence: number;
  totalUkenaIncomePence: number;
  creatorPayoutsBalancePence: number;
  totalPaidOrderCount: number;
  ukenaOrderCount: number;
}

export const catalogueService = {
  async list(): Promise<ProductSummaryDto[]> {
    const res = await api.get<any>("/catalogue");
    const arr = res?.content ?? res;
    return Array.isArray(arr) ? arr : [];
  },
  async listAdmin(): Promise<ProductSummaryDto[]> {
    const res = await api.get<any>("/products?creatorId=ukena");
    const arr = res?.content ?? res;
    return Array.isArray(arr) ? arr : [];
  },
  async create(payload: ProductCreatePayload): Promise<ProductDto> {
    return api.post<ProductDto>("/admin/catalogue", payload);
  },
  async update(id: string, payload: ProductUpdatePayload): Promise<ProductDto> {
    return api.put<ProductDto>(`/admin/catalogue/${encodeURIComponent(id)}`, payload);
  },
  async setStatus(
    id: string,
    status: "ACTIVE" | "OUT_OF_STOCK" | "SUSPENDED_BY_ADMIN",
  ): Promise<void> {
    await api.patch<void>(
      `/admin/catalogue/${encodeURIComponent(id)}/status`,
      { status },
    );
  },
  async remove(id: string): Promise<void> {
    await api.delete<void>(`/admin/catalogue/${encodeURIComponent(id)}`);
  },
  async addImage(id: string, url: string): Promise<void> {
    await api.post<void>(
      `/admin/catalogue/${encodeURIComponent(id)}/images`,
      { url },
    );
  },
  async removeImage(id: string, imageId: string | number): Promise<void> {
    await api.delete<void>(
      `/admin/catalogue/${encodeURIComponent(id)}/images/${encodeURIComponent(String(imageId))}`,
    );
  },
  async revenue(): Promise<RevenueStats> {
    return api.get<RevenueStats>("/admin/revenue");
  },
};
