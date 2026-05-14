/**
 * Delivery zones — public list + admin CRUD.
 *   GET    /api/delivery-zones                (public)
 *   GET    /api/admin/delivery-zones          (admin)
 *   POST   /api/admin/delivery-zones
 *   PUT    /api/admin/delivery-zones/{id}
 *   DELETE /api/admin/delivery-zones/{id}
 */
import { api, unwrapList } from "./api";

export interface DeliveryZoneDto {
  id: string;
  name: string;
  country: string;
  shippingPence: number;
  active?: boolean;
  sortOrder?: number;
}

export interface DeliveryZoneInput {
  name: string;
  country: string;
  shippingPence: number;
  active: boolean;
  sortOrder: number;
}

export const deliveryZoneService = {
  async list(): Promise<DeliveryZoneDto[]> {
    return unwrapList<DeliveryZoneDto>(await api.get<unknown>("/delivery-zones"));
  },
  async listAdmin(): Promise<DeliveryZoneDto[]> {
    return unwrapList<DeliveryZoneDto>(
      await api.get<unknown>("/admin/delivery-zones"),
    );
  },
  async create(payload: DeliveryZoneInput): Promise<DeliveryZoneDto> {
    return api.post<DeliveryZoneDto>("/admin/delivery-zones", payload);
  },
  async update(id: string, payload: DeliveryZoneInput): Promise<DeliveryZoneDto> {
    return api.put<DeliveryZoneDto>(
      `/admin/delivery-zones/${encodeURIComponent(id)}`,
      payload,
    );
  },
  async remove(id: string): Promise<void> {
    await api.delete<void>(`/admin/delivery-zones/${encodeURIComponent(id)}`);
  },
};
