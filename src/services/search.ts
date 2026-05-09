import { api } from './api';
import type { SearchResultDto } from '../types/api';

export const searchService = {
  search: (q: string) =>
    api.get<SearchResultDto>(`/search?q=${encodeURIComponent(q)}`),
};
