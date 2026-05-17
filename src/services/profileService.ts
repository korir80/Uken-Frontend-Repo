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
  processSteps?: { image: string; caption: string }[];
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
        processSteps: o.processSteps ?? base.processSteps,
      };
    }
    const res = await api.get<CreatorDetail>("/creators/me");
    return res;
  },

  async updateCreatorProfile(creatorId: string, payload: CreatorProfileUpdate): Promise<CreatorDetail> {
    if (USE_MOCK_API) {
      mockOverrides[creatorId] = { ...(mockOverrides[creatorId] ?? {}), ...payload };
      return profileService.getCreatorProfile(creatorId);
    }
    const res = await api.put<CreatorDetail>("/creators/me", payload);
    return res;
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

  /* ─────────── Buyer addresses ─────────── *
   * Backend (when live):
   *   GET    /api/users/me/addresses                    → BuyerAddress[]
   *   POST   /api/users/me/addresses                    → BuyerAddress
   *   PUT    /api/users/me/addresses/{id}               → BuyerAddress
   *   DELETE /api/users/me/addresses/{id}               → 204
   *   POST   /api/users/me/addresses/{id}/default       → BuyerAddress[]
   * The mock branch persists to localStorage so the UI is testable end-to-end.
   */

  async listAddresses(): Promise<BuyerAddress[]> {
    if (USE_MOCK_API) return fakeResolve(readMockAddresses());
    const res = await api.get<BuyerAddress[]>("/users/me/addresses");
    return res;
  },

  async createAddress(payload: BuyerAddressInput): Promise<BuyerAddress> {
    if (USE_MOCK_API) {
      const list = readMockAddresses();
      const created: BuyerAddress = {
        ...payload,
        id: `addr-${Date.now()}`,
        isDefault: list.length === 0 ? true : payload.isDefault,
      };
      let next = [...list, created];
      if (created.isDefault)
        next = next.map((a) => ({ ...a, isDefault: a.id === created.id }));
      writeMockAddresses(next);
      return fakeResolve(created);
    }
    const res = await api.post<BuyerAddress>("/users/me/addresses", payload);
    return res;
  },

  async updateAddress(
    id: string,
    payload: BuyerAddressInput,
  ): Promise<BuyerAddress> {
    if (USE_MOCK_API) {
      const list = readMockAddresses();
      let next = list.map((a) => (a.id === id ? { ...a, ...payload, id } : a));
      if (payload.isDefault)
        next = next.map((a) => ({ ...a, isDefault: a.id === id }));
      writeMockAddresses(next);
      const updated = next.find((a) => a.id === id);
      if (!updated) throw new Error("Address not found");
      return fakeResolve(updated);
    }
    const res = await api.put<BuyerAddress>(
      `/users/me/addresses/${encodeURIComponent(id)}`,
      payload,
    );
    return res;
  },

  async deleteAddress(id: string): Promise<void> {
    if (USE_MOCK_API) {
      const list = readMockAddresses();
      const next = list.filter((a) => a.id !== id);
      if (next.length > 0 && !next.some((a) => a.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }
      writeMockAddresses(next);
      return fakeResolve(undefined);
    }
    await api.delete<void>(`/users/me/addresses/${encodeURIComponent(id)}`);
  },

  async setDefaultAddress(id: string): Promise<BuyerAddress[]> {
    if (USE_MOCK_API) {
      const list = readMockAddresses();
      const next = list.map((a) => ({ ...a, isDefault: a.id === id }));
      writeMockAddresses(next);
      return fakeResolve(next);
    }
    const res = await api.post<BuyerAddress[]>(
      `/users/me/addresses/${encodeURIComponent(id)}/default`,
    );
    return res;
  },
};
