export interface AuthUserDto {
  id: string;
  email: string;
  fullName: string;
  role: 'ROLE_BUYER' | 'ROLE_CREATOR' | 'ROLE_ADMIN' | 'ROLE_SUPPORT';
  creatorId: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUserDto;
}

export interface ProductSummaryDto {
  id: string;
  name: string;
  pricePence: number;
  heroImage: string;
  creatorId: string;
  creatorName: string;
  craft: string;
}

export interface ProductImageDto {
  id: number;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
  altText: string;
}

export interface ProductCreatorDto {
  id: string;
  firstName: string;
  fullName: string;
  region: string;
  craft: string;
  portrait: string;
}

export interface ProductDto {
  id: string;
  name: string;
  pricePence: number;
  heroImage: string;
  images: ProductImageDto[];
  pieceStory: string;
  materials: string[];
  dimensions: string;
  care: string;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'SUSPENDED_BY_CREATOR' | 'SUSPENDED_BY_ADMIN';
  creator: ProductCreatorDto;
}

export interface CreatorSummary {
  id: string;
  firstName: string;
  fullName: string;
  craft: string;
  region: string;
  hook: string;
  image: string;
}

export interface ProcessStep { image: string; caption: string; }

export interface MapPin { lat: number; lng: number; label: string; }

export interface CreatorDetail {
  id: string;
  firstName: string;
  fullName: string;
  craft: string;
  region: string;
  hook: string;
  image: string;
  portraitImage: string;
  headerImage: string;
  storyParagraphs: string[];
  pullQuote: string;
  processSteps: ProcessStep[];
  culturalMeaning: string[];
  mapPin: MapPin;
}

export interface DeliveryDto {
  fullName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
}

export interface OrderItemCreatorDto { id: string; name: string; }

export interface OrderItemDto {
  productId: string;
  name: string;
  quantity: number;
  pricePence: number;
  image: string;
  creator: OrderItemCreatorDto;
}

export interface OrderBuyerDto { fullName: string; email: string; }

export interface OrderDto {
  id: string;
  createdAt: string;
  status: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalPence: number;
  buyer: OrderBuyerDto;
  items: OrderItemDto[];
  delivery: DeliveryDto;
}

export interface SavedItemDto {
  id: string;
  productId: string;
  productName: string;
  primaryImageUrl: string;
  pricePence: number;
  craftType: string;
  creatorName: string;
  savedAt: string;
}

export interface PublicReviewDto {
  id: string;
  buyerName: string;
  rating: number;
  body: string;
  submittedAt: string;
}

export interface SearchResultDto {
  creators: CreatorSummary[];
  products: ProductSummaryDto[];
  total: number;
}

export interface PaymentInitResponse {
  paymentLink: string;
  gatewayRef: string;
}

export const formatPrice = (pence: number): string =>
  `£${(pence / 100).toFixed(2)}`;
