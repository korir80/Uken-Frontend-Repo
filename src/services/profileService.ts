/**
 * Profile service — stubbed in-memory creator profile editor.
 * Will be replaced by /api/creators/me on Spring Boot.
 */
import { fakeResolve } from "./api";
import { creatorService, type CreatorDetail } from "./creatorService";

export interface CreatorProfileUpdate {
  firstName?: string;
  fullName?: string;
  region?: string;
  craft?: string;
  storyParagraphs?: string[];
  pullQuote?: string;
}

export interface UploadedMedia {
  url: string;
  id: string;
}

const overrides: Record<string, CreatorProfileUpdate> = {};

export const profileService = {
  async getCreatorProfile(creatorId: string): Promise<CreatorDetail> {
    const base = await creatorService.getCreatorById(creatorId);
    const o = overrides[creatorId] ?? {};
    return {
      ...base,
      firstName: o.firstName ?? base.firstName,
      fullName: o.fullName ?? base.fullName,
      region: o.region ?? base.region,
      craft: o.craft ?? base.craft,
      storyParagraphs: o.storyParagraphs ?? base.storyParagraphs,
      pullQuote: o.pullQuote ?? base.pullQuote,
    };
  },

  async updateCreatorProfile(
    creatorId: string,
    payload: CreatorProfileUpdate,
  ): Promise<CreatorDetail> {
    overrides[creatorId] = { ...(overrides[creatorId] ?? {}), ...payload };
    return profileService.getCreatorProfile(creatorId);
  },

  async uploadImage(file: File): Promise<UploadedMedia> {
    // Generate a temporary local URL — sufficient for the dashboard preview.
    const url = URL.createObjectURL(file);
    return fakeResolve({ url, id: `mock-${Date.now()}` });
  },
};
