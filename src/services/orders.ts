import { api } from './api';
import type { OrderDto, DeliveryDto } from '../types/api';

export const ordersService = {
  create: (
    items: { productId: string; quantity: number }[],
    delivery: DeliveryDto,
  ) => api.post<OrderDto>('/orders', { items, delivery }),

  getMyOrders: () => api.get<OrderDto[]>('/orders/me'),
};
