import { api } from "./api";
import type { OrderDto, DeliveryDto } from "../types/api";
// UKENA-ORDERS-SERVICE-V2 - buyerId added 2026-05-10
export const ordersService = {
  create: (items: { productId: string; quantity: number }[], delivery: DeliveryDto, buyerId: string) =>
    api.post<OrderDto>("/orders", { items, delivery, buyerId }),
  getMyOrders: () => api.get<OrderDto[]>("/orders/me"),
};
