/**
 * Back-compat shim — prefer importing `orderService` from "@/services".
 */
import { orderService, type CreateOrderPayload, type OrderDto } from "./orderService";

export const ordersService = {
  create: (
    items: CreateOrderPayload["items"],
    delivery: CreateOrderPayload["delivery"],
    deliveryZoneId: string,
    guest?: { guestEmail: string; guestFullName: string },
  ): Promise<OrderDto> =>
    orderService.createOrder({
      items,
      delivery,
      deliveryZoneId,
      ...(guest ?? {}),
    }),
  getMyOrders: () => orderService.getOrdersByBuyer(),
};
