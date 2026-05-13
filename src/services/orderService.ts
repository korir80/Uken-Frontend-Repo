/**
 * Order service — backed by /api/orders.
 *
 * Note: getAllOrders and refund have been removed because the corresponding
 * admin backend endpoints do not exist.
 */
import { api, unwrapList } from "./api";

export interface OrderLinePayload {
  productId: string;
  quantity: number;
}

export interface DeliveryPayload {
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface CreateOrderPayload {
  items: OrderLinePayload[];
  delivery: DeliveryPayload;
}

export type OrderStatus = "PENDING" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  pricePence: number;
  image: string;
  creator: { id: string; fullName: string; region: string };
}

export interface OrderDto {
  id: string;
  createdAt: string;
  status: OrderStatus;
  totalPence: number;
  buyer: { fullName: string; email: string };
  items: OrderItem[];
  delivery: DeliveryPayload;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<OrderDto> {
    return api.post<OrderDto>("/orders", payload);
  },
  async getOrderById(id: string): Promise<OrderDto> {
    return api.get<OrderDto>(`/orders/${encodeURIComponent(id)}`);
  },
  async getOrdersByBuyer(): Promise<OrderDto[]> {
    return api.get<OrderDto[]>("/orders/me");
  },
  async getOrdersByCreator(): Promise<OrderDto[]> {
    return api.get<OrderDto[]>("/creators/me/orders");
  },
  async updateStatus(orderId: string, status: OrderStatus): Promise<OrderDto> {
    return api.patch<OrderDto>(
      `/creators/me/orders/${encodeURIComponent(orderId)}/status`,
      { status },
    );
  },
};
