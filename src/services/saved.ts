import { api } from './api';
import type { SavedItemDto } from '../types/api';

export const savedService = {
  getAll: () => api.get<SavedItemDto[]>('/saved'),
  toggle: (productId: string) => api.post<null>(`/saved/${productId}`, {}),
};
