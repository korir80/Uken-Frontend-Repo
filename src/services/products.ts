import { api } from './api';
import type { ProductDto, ProductSummaryDto } from '../types/api';

export const productsService = {
  getAll: () => api.get<ProductSummaryDto[]>('/products'),
  getById: (id: string) => api.get<ProductDto>(`/products/${id}`),
  getMyProducts: () => api.get<ProductSummaryDto[]>('/creators/me/products'),
};
