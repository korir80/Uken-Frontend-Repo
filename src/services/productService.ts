/**
 * Product service — resolves from local seed data.
 * Will be replaced with HTTP calls to /api/products on Spring Boot.
 */
import { fakeResolve } from "./api";
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
  async getProductById(id: string): Promise<ProductDto> {
    const p = getProduct(id);
    if (!p) throw new Error(`Product not found: ${id}`);
    return fakeResolve(toDto(p));
  },

  async getProductsByCreator(creatorId: string): Promise<ProductDto[]> {
    const list = getAllProducts()
      .filter((p) => p.creator.id === creatorId)
      .map(toDto);
    return fakeResolve(list);
  },

  async getAllProducts(): Promise<ProductDto[]> {
    return fakeResolve(getAllProducts().map(toDto));
  },
};
