/**
 * Profile service.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Profile):
 *   GET  /api/creators/me              → CreatorDetail (current creator)
 *   PUT  /api/creators/me              → CreatorDetail
 *
 * Image uploads do NOT touch the backend — the browser uploads directly to
 * Cloudinary via an unsigned preset and we hand the resulting public URL
 * back as a plain string. The Spring Boot backend simply stores that string
 * against products / portraits / applications.
 */
import { api, fakeResolve, USE_MOCK_API } from "./api";
import { creatorService, type CreatorDetail } from "./creatorService";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

/* ─── Buyer addresses ─── */

export interface BuyerAddress {
  id: string;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  isDefault: boolean;
}

export type BuyerAddressInput = Omit<BuyerAddress, "id">;

const ADDR_STORAGE_KEY = "ukena.buyer.addresses";

function readMockAddresses(): BuyerAddress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ADDR_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BuyerAddress[]) : [];
  } catch {
    return [];
  }
}
function writeMockAddresses(list: BuyerAddress[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADDR_STORAGE_KEY, JSON.stringify(list));
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

  /**
   * Upload an image. In development with no Cloudinary creds, falls back to
   * a local blob URL so the UI is testable. In production, every upload goes
   * directly to Cloudinary from the browser — the backend never sees the
   * file, only the URL.
   */
  async uploadImage(
    file: File,
    opts: { folder?: string; onProgress?: (pct: number) => void } = {},
  ): Promise<UploadedMedia> {
    if (USE_MOCK_API && !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
      const url = URL.createObjectURL(file);
      return fakeResolve({ url, id: `local-${Date.now()}` });
    }
    const result = await uploadToCloudinary(file, {
      folder: opts.folder ?? "ukena",
      onProgress: opts.onProgress,
    });
    return { url: result.url, id: result.publicId };
  },
};
