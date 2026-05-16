/**
 * Order service — backed by /api/orders.
 *
 *   POST  /orders                          public; supports both guest + buyer
 *   GET   /orders/{id}                     buyer/admin
 *   GET   /orders/track                    public; { displayId, email }
 *   GET   /orders/me                       buyer
 *   GET   /creators/me/orders              creator
 *   PATCH /creators/me/orders/{id}/status  creator
 *   PATCH /admin/orders/{id}/status        admin
 *   PATCH /admin/orders/bulk-status        admin
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
  /** Required — id from GET /api/delivery-zones. */
  deliveryZoneId: string;
  /** Required when buyer is unauthenticated. */
  guestEmail?: string;
  /** Required when buyer is unauthenticated. */
  guestFullName?: string;
}

export type OrderStatus = "PENDING" | "PAID" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

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
  productsTotalPence?: number;
  shippingPence?: number;
  totalPence: number;
  buyer: { fullName: string; email: string };
  items: OrderItem[];
  delivery: DeliveryPayload;
}

export interface OrderDto {
  /** Display id (e.g. "UKN-202501-1234"). */
  id: string;
  displayId: string;
  createdAt: string;
  status: OrderStatus;
  productsTotalPence: number;
  shippingPence: number;
  totalPence: number;
  buyer: { fullName: string; email: string };
  items: OrderItem[];
  delivery: DeliveryPayload;
}

function normalize(raw: RawOrderDto): OrderDto {
  const displayId = raw.displayId ?? raw.id ?? "";
  const productsTotalPence =
    typeof raw.productsTotalPence === "number"
      ? raw.productsTotalPence
      : Math.max(0, raw.totalPence - (raw.shippingPence ?? 0));
  const shippingPence = raw.shippingPence ?? 0;
  return {
    ...raw,
    id: displayId,
    displayId,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    productsTotalPence,
    shippingPence,
    items: Array.isArray(raw.items) ? raw.items : [],
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

  async trackOrdersByEmail(email: string): Promise<OrderDto[]> {
    const params = new URLSearchParams({ email });
    const list = unwrapList<RawOrderDto>(
      await api.get<unknown>(`/orders/track-by-email?${params.toString()}`),
    );
    return list.map(normalize);
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
    const raw = await api.patch<RawOrderDto>(`/creators/me/orders/${encodeURIComponent(orderId)}/status`, { status });
    return normalize(raw);
  },

  async adminUpdateStatus(displayId: string, status: OrderStatus): Promise<OrderDto> {
    const raw = await api.patch<RawOrderDto>(`/admin/orders/${encodeURIComponent(displayId)}/status`, { status });
    return normalize(raw);
  },

  async adminBulkUpdateStatus(displayIds: string[], status: OrderStatus): Promise<OrderDto[]> {
    const list = unwrapList<RawOrderDto>(await api.patch<unknown>("/admin/orders/bulk-status", { displayIds, status }));
    return list.map(normalize);
  },
};
