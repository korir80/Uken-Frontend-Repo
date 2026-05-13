/**
 * Back-compat shim — prefer importing `orderService` from "@/services".
 * Kept for the checkout flow which still uses these helpers.
 */
import { orderService, type CreateOrderPayload, type OrderDto } from "./orderService";

export const ordersService = {
  /**
   * Create an order. For guests, pass `guestEmail` + `guestFullName`.
   * For logged-in buyers, omit them (the JWT identifies the buyer).
   */
  create: (
    items: CreateOrderPayload["items"],
    delivery: CreateOrderPayload["delivery"],
    guest?: { guestEmail: string; guestFullName: string },
  ): Promise<OrderDto> =>
    orderService.createOrder({
      items,
      delivery,
      ...(guest ?? {}),
    }),
  getMyOrders: () => orderService.getOrdersByBuyer(),
};
