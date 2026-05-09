/**
 * Product service — backed by GET /api/products.
 */
import { api } from "./api";

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
  leadTimeDays?: { min: number; max: number };
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
  leadTimeDays?: { min: number; max: number };
}

export type ProductUpdatePayload = Partial<ProductCreatePayload>;

export const productService = {
  async getAllProducts(): Promise<ProductDto[]> {
    return api.get<ProductDto[]>("/products");
  },

  async getProductById(id: string): Promise<ProductDto> {
    return api.get<ProductDto>(`/products/${encodeURIComponent(id)}`);
  },

  async getProductsByCreator(creatorId: string): Promise<ProductDto[]> {
    return api.get<ProductDto[]>(`/products?creatorId=${encodeURIComponent(creatorId)}`);
  },

  async createMyProduct(payload: ProductCreatePayload): Promise<ProductDto> {
    return api.post<ProductDto>("/creators/me/products", payload);
  },

  async updateMyProduct(id: string, payload: ProductUpdatePayload): Promise<ProductDto> {
    return api.put<ProductDto>(`/creators/me/products/${encodeURIComponent(id)}`, payload);
  },

  async deleteMyProduct(id: string): Promise<void> {
    await api.delete<void>(`/creators/me/products/${encodeURIComponent(id)}`);
  },
};
