import { api, unwrap } from "./api";

export interface ProductDto {
  id: string;
  name: string;
  pricePence: number;
  heroImage: string;
  gallery: { src: string; alt: string; kind: "product" | "process" }[];
  pieceStory: string;
  materials: string;
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

export const productService = {
  async getProductById(id: string): Promise<ProductDto> {
    const res = await api.get(`/products/${encodeURIComponent(id)}`);
    return unwrap<ProductDto>(res);
  },

  async getProductsByCreator(creatorId: string): Promise<ProductDto[]> {
    const res = await api.get("/products", { params: { creatorId } });
    return unwrap<ProductDto[]>(res);
  },
};
