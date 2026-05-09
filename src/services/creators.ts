import { api } from './api';
import type { CreatorSummary, CreatorDetail } from '../types/api';

export const creatorsService = {
  getAll: () => api.get<CreatorSummary[]>('/creators'),
  getById: (id: string) => api.get<CreatorDetail>(`/creators/${id}`),
};
