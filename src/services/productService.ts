/**
 * Product service — backed by the real Spring Boot API.
 * ProductSummaryDto  → GET /products, GET /creators/me/products
 * ProductDto         → GET /products/{id}
 */
import { api } from "./api";

export interface ProductSummaryDto {
  id: string;
  name: string;
  pricePence: number;
  heroImage: string;
  creatorId: string;
  creatorName: string;
  craft: string;
}

export interface ProductDto {
  id: string;
  name: string;
  pricePence: number;
  heroImage: string;
  images: {
    id: number;
    url: string;
    isPrimary: boolean;
    displayOrder: number;
    altText: string;
  }[];
  pieceStory: string;
  materials: string[];
  dimensions: string;
  care: string;
  status: "ACTIVE" | "OUT_OF_STOCK" | "SUSPENDED_BY_CREATOR" | "SUSPENDED_BY_ADMIN";
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
  pieceStory: string;
  materials: string[];
  dimensions: string;
  care: string;
}

export type ProductUpdatePayload = Partial<ProductCreatePayload>;

export const productService = {
  async getAllProducts(): Promise<ProductSummaryDto[]> {
    const result = await api.get<any>("/products");
    const arr = result?.content ?? result;
    return Array.isArray(arr) ? arr : [];
  },

  async getProductById(id: string): Promise<ProductDto> {
    return api.get<ProductDto>(`/products/${encodeURIComponent(id)}`);
  },

  async getMyProducts(): Promise<ProductSummaryDto[]> {
    const result = await api.get<ProductSummaryDto[]>("/creators/me/products");
    return Array.isArray(result) ? result : [];
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
