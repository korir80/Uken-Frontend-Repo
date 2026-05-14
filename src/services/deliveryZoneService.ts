/**
 * Delivery zones — GET /api/delivery-zones (public).
 * Used in the checkout to populate a country-grouped dropdown and to
 * supply the `deliveryZoneId` + shippingPence on order creation.
 */
import { api, unwrapList } from "./api";

export interface DeliveryZoneDto {
  id: string;
  name: string;
  country: string;
  shippingPence: number;
}

export const deliveryZoneService = {
  async list(): Promise<DeliveryZoneDto[]> {
    return unwrapList<DeliveryZoneDto>(await api.get<unknown>("/delivery-zones"));
  },
};
