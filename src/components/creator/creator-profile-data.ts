/**
 * Creator profile types only.
 *
 * The hardcoded `creatorProfiles` map previously exported here has been
 * removed — profile data must come from GET /api/creators/{id}. The
 * `getCreatorProfile` helper is now an async fetch that maps the API
 * CreatorDetail into the local CreatorProfile shape so existing UI
 * components keep working.
 */
import { creatorService } from "@/services/creatorService";

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
  /** Wide banner image (3:1). Maps to API headerImage. */
  coverImage: string;
  /** Square face/avatar (1:1). Maps to API portraitImage. */
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

/** Fetch a creator profile from the backend. Throws if not found. */
export async function getCreatorProfile(id: string): Promise<CreatorProfile> {
  const detail = await creatorService.getCreatorById(id);
  const cover = detail.headerImage ?? detail.image;
  const avatar = detail.portraitImage ?? detail.image;
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
    products: [],
    relatedCreators: [],
  };
}
