/**
 * Product types only.
 *
 * The mock product catalogue previously exported here has been removed —
 * all product data must come from GET /api/products. This module retains
 * only the type contracts and no-op accessors for legacy callers.
 */

export interface ProductCreatorRef {
  id: string;
  firstName: string;
  fullName: string;
  region: string;
  craft: string;
  portrait: string;
}

export interface Product {
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
  creator: ProductCreatorRef;
}

/** No-op — returns []. Use useAllProducts() / productService.getAllProducts(). */
export function getAllProducts(): Product[] {
  return [];
}

/** No-op — returns undefined. Use useProduct(id) / productService.getProductById(id). */
export function getProduct(_id: string): Product | undefined {
  return undefined;
}
