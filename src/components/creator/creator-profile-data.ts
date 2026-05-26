/**
 * Creator profile types + composer.
 *
 * The page-level loader is responsible for fetching the *thin* creator DTO
 * (story, captions, images) AND the catalogue + creators list, then handing
 * them to {@link composeCreatorProfile} which produces a single
 * {@link CreatorProfile} the public + preview views render.
 */
import { creatorService } from "@/services/creatorService";
import { productService, type ProductSummaryDto } from "@/services/productService";
import type { CreatorSummary } from "@/services/creatorService";

export interface ProcessStep {
  image: string;
  caption: string;
}

export interface CreatorProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

export interface RelatedCreator {
  id: string;
  firstName: string;
  craft: string;
  region: string;
  hook: string;
  image: string;
}

export interface CreatorProfile {
  id: string;
  firstName: string;
  fullName: string;
  region: string;
  craft: string;
  /** Wide banner image. */
  coverImage: string;
  /** Square avatar (1:1). */
  avatar: string;
  /** @deprecated use coverImage */
  headerImage: string;
  /** @deprecated use avatar */
  portraitImage: string;
  storyParagraphs: string[];
  pullQuote: string;
  processSteps: ProcessStep[];
  culturalMeaning: string[];
  mapPin?: { lat: number; lng: number; label: string };
  products: CreatorProduct[];
  relatedCreators: RelatedCreator[];
}

export const creatorProfiles: Record<string, CreatorProfile> = {};

function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(pence % 100 === 0 ? 0 : 2)}`;
}

/**
 * Compose a complete profile from the thin creator DTO + the catalogue +
 * all creators. Products are filtered by `creatorId`; related creators are
 * other makers sharing the same craft (fallback: same region).
 */
export async function getCreatorProfile(id: string): Promise<CreatorProfile> {
  const [detail, products, allCreators] = await Promise.all([
    creatorService.getCreatorById(id),
    productService.getAllProducts().catch(() => [] as ProductSummaryDto[]),
    creatorService.getCreators().catch(() => [] as CreatorSummary[]),
  ]);

  const cover = detail.headerImage ?? detail.image;
  const avatar = detail.portraitImage ?? detail.image;

  const ownProducts: CreatorProduct[] = products
    .filter((p) => p.creatorId === detail.id)
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: formatPrice(p.pricePence),
      image: p.heroImage,
      description: p.craft,
    }));

  const sameCraft = allCreators.filter(
    (c) => c.id !== detail.id && c.craft === detail.craft,
  );
  const sameRegion = allCreators.filter(
    (c) => c.id !== detail.id && c.region === detail.region && c.craft !== detail.craft,
  );
  const relatedCreators: RelatedCreator[] = [...sameCraft, ...sameRegion]
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      firstName: c.firstName,
      craft: c.craft,
      region: c.region,
      hook: "",
      image: c.image,
    }));

  return {
    id: detail.id,
    firstName: detail.firstName,
    fullName: detail.fullName,
    region: detail.region,
    craft: detail.craft,
    coverImage: cover,
    avatar,
    headerImage: cover,
    portraitImage: avatar,
    storyParagraphs: detail.storyParagraphs ?? [],
    pullQuote: detail.pullQuote ?? "",
    processSteps: detail.processSteps ?? [],
    culturalMeaning: detail.culturalMeaning ?? [],
    mapPin: detail.mapPin,
    products: ownProducts,
    relatedCreators,
  };
}
