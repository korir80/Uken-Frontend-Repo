import { api, unwrap } from "./api";

export interface CreatorFilters {
  craft?: string;
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
    const res = await api.get("/creators", { params: filters });
    return unwrap<CreatorSummary[]>(res);
  },

  async getCreatorById(id: string): Promise<CreatorDetail> {
    const res = await api.get(`/creators/${encodeURIComponent(id)}`);
    return unwrap<CreatorDetail>(res);
  },
};
