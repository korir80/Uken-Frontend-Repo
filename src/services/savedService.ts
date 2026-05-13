/**
 * Saved (wishlist) service — buyer-scoped collections of saved product IDs
 * and creator IDs.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Saved):
 *   GET    /api/users/me/saved/products              → string[]
 *   POST   /api/users/me/saved/products/{id}         → string[]
 *   DELETE /api/users/me/saved/products/{id}         → string[]
 *   GET    /api/users/me/saved/creators              → string[]
 *   POST   /api/users/me/saved/creators/{id}         → string[]
 *   DELETE /api/users/me/saved/creators/{id}         → string[]
 *   POST   /api/users/me/saved/sync                  → { products, creators }
 *
 * Strategy:
 *   - Anonymous users → localStorage only (existing ukena-mode helpers).
 *   - Authenticated buyers → backend persistence + localStorage mirror so
 *     the heart icon stays optimistic and the list survives navigations.
 *   - On login the local set is merged into the server set via /sync.
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

export const savedService = {
  /* ---------------- Products ---------------- */
  async listSavedProducts(): Promise<string[]> {
    const res = await api.get<string[]>("/users/me/saved/products");
    // Mirror locally so heart icons stay in sync without a refetch.
    writeSavedProducts(res);
    return res;
  },

  async addSavedProduct(productId: string): Promise<string[]> {
      const next = [
        productId,
        ...readSavedProducts().filter((id) => id !== productId),
      ];
      writeSavedProducts(next);
      return fakeResolve(next);
    }
    const res = await api.post<string[]>(
      `/users/me/saved/products/${encodeURIComponent(productId)}`,
      {},
    );
    writeSavedProducts(res);
    return res;
  },

  async removeSavedProduct(productId: string): Promise<string[]> {
      const next = readSavedProducts().filter((id) => id !== productId);
      writeSavedProducts(next);
      return fakeResolve(next);
    }
    const res = await api.delete<string[]>(
      `/users/me/saved/products/${encodeURIComponent(productId)}`,
    );
    writeSavedProducts(res);
    return res;
  },

  /* ---------------- Creators ---------------- */
  async listSavedCreators(): Promise<string[]> {
    const res = await api.get<string[]>("/users/me/saved/creators");
    writeSavedCreators(res);
    return res;
  },

  async addSavedCreator(creatorId: string): Promise<string[]> {
      const next = [
        creatorId,
        ...readSavedCreators().filter((id) => id !== creatorId),
      ];
      writeSavedCreators(next);
      return fakeResolve(next);
    }
    const res = await api.post<string[]>(
      `/users/me/saved/creators/${encodeURIComponent(creatorId)}`,
      {},
    );
    writeSavedCreators(res);
    return res;
  },

  async removeSavedCreator(creatorId: string): Promise<string[]> {
      const next = readSavedCreators().filter((id) => id !== creatorId);
      writeSavedCreators(next);
      return fakeResolve(next);
    }
    const res = await api.delete<string[]>(
      `/users/me/saved/creators/${encodeURIComponent(creatorId)}`,
    );
    writeSavedCreators(res);
    return res;
  },

  /**
   * Merge the locally-stored guest selections with the server set after
   * login. Server is the source of truth — but we union in any local IDs
   * the buyer added before signing in.
   */
  async syncOnLogin(): Promise<SavedCollections> {
    const localProducts = readSavedProducts();
    const localCreators = readSavedCreators();

      // No server in mock mode — just keep what's already there.
      const merged: SavedCollections = {
        products: localProducts,
        creators: localCreators,
      };
      return fakeResolve(merged);
    }
    const res = await api.post<SavedCollections>("/users/me/saved/sync", {
      products: localProducts,
      creators: localCreators,
    });
    writeSavedProducts(res.products);
    writeSavedCreators(res.creators);
    return res;
  },
};
