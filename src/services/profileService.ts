/**
 * Profile service.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Profile):
 *   GET  /api/creators/me              → CreatorDetail (current creator)
 *   PUT  /api/creators/me              → CreatorDetail
 *   POST /api/media/upload             → { url, id }     (multipart/form-data)
 */
import { api, fakeResolve, USE_MOCK_API } from "./api";
import { creatorService, type CreatorDetail } from "./creatorService";

export interface CreatorProfileUpdate {
  firstName?: string;
  fullName?: string;
  region?: string;
  craft?: string;
  storyParagraphs?: string[];
  pullQuote?: string;
  portraitImage?: string;
  headerImage?: string;
}

export interface UploadedMedia {
  url: string;
  id: string;
}

const mockOverrides: Record<string, CreatorProfileUpdate> = {};

export const profileService = {
  async getCreatorProfile(creatorId: string): Promise<CreatorDetail> {
    if (USE_MOCK_API) {
      const base = await creatorService.getCreatorById(creatorId);
      const o = mockOverrides[creatorId] ?? {};
      return {
        ...base,
        firstName: o.firstName ?? base.firstName,
        fullName: o.fullName ?? base.fullName,
        region: o.region ?? base.region,
        craft: o.craft ?? base.craft,
        storyParagraphs: o.storyParagraphs ?? base.storyParagraphs,
        pullQuote: o.pullQuote ?? base.pullQuote,
        portraitImage: o.portraitImage ?? base.portraitImage,
        headerImage: o.headerImage ?? base.headerImage,
      };
    }
    const res = await api.get<CreatorDetail>("/creators/me");
    return res.data;
  },

  async updateCreatorProfile(creatorId: string, payload: CreatorProfileUpdate): Promise<CreatorDetail> {
    if (USE_MOCK_API) {
      mockOverrides[creatorId] = { ...(mockOverrides[creatorId] ?? {}), ...payload };
      return profileService.getCreatorProfile(creatorId);
    }
    const res = await api.put<CreatorDetail>("/creators/me", payload);
    return res.data;
  },

  async uploadImage(file: File): Promise<UploadedMedia> {
    if (USE_MOCK_API) {
      const url = URL.createObjectURL(file);
      return fakeResolve({ url, id: `mock-${Date.now()}` });
    }
    const res = await api.upload<UploadedMedia>("/media/upload", file);
    return res.data;
  },
};
