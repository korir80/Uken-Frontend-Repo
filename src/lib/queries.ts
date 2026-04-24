/**
 * React Query hooks layered on top of the service modules.
 *
 * Components import these instead of the bare service functions so that
 * loading / empty / error states, cache invalidation, and background
 * refetching all flow through one place.
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  creatorService,
  orderService,
  productService,
  profileService,
  type CreateOrderPayload,
  type CreatorDetail,
  type CreatorFilters,
  type CreatorProfileUpdate,
  type CreatorSummary,
  type OrderDto,
  type ProductDto,
  type UploadedMedia,
} from "@/services";

/* ---------------- Query keys ---------------- */

export const queryKeys = {
  creators: (filters: CreatorFilters = {}) => ["creators", filters] as const,
  creator: (id: string) => ["creators", id] as const,
  product: (id: string) => ["products", id] as const,
  productsByCreator: (creatorId: string) =>
    ["products", "creator", creatorId] as const,
  ordersBuyer: () => ["orders", "buyer"] as const,
  ordersCreator: () => ["orders", "creator"] as const,
  myProfile: () => ["profile", "me"] as const,
};

/* ---------------- Creators ---------------- */

export function useCreators(
  filters: CreatorFilters = {},
  options?: Omit<UseQueryOptions<CreatorSummary[]>, "queryKey" | "queryFn">,
) {
  return useQuery<CreatorSummary[]>({
    queryKey: queryKeys.creators(filters),
    queryFn: () => creatorService.getCreators(filters),
    ...options,
  });
}

export function useCreator(
  id: string,
  options?: Omit<UseQueryOptions<CreatorDetail>, "queryKey" | "queryFn">,
) {
  return useQuery<CreatorDetail>({
    queryKey: queryKeys.creator(id),
    queryFn: () => creatorService.getCreatorById(id),
    enabled: !!id,
    ...options,
  });
}

/* ---------------- Products ---------------- */

export function useProduct(
  id: string,
  options?: Omit<UseQueryOptions<ProductDto>, "queryKey" | "queryFn">,
) {
  return useQuery<ProductDto>({
    queryKey: queryKeys.product(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
    ...options,
  });
}

export function useProductsByCreator(creatorId: string) {
  return useQuery<ProductDto[]>({
    queryKey: queryKeys.productsByCreator(creatorId),
    queryFn: () => productService.getProductsByCreator(creatorId),
    enabled: !!creatorId,
  });
}

/* ---------------- Orders ---------------- */

export function useBuyerOrders() {
  return useQuery<OrderDto[]>({
    queryKey: queryKeys.ordersBuyer(),
    queryFn: () => orderService.getOrdersByBuyer(),
  });
}

export function useCreatorOrders() {
  return useQuery<OrderDto[]>({
    queryKey: queryKeys.ordersCreator(),
    queryFn: () => orderService.getOrdersByCreator(),
  });
}

export function useCreateOrder(
  options?: UseMutationOptions<OrderDto, Error, CreateOrderPayload>,
) {
  const qc = useQueryClient();
  return useMutation<OrderDto, Error, CreateOrderPayload>({
    mutationFn: (payload) => orderService.createOrder(payload),
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: queryKeys.ordersBuyer() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/* ---------------- Profile ---------------- */

export function useMyCreatorProfile(creatorId: string) {
  return useQuery<CreatorDetail>({
    queryKey: queryKeys.myProfile(),
    queryFn: () => profileService.getCreatorProfile(creatorId),
    enabled: !!creatorId,
  });
}

export function useUpdateCreatorProfile(creatorId: string) {
  const qc = useQueryClient();
  return useMutation<CreatorDetail, Error, CreatorProfileUpdate>({
    mutationFn: (payload) => profileService.updateCreatorProfile(creatorId, payload),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.myProfile(), data);
      qc.invalidateQueries({ queryKey: queryKeys.creator(data.id) });
    },
  });
}

export function useUploadImage() {
  return useMutation<UploadedMedia, Error, File>({
    mutationFn: (file) => profileService.uploadImage(file),
  });
}
