/**
 * Creator service — resolves from local seed data.
 * Will be replaced with HTTP calls to the Spring Boot /api/creators endpoints.
 */
import { fakeResolve } from "./api";
import { creators as seedCreators, type Craft } from "@/components/explore/creators-data";
import { getCreatorProfile } from "@/components/creator/creator-profile-data";

export interface CreatorFilters {
  craft?: Craft | string;
  region?: string;
  page?: number;
  pageSize?: number;
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

export interface CreatorDetail extends CreatorSummary {
  portraitImage: string;
  headerImage: string;
  storyParagraphs: string[];
  pullQuote: string;
  processSteps: { image: string; caption: string }[];
  culturalMeaning: string[];
  mapPin?: { lat: number; lng: number; label: string };
}

function toSummary(c: (typeof seedCreators)[number]): CreatorSummary {
  return {
    id: c.id,
    firstName: c.firstName,
    fullName: c.fullName,
    craft: c.craft,
    region: c.region,
    hook: c.hook,
    image: c.image,
  };
}

export const creatorService = {
  async getCreators(filters: CreatorFilters = {}): Promise<CreatorSummary[]> {
    let list = seedCreators.map(toSummary);
    if (filters.craft) {
      const want = String(filters.craft).toLowerCase();
      list = list.filter((c) => c.craft.toLowerCase() === want);
    }
    if (filters.region) {
      const want = filters.region.toLowerCase();
      list = list.filter((c) => c.region.toLowerCase().includes(want));
    }
    return fakeResolve(list);
  },

  async getCreatorById(id: string): Promise<CreatorDetail> {
    const profile = getCreatorProfile(id);
    // Pull a `hook` from the seed list when the profile module doesn't carry one.
    const summary = seedCreators.find((c) => c.id === profile.id);
    const detail: CreatorDetail = {
      id: profile.id,
      firstName: profile.firstName,
      fullName: profile.fullName,
      craft: profile.craft,
      region: profile.region,
      hook: summary?.hook ?? profile.storyParagraphs?.[0] ?? "",
      image: summary?.image ?? profile.portraitImage,
      portraitImage: profile.portraitImage,
      headerImage: profile.headerImage ?? profile.portraitImage,
      storyParagraphs: profile.storyParagraphs ?? [],
      pullQuote: profile.pullQuote ?? "",
      processSteps: (profile.processSteps ?? []).map((s) => ({
        image: s.image,
        caption: s.caption,
      })),
      culturalMeaning: profile.culturalMeaning ?? [],
      mapPin: profile.mapPin,
    };
    return fakeResolve(detail);
  },
};
