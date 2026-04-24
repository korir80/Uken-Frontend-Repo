/**
 * Product service.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Products):
 *   GET    /api/products                        → ProductDto[]
 *   GET    /api/products/{id}                   → ProductDto
 *   GET    /api/products?creatorId={id}         → ProductDto[]
 *   POST   /api/creators/me/products            → ProductDto   (auth: ROLE_CREATOR)
 *   PUT    /api/creators/me/products/{id}       → ProductDto   (auth: ROLE_CREATOR)
 *   DELETE /api/creators/me/products/{id}       → 204          (auth: ROLE_CREATOR)
 */
import { api, fakeResolve, USE_MOCK_API } from "./api";
import { getAllProducts, getProduct, type Product } from "@/components/product/product-data";

export interface ProductDto {
  id: string;
  name: string;
  pricePence: number;
  heroImage: string;
  gallery: { src: string; alt: string; kind: "product" | "process" }[];
  pieceStory: string;
  materials: string[];
  dimensions: string;
  care: string;
  creator: {
    id: string;
    firstName: string;
    fullName: string;
    region: string;
    craft: string;
    portrait: string;
  };
}

export interface ProductCreatePayload {
  name: string;
  pricePence: number;
  heroImage: string;
  gallery?: { src: string; alt: string; kind: "product" | "process" }[];
  pieceStory: string;
  materials: string[];
  dimensions: string;
  care: string;
}

export type ProductUpdatePayload = Partial<ProductCreatePayload>;

function toDto(p: Product): ProductDto {
  return {
    id: p.id,
    name: p.name,
    pricePence: p.pricePence,
    heroImage: p.heroImage,
    gallery: p.gallery,
    pieceStory: p.pieceStory,
    materials: p.materials,
    dimensions: p.dimensions,
    care: p.care,
    creator: { ...p.creator },
  };
}

export const productService = {
  async getAllProducts(): Promise<ProductDto[]> {
    if (USE_MOCK_API) return fakeResolve(getAllProducts().map(toDto));
    const res = await api.get<ProductDto[]>("/products");
    return res.data;
  },

  async getProductById(id: string): Promise<ProductDto> {
    if (USE_MOCK_API) {
      const p = getProduct(id);
      if (!p) throw new Error(`Product not found: ${id}`);
      return fakeResolve(toDto(p));
    }
    const res = await api.get<ProductDto>(`/products/${encodeURIComponent(id)}`);
    return res.data;
  },

  async getProductsByCreator(creatorId: string): Promise<ProductDto[]> {
    if (USE_MOCK_API) {
      const list = getAllProducts().filter((p) => p.creator.id === creatorId).map(toDto);
      return fakeResolve(list);
    }
    const res = await api.get<ProductDto[]>(`/products?creatorId=${encodeURIComponent(creatorId)}`);
    return res.data;
  },

  async createMyProduct(payload: ProductCreatePayload): Promise<ProductDto> {
    if (USE_MOCK_API) {
      // Mock — returns a synthetic DTO; the dashboard doesn't persist anyway.
      return fakeResolve({
        id: `p-mock-${Date.now()}`,
        ...payload,
        gallery: payload.gallery ?? [],
        creator: {
          id: "mock",
          firstName: "Mock",
          fullName: "Mock Maker",
          region: "Nairobi",
          craft: "Weaving",
          portrait: payload.heroImage,
        },
      });
    }
    const res = await api.post<ProductDto>("/creators/me/products", payload);
    return res.data;
  },

  async updateMyProduct(id: string, payload: ProductUpdatePayload): Promise<ProductDto> {
    if (USE_MOCK_API) {
      const p = getProduct(id);
      if (!p) throw new Error(`Product not found: ${id}`);
      return fakeResolve({ ...toDto(p), ...payload });
    }
    const res = await api.put<ProductDto>(`/creators/me/products/${encodeURIComponent(id)}`, payload);
    return res.data;
  },

  async deleteMyProduct(id: string): Promise<void> {
    if (USE_MOCK_API) return fakeResolve(undefined);
    await api.delete<void>(`/creators/me/products/${encodeURIComponent(id)}`);
  },
};
