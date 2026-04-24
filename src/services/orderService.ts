/**
 * Order service — in-memory mock for the admin/creator dashboards.
 * Will be replaced by /api/orders on Spring Boot.
 */
import { fakeResolve } from "./api";
import { getAllProducts } from "@/components/product/product-data";

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

export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

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

/* --------------------------- Seed orders --------------------------- */

function pickProduct(id: string) {
  return getAllProducts().find((p) => p.id === id) ?? getAllProducts()[0];
}

function makeOrder(args: {
  id: string;
  daysAgo: number;
  status: OrderStatus;
  buyerName: string;
  email: string;
  city: string;
  postcode: string;
  productIds: { id: string; qty: number }[];
}): OrderDto {
  const items: OrderItem[] = args.productIds.map(({ id, qty }) => {
    const p = pickProduct(id);
    return {
      productId: p.id,
      name: p.name,
      quantity: qty,
      pricePence: p.pricePence,
      image: p.heroImage,
      creator: {
        id: p.creator.id,
        fullName: p.creator.fullName,
        region: p.creator.region,
      },
    };
  });
  const total = items.reduce((s, i) => s + i.pricePence * i.quantity, 0);
  const date = new Date();
  date.setDate(date.getDate() - args.daysAgo);
  return {
    id: args.id,
    createdAt: date.toISOString(),
    status: args.status,
    totalPence: total,
    buyer: { fullName: args.buyerName, email: args.email },
    items,
    delivery: {
      fullName: args.buyerName,
      email: args.email,
      addressLine1: "12 Linden Mews",
      city: args.city,
      postcode: args.postcode,
      country: "United Kingdom",
    },
  };
}

const seedOrders: OrderDto[] = [
  makeOrder({
    id: "UKN-1042",
    daysAgo: 1,
    status: "PENDING",
    buyerName: "Eleanor Reid",
    email: "eleanor.reid@example.co.uk",
    city: "London",
    postcode: "E2 8DY",
    productIds: [{ id: "p-mara-01", qty: 1 }, { id: "p-mara-03", qty: 2 }],
  }),
  makeOrder({
    id: "UKN-1041",
    daysAgo: 2,
    status: "PREPARING",
    buyerName: "Imogen Clarke",
    email: "imogen@example.co.uk",
    city: "Bristol",
    postcode: "BS1 4QA",
    productIds: [{ id: "p-kaj-01", qty: 1 }],
  }),
  makeOrder({
    id: "UKN-1040",
    daysAgo: 4,
    status: "SHIPPED",
    buyerName: "Marcus Hale",
    email: "marcus.hale@example.co.uk",
    city: "Edinburgh",
    postcode: "EH3 9DR",
    productIds: [{ id: "p-nrb-01", qty: 1 }],
  }),
  makeOrder({
    id: "UKN-1039",
    daysAgo: 7,
    status: "DELIVERED",
    buyerName: "Priya Anand",
    email: "priya.anand@example.co.uk",
    city: "Manchester",
    postcode: "M1 6FQ",
    productIds: [{ id: "p-mara-04", qty: 1 }, { id: "p-mwi-01", qty: 2 }],
  }),
  makeOrder({
    id: "UKN-1038",
    daysAgo: 9,
    status: "DELIVERED",
    buyerName: "Hannah Bryce",
    email: "hannah@example.co.uk",
    city: "Bath",
    postcode: "BA1 1LZ",
    productIds: [{ id: "p-lam-01", qty: 1 }],
  }),
  makeOrder({
    id: "UKN-1037",
    daysAgo: 12,
    status: "DELIVERED",
    buyerName: "Sam Whitley",
    email: "sam.w@example.co.uk",
    city: "Brighton",
    postcode: "BN1 3XE",
    productIds: [{ id: "p-mar-01", qty: 1 }],
  }),
  makeOrder({
    id: "UKN-1036",
    daysAgo: 14,
    status: "CANCELLED",
    buyerName: "Naomi Field",
    email: "naomi@example.co.uk",
    city: "York",
    postcode: "YO1 7HH",
    productIds: [{ id: "p-kaj-02", qty: 1 }],
  }),
];

export const orderService = {
  async createOrder(_payload: CreateOrderPayload): Promise<OrderDto> {
    // Mock — would POST /api/orders
    const id = `UKN-${1100 + Math.floor(Math.random() * 200)}`;
    const fake: OrderDto = {
      ..._mock_fromPayload(id, _payload),
    };
    seedOrders.unshift(fake);
    return fakeResolve(fake);
  },

  async getOrdersByBuyer(email?: string): Promise<OrderDto[]> {
    if (!email) return fakeResolve(seedOrders.slice(0, 3));
    return fakeResolve(seedOrders.filter((o) => o.buyer.email.toLowerCase() === email.toLowerCase()));
  },

  async getOrdersByCreator(creatorId?: string): Promise<OrderDto[]> {
    if (!creatorId) return fakeResolve(seedOrders);
    return fakeResolve(
      seedOrders.filter((o) => o.items.some((i) => i.creator.id === creatorId)),
    );
  },

  async getAllOrders(): Promise<OrderDto[]> {
    return fakeResolve(seedOrders);
  },
};

function _mock_fromPayload(id: string, payload: CreateOrderPayload): OrderDto {
  const items: OrderItem[] = payload.items.map(({ productId, quantity }) => {
    const p = pickProduct(productId);
    return {
      productId: p.id,
      name: p.name,
      quantity,
      pricePence: p.pricePence,
      image: p.heroImage,
      creator: { id: p.creator.id, fullName: p.creator.fullName, region: p.creator.region },
    };
  });
  return {
    id,
    createdAt: new Date().toISOString(),
    status: "PENDING",
    totalPence: items.reduce((s, i) => s + i.pricePence * i.quantity, 0),
    buyer: { fullName: payload.delivery.fullName, email: payload.delivery.email },
    items,
    delivery: payload.delivery,
  };
}
