import { api } from "./api";
import type { OrderDto, DeliveryDto } from "../types/api";

//mdauorders
export const ordersService = {
  create: (items: { productId: string; quantity: number }[], delivery: DeliveryDto, buyerId: string) =>
    api.post<OrderDto>("/orders", { items, delivery, buyerId }),
  getMyOrders: () => api.get<OrderDto[]>("/orders/me"),
};

//save this please
