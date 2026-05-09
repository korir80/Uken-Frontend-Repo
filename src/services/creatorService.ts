/**
 * Creator service — backed by GET /api/creators.
 *
 *   GET /api/creators       → CreatorSummary[]   (filters: craft, region, page, pageSize)
 *   GET /api/creators/{id}  → CreatorDetail
 */
import { api } from "./api";
import type { Craft } from "@/components/explore/creators-data";

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

export const creatorService = {
  async getCreators(filters: CreatorFilters = {}): Promise<CreatorSummary[]> {
    const params = new URLSearchParams();
    if (filters.craft) params.set("craft", String(filters.craft));
    if (filters.region) params.set("region", filters.region);
    if (filters.page != null) params.set("page", String(filters.page));
    if (filters.pageSize != null) params.set("pageSize", String(filters.pageSize));
    const qs = params.toString();
    return api.get<CreatorSummary[]>(`/creators${qs ? `?${qs}` : ""}`);
  },

  async getCreatorById(id: string): Promise<CreatorDetail> {
    return api.get<CreatorDetail>(`/creators/${encodeURIComponent(id)}`);
  },
};
