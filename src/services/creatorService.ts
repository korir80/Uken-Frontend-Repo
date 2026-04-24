/**
 * Creator service.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Creators):
 *   GET /api/creators                 → CreatorSummary[]   (filters: craft, region, page, pageSize)
 *   GET /api/creators/{id}            → CreatorDetail
 */
import { api, fakeResolve, USE_MOCK_API } from "./api";
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

/* -------------------- Mock builders -------------------- */

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

function buildMockDetail(id: string): CreatorDetail {
  const profile = getCreatorProfile(id);
  const summary = seedCreators.find((c) => c.id === profile.id);
  return {
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
    processSteps: (profile.processSteps ?? []).map((s) => ({ image: s.image, caption: s.caption })),
    culturalMeaning: profile.culturalMeaning ?? [],
    mapPin: profile.mapPin,
  };
}

/* -------------------- Service -------------------- */

export const creatorService = {
  async getCreators(filters: CreatorFilters = {}): Promise<CreatorSummary[]> {
    if (USE_MOCK_API) {
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
    }
    const params = new URLSearchParams();
    if (filters.craft) params.set("craft", String(filters.craft));
    if (filters.region) params.set("region", filters.region);
    if (filters.page != null) params.set("page", String(filters.page));
    if (filters.pageSize != null) params.set("pageSize", String(filters.pageSize));
    const qs = params.toString();
    const res = await api.get<CreatorSummary[]>(`/creators${qs ? `?${qs}` : ""}`);
    return res.data;
  },

  async getCreatorById(id: string): Promise<CreatorDetail> {
    if (USE_MOCK_API) return fakeResolve(buildMockDetail(id));
    const res = await api.get<CreatorDetail>(`/creators/${encodeURIComponent(id)}`);
    return res.data;
  },
};
