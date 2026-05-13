/**
 * Saved (wishlist) service — buyer-scoped collections of saved product IDs
 * and creator IDs.
 *
 *   GET    /api/users/me/saved/products       → string[]
 *   POST   /api/users/me/saved/products/{id}  → string[]
 *   DELETE /api/users/me/saved/products/{id}  → string[]
 *   GET    /api/users/me/saved/creators       → string[]
 *   POST   /api/users/me/saved/creators/{id}  → string[]
 *   DELETE /api/users/me/saved/creators/{id}  → string[]
 *   POST   /api/users/me/saved/sync           → { products, creators }
 */
import { api } from "./api";
import {
  readSavedCreators,
  readSavedProducts,
  writeSavedCreators,
  writeSavedProducts,
} from "@/lib/ukena-mode";

export interface SavedCollections {
  products: string[];
  creators: string[];
}

const asArray = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

export const savedService = {
  /* ---------------- Products ---------------- */
  async listSavedProducts(): Promise<string[]> {
    const res = asArray(await api.get<string[]>("/users/me/saved/products"));
    writeSavedProducts(res);
    return res;
  },

  async addSavedProduct(productId: string): Promise<string[]> {
    const res = asArray(
      await api.post<string[]>(
        `/users/me/saved/products/${encodeURIComponent(productId)}`,
        {},
      ),
    );
    writeSavedProducts(res);
    return res;
  },

  async removeSavedProduct(productId: string): Promise<string[]> {
    const res = asArray(
      await api.delete<string[]>(
        `/users/me/saved/products/${encodeURIComponent(productId)}`,
      ),
    );
    writeSavedProducts(res);
    return res;
  },

  /* ---------------- Creators ---------------- */
  async listSavedCreators(): Promise<string[]> {
    const res = asArray(await api.get<string[]>("/users/me/saved/creators"));
    writeSavedCreators(res);
    return res;
  },

  async addSavedCreator(creatorId: string): Promise<string[]> {
    const res = asArray(
      await api.post<string[]>(
        `/users/me/saved/creators/${encodeURIComponent(creatorId)}`,
        {},
      ),
    );
    writeSavedCreators(res);
    return res;
  },

  async removeSavedCreator(creatorId: string): Promise<string[]> {
    const res = asArray(
      await api.delete<string[]>(
        `/users/me/saved/creators/${encodeURIComponent(creatorId)}`,
      ),
    );
    writeSavedCreators(res);
    return res;
  },

  async syncOnLogin(): Promise<SavedCollections> {
    const localProducts = readSavedProducts();
    const localCreators = readSavedCreators();
    const res = await api.post<SavedCollections>("/users/me/saved/sync", {
      products: localProducts,
      creators: localCreators,
    });
    writeSavedProducts(res.products ?? []);
    writeSavedCreators(res.creators ?? []);
    return res;
  },
};
