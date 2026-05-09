/**
 * Cart sync service — keeps the buyer's bag durable across devices once
 * they're authenticated.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Cart):
 *   GET  /api/cart                 → CartLine[]
 *   PUT  /api/cart                 → CartLine[]   (full replace)
 *   POST /api/cart/sync            → CartLine[]   (merge guest + server)
 *
 * Anonymous users keep the local-only cart that already lives in
 * `lib/cart.tsx`. On login we hand the local cart to the backend, which
 * returns the merged source-of-truth list. On logout we just drop the
 * local snapshot.
 */
import { api, fakeResolve, USE_MOCK_API } from "./api";

export interface CartLineDto {
  productId: string;
  quantity: number;
  /** Snapshot at add-time so the cart can render without re-fetching. */
  name: string;
  pricePence: number;
  image: string;
  creator: { id: string; fullName: string; region: string };
}

export const cartService = {
  async getCart(): Promise<CartLineDto[]> {
    if (USE_MOCK_API) return fakeResolve([]);
    const res = await api.get<CartLineDto[]>("/cart");
    return res;
  },

  async setCart(lines: CartLineDto[]): Promise<CartLineDto[]> {
    if (USE_MOCK_API) return fakeResolve(lines);
    const res = await api.put<CartLineDto[]>("/cart", lines);
    return res;
  },

  /**
   * Merge guest cart with whatever the server already has. Backend rule:
   * for duplicate productIds, take the max quantity across the two sets.
   */
  async syncOnLogin(localLines: CartLineDto[]): Promise<CartLineDto[]> {
    if (USE_MOCK_API) return fakeResolve(localLines);
    const res = await api.post<CartLineDto[]>("/cart/sync", { items: localLines });
    return res;
  },
};
