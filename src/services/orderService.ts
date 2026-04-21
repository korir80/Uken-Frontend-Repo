import { api, unwrap } from "./api";

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

export interface OrderDto {
  id: string;
  createdAt: string;
  status: "PENDING" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalPence: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    pricePence: number;
    creator: { id: string; fullName: string };
  }[];
  delivery: DeliveryPayload;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<OrderDto> {
    const res = await api.post("/orders", payload);
    return unwrap<OrderDto>(res);
  },

  async getOrdersByBuyer(): Promise<OrderDto[]> {
    const res = await api.get("/orders/buyer");
    return unwrap<OrderDto[]>(res);
  },

  async getOrdersByCreator(): Promise<OrderDto[]> {
    const res = await api.get("/orders/creator");
    return unwrap<OrderDto[]>(res);
  },
};
