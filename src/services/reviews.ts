import { api } from './api';
import type { PublicReviewDto } from '../types/api';

export const reviewsService = {
  getByProduct: (productId: string) =>
    api.get<PublicReviewDto[]>(`/reviews/product/${productId}`),

  submit: (productId: string, rating: number, body: string) =>
    api.post<null>('/reviews', { productId, rating, body }),
};
