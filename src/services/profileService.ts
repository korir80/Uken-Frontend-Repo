import { api, unwrap } from "./api";
import type { CreatorDetail } from "./creatorService";

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
  /** Backend-assigned id, useful for ordering / deletion */
  id: string;
}

export const profileService = {
  async getCreatorProfile(): Promise<CreatorDetail> {
    const res = await api.get("/creators/me");
    return unwrap<CreatorDetail>(res);
  },

  async updateCreatorProfile(
    payload: CreatorProfileUpdate,
  ): Promise<CreatorDetail> {
    const res = await api.put("/creators/me", payload);
    return unwrap<CreatorDetail>(res);
  },

  async uploadImage(file: File): Promise<UploadedMedia> {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post("/media/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap<UploadedMedia>(res);
  },
};
