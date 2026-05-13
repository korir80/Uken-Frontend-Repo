/**
 * Cart sync service — keeps the buyer's bag durable across devices.
 *
 *   GET  /api/cart       → CartLine[]
 *   PUT  /api/cart       → CartLine[]   (full replace)
 *   POST /api/cart/sync  → CartLine[]   (merge guest + server)
 */
import { api } from "./api";

export interface CartLineDto {
  productId: string;
  quantity: number;
  name: string;
  pricePence: number;
  image: string;
  creator: { id: string; fullName: string; region: string };
}

export const cartService = {
  async getCart(): Promise<CartLineDto[]> {
    const res = await api.get<CartLineDto[]>("/cart");
    return Array.isArray(res) ? res : [];
  },

  async setCart(lines: CartLineDto[]): Promise<CartLineDto[]> {
    return api.put<CartLineDto[]>("/cart", lines);
  },

  async syncOnLogin(localLines: CartLineDto[]): Promise<CartLineDto[]> {
    return api.post<CartLineDto[]>("/cart/sync", { items: localLines });
  },
};
