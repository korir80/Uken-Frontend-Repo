/**
 * React Query hooks layered on top of the service modules.
 *
 * Components import these instead of the bare service functions so that
 * loading / empty / error states, cache invalidation, and background
 * refetching all flow through one place.
 */
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";

import {
  applicationService,
  creatorService,
  orderService,
  productService,
  profileService,
  type ApplicationSubmitPayload,
  type ArtisanApplication,
  type BuyerAddress,
  type BuyerAddressInput,
  type CreateOrderPayload,
  type CreatorDetail,
  type CreatorFilters,
  type CreatorProfileUpdate,
  type CreatorSummary,
  type OrderDto,
  type OrderStatus,
  type ProductCreatePayload,
  type ProductDto,
  type ProductUpdatePayload,
  type UploadedMedia,
} from "@/services";

/* ---------------- Query keys ---------------- */

export const queryKeys = {
  creators: (filters: CreatorFilters = {}) => ["creators", filters] as const,
  creator: (id: string) => ["creators", id] as const,
  products: () => ["products", "all"] as const,
  product: (id: string) => ["products", id] as const,
  productsByCreator: (creatorId: string) =>
    ["products", "creator", creatorId] as const,
  ordersBuyer: () => ["orders", "buyer"] as const,
  ordersCreator: () => ["orders", "creator"] as const,
  order: (id: string) => ["orders", "detail", id] as const,
  myProfile: () => ["profile", "me"] as const,
  addresses: () => ["addresses", "me"] as const,
};

/* ---------------- Query options factories (for use in route loaders) ---------------- */

export const creatorsQueryOptions = (filters: CreatorFilters = {}) =>
  queryOptions({
    queryKey: queryKeys.creators(filters),
    queryFn: () => creatorService.getCreators(filters),
  });

export const creatorQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.creator(id),
    queryFn: () => creatorService.getCreatorById(id),
  });

export const productsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.products(),
    queryFn: () => productService.getAllProducts(),
  });

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.product(id),
    queryFn: () => productService.getProductById(id),
  });

export const orderQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.order(id),
    queryFn: () => orderService.getOrderById(id),
  });

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

export function useAllProducts() {
  return useQuery(productsQueryOptions());
}

export function useProduct(id: string, extra?: { initialData?: ProductDto }) {
  return useQuery({
    ...productQueryOptions(id),
    enabled: !!id,
    ...(extra ?? {}),
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

export function useBuyerOrder(id: string) {
  return useQuery({
    ...orderQueryOptions(id),
    enabled: !!id,
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

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation<OrderDto, Error, { id: string; status: OrderStatus }>({
    mutationFn: ({ id, status }) => orderService.updateStatus(id, status),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.ordersCreator() });
      qc.setQueryData(queryKeys.order(data.id), data);
    },
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
  return useMutation<
    UploadedMedia,
    Error,
    { file: File; folder?: string; onProgress?: (pct: number) => void }
  >({
    mutationFn: ({ file, folder, onProgress }) =>
      profileService.uploadImage(file, { folder, onProgress }),
  });
}

/* ---------------- Creator products (CRUD) ---------------- */

export function useCreateMyProduct(creatorId?: string) {
  const qc = useQueryClient();
  return useMutation<ProductDto, Error, ProductCreatePayload>({
    mutationFn: (payload) => productService.createMyProduct(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products() });
      if (creatorId)
        qc.invalidateQueries({
          queryKey: queryKeys.productsByCreator(creatorId),
        });
    },
  });
}

export function useUpdateMyProduct(creatorId?: string) {
  const qc = useQueryClient();
  return useMutation<
    ProductDto,
    Error,
    { id: string; payload: ProductUpdatePayload }
  >({
    mutationFn: ({ id, payload }) => productService.updateMyProduct(id, payload),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.product(data.id), data);
      qc.invalidateQueries({ queryKey: queryKeys.products() });
      if (creatorId)
        qc.invalidateQueries({
          queryKey: queryKeys.productsByCreator(creatorId),
        });
    },
  });
}

export function useDeleteMyProduct(creatorId?: string) {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => productService.deleteMyProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products() });
      if (creatorId)
        qc.invalidateQueries({
          queryKey: queryKeys.productsByCreator(creatorId),
        });
    },
  });
}

/* ---------------- Applications ---------------- */

export function useSubmitApplication() {
  return useMutation<ArtisanApplication, Error, ApplicationSubmitPayload>({
    mutationFn: (payload) => applicationService.submit(payload),
  });
}

/* ---------------- Buyer addresses ---------------- */

export function useBuyerAddresses() {
  return useQuery<BuyerAddress[]>({
    queryKey: queryKeys.addresses(),
    queryFn: () => profileService.listAddresses(),
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation<BuyerAddress, Error, BuyerAddressInput>({
    mutationFn: (payload) => profileService.createAddress(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.addresses() }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation<
    BuyerAddress,
    Error,
    { id: string; payload: BuyerAddressInput }
  >({
    mutationFn: ({ id, payload }) =>
      profileService.updateAddress(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.addresses() }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => profileService.deleteAddress(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.addresses() }),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation<BuyerAddress[], Error, string>({
    mutationFn: (id) => profileService.setDefaultAddress(id),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.addresses(), data);
    },
  });
}
