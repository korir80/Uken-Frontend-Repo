/**
 * Order service — backed by /api/orders.
 *
 * Endpoints:
 *   POST /orders                — public; supports both guest + buyer
 *   GET  /orders/{id}           — buyer/admin
 *   GET  /orders/track          — public; { displayId, email }
 *   GET  /orders/me             — buyer
 *   GET  /creators/me/orders    — creator
 *   PATCH /creators/me/orders/{id}/status — creator
 */
import { api, unwrapList } from "./api";

export interface OrderLinePayload {
  productId: string;
  quantity: number;
}

export interface DeliveryPayload {
  fullName: string;
  email?: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface CreateOrderPayload {
  items: OrderLinePayload[];
  delivery: DeliveryPayload;
  /** Required when buyer is unauthenticated. Omit for logged-in buyers. */
  guestEmail?: string;
  /** Required when buyer is unauthenticated. Omit for logged-in buyers. */
  guestFullName?: string;
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

interface RawOrderDto {
  id?: string;
  displayId?: string;
  createdAt?: string;
  status: OrderStatus;
  totalPence: number;
  buyer: { fullName: string; email: string };
  items: OrderItem[];
  delivery: DeliveryPayload;
}

export interface OrderDto {
  /** Display id (e.g. "UKN-202501-1234"). Mapped from `displayId` when present. */
  id: string;
  displayId: string;
  createdAt: string;
  status: OrderStatus;
  totalPence: number;
  buyer: { fullName: string; email: string };
  items: OrderItem[];
  delivery: DeliveryPayload;
}

function normalize(raw: RawOrderDto): OrderDto {
  const displayId = raw.displayId ?? raw.id ?? "";
  return {
    ...raw,
    id: displayId,
    displayId,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<OrderDto> {
    const raw = await api.post<RawOrderDto>("/orders", payload);
    return normalize(raw);
  },
  async getOrderById(id: string): Promise<OrderDto> {
    const raw = await api.get<RawOrderDto>(`/orders/${encodeURIComponent(id)}`);
    return normalize(raw);
  },
  async trackOrder(displayId: string, email: string): Promise<OrderDto> {
    const params = new URLSearchParams({ displayId, email });
    const raw = await api.get<RawOrderDto>(`/orders/track?${params.toString()}`);
    return normalize(raw);
  },
  async getOrdersByBuyer(): Promise<OrderDto[]> {
    const list = unwrapList<RawOrderDto>(await api.get<unknown>("/orders/me"));
    return list.map(normalize);
  },
  async getOrdersByCreator(): Promise<OrderDto[]> {
    const list = unwrapList<RawOrderDto>(await api.get<unknown>("/creators/me/orders"));
    return list.map(normalize);
  },
  async updateStatus(orderId: string, status: OrderStatus): Promise<OrderDto> {
    const raw = await api.patch<RawOrderDto>(
      `/creators/me/orders/${encodeURIComponent(orderId)}/status`,
      { status },
    );
    return normalize(raw);
  },
};
