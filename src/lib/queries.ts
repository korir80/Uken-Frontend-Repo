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
  adminService,
  applicationService,
  creatorService,
  orderService,
  productService,
  profileService,
  savedService,
  type AdminBuyerRow,
  type ApplicationStatus,
  type ApplicationSubmitPayload,
  type ArtisanApplication,
  type BuyerAddress,
  type BuyerAddressInput,
  type CreateOrderPayload,
  type CreatorDetail,
  type CreatorFilters,
  type CreatorPayout,
  type CreatorProfileUpdate,
  type CreatorSummary,
  type FeaturedSlot,
  type OrderDto,
  type OrderStatus,
  type ProductCreatePayload,
  type ProductDto,
  type ProductModerationRow,
  type ProductModerationStatus,
  type ProductUpdatePayload,
  type ProductReview,
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
  ordersAll: () => ["orders", "all"] as const,
  order: (id: string) => ["orders", "detail", id] as const,
  myProfile: () => ["profile", "me"] as const,
  addresses: () => ["addresses", "me"] as const,
  savedProducts: () => ["saved", "products"] as const,
  savedCreators: () => ["saved", "creators"] as const,
  applications: () => ["admin", "applications"] as const,
  adminPayouts: () => ["admin", "payouts"] as const,
  adminReviews: () => ["admin", "reviews"] as const,
  adminFeatured: () => ["admin", "featured"] as const,
  adminBuyers: () => ["admin", "buyers"] as const,
  adminProductStatuses: () => ["admin", "products", "statuses"] as const,
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
      qc.invalidateQueries({ queryKey: queryKeys.ordersAll() });
      qc.setQueryData(queryKeys.order(data.id), data);
    },
  });
}

export function useAdminOrders() {
  return useQuery<OrderDto[]>({
    queryKey: queryKeys.ordersAll(),
    queryFn: () => orderService.getAllOrders(),
  });
}

export function useRefundOrder() {
  const qc = useQueryClient();
  return useMutation<OrderDto, Error, string>({
    mutationFn: (id) => orderService.refund(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.ordersAll() });
      qc.invalidateQueries({ queryKey: queryKeys.ordersBuyer() });
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

/* ---------------- Saved (wishlist) ---------------- */

export function useSavedProducts() {
  return useQuery<string[]>({
    queryKey: queryKeys.savedProducts(),
    queryFn: () => savedService.listSavedProducts(),
  });
}

export function useSavedCreators() {
  return useQuery<string[]>({
    queryKey: queryKeys.savedCreators(),
    queryFn: () => savedService.listSavedCreators(),
  });
}

export function useToggleSavedProduct() {
  const qc = useQueryClient();
  return useMutation<string[], Error, { productId: string; saved: boolean }>({
    mutationFn: ({ productId, saved }) =>
      saved
        ? savedService.removeSavedProduct(productId)
        : savedService.addSavedProduct(productId),
    onSuccess: (data) => qc.setQueryData(queryKeys.savedProducts(), data),
  });
}

export function useToggleSavedCreator() {
  const qc = useQueryClient();
  return useMutation<string[], Error, { creatorId: string; saved: boolean }>({
    mutationFn: ({ creatorId, saved }) =>
      saved
        ? savedService.removeSavedCreator(creatorId)
        : savedService.addSavedCreator(creatorId),
    onSuccess: (data) => qc.setQueryData(queryKeys.savedCreators(), data),
  });
}

/* ---------------- Admin ---------------- */

export function useAdminApplications() {
  return useQuery<ArtisanApplication[]>({
    queryKey: queryKeys.applications(),
    queryFn: () => applicationService.list(),
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation<
    ArtisanApplication,
    Error,
    { id: string; status: ApplicationStatus; notes?: string }
  >({
    mutationFn: ({ id, status, notes }) =>
      applicationService.updateStatus(id, { status, notes }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.applications() }),
  });
}

export function useAdminPayouts() {
  return useQuery<CreatorPayout[]>({
    queryKey: queryKeys.adminPayouts(),
    queryFn: () => adminService.listPayouts(),
  });
}

export function usePayCreator() {
  const qc = useQueryClient();
  return useMutation<CreatorPayout, Error, string>({
    mutationFn: (creatorId) => adminService.payCreator(creatorId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.adminPayouts() }),
  });
}

export function useRunPayoutCycle() {
  const qc = useQueryClient();
  return useMutation<CreatorPayout[], Error, void>({
    mutationFn: () => adminService.runPayoutCycle(),
    onSuccess: (data) => qc.setQueryData(queryKeys.adminPayouts(), data),
  });
}

export function useAdminReviews() {
  return useQuery<ProductReview[]>({
    queryKey: queryKeys.adminReviews(),
    queryFn: () => adminService.listReviews(),
  });
}

export function useUpdateReviewStatus() {
  const qc = useQueryClient();
  return useMutation<
    ProductReview,
    Error,
    { id: string; status: ProductReview["status"] }
  >({
    mutationFn: ({ id, status }) =>
      adminService.updateReviewStatus(id, { status }),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.adminReviews() }),
  });
}

export function useAdminFeatured() {
  return useQuery<FeaturedSlot[]>({
    queryKey: queryKeys.adminFeatured(),
    queryFn: () => adminService.getFeatured(),
  });
}

export function useSetFeatured() {
  const qc = useQueryClient();
  return useMutation<FeaturedSlot[], Error, FeaturedSlot[]>({
    mutationFn: (slots) => adminService.setFeatured(slots),
    onSuccess: (data) => qc.setQueryData(queryKeys.adminFeatured(), data),
  });
}

export function useAdminBuyers() {
  return useQuery<AdminBuyerRow[]>({
    queryKey: queryKeys.adminBuyers(),
    queryFn: () => adminService.listBuyers(),
  });
}

export function useSuspendBuyer() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (buyerId) => adminService.suspendBuyer(buyerId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.adminBuyers() }),
  });
}

export function useUnsuspendBuyer() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (buyerId) => adminService.unsuspendBuyer(buyerId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.adminBuyers() }),
  });
}

export function useSuspendCreator() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (creatorId) => adminService.suspendCreator(creatorId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.creators() }),
  });
}

export function useAdminProductStatuses() {
  return useQuery<ProductModerationRow[]>({
    queryKey: queryKeys.adminProductStatuses(),
    queryFn: () => adminService.listProductStatuses(),
  });
}

export function useSetProductStatus() {
  const qc = useQueryClient();
  return useMutation<
    ProductModerationRow,
    Error,
    { productId: string; status: ProductModerationStatus }
  >({
    mutationFn: ({ productId, status }) =>
      adminService.setProductStatus(productId, status),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.adminProductStatuses() }),
  });
}

