/**
 * Artisan application service.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Applications):
 *   POST  /api/applications                     → ArtisanApplication       (public — no auth)
 *   GET   /api/admin/applications               → ArtisanApplication[]     (admin)
 *   GET   /api/admin/applications/{id}          → ArtisanApplication       (admin)
 *   PATCH /api/admin/applications/{id}/status   → ArtisanApplication       (admin)
 */
import { api, fakeResolve, USE_MOCK_API } from "./api";
import {
  applications as seedApplications,
  type ApplicationStatus,
  type ArtisanApplication,
} from "@/components/admin/admin-data";

export type { ApplicationStatus, ArtisanApplication } from "@/components/admin/admin-data";

export interface ApplicationSubmitPayload {
  fullName: string;
  email: string;
  region: string;
  craft: string;
  yearsOfPractice: number;
  story: string;
  /** Public URLs returned by /api/media/upload — at minimum a portrait + work sample. */
  photos: string[];
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus;
  notes?: string;
}

export const applicationService = {
  async submit(payload: ApplicationSubmitPayload): Promise<ArtisanApplication> {
    if (USE_MOCK_API) {
      const created: ArtisanApplication = {
        id: `APP-${300 + Math.floor(Math.random() * 100)}`,
        fullName: payload.fullName,
        email: payload.email,
        region: payload.region,
        craft: payload.craft,
        yearsOfPractice: payload.yearsOfPractice,
        story: payload.story,
        submittedAt: new Date().toISOString(),
        status: "PENDING",
        portrait: payload.photos[0] ?? "",
        workSample: payload.photos[1] ?? payload.photos[0] ?? "",
      };
      seedApplications.unshift(created);
      return fakeResolve(created);
    }
    const res = await api.post<ArtisanApplication>("/applications", payload);
    return res.data;
  },

  async list(): Promise<ArtisanApplication[]> {
    if (USE_MOCK_API) return fakeResolve(seedApplications);
    const res = await api.get<ArtisanApplication[]>("/admin/applications");
    return res.data;
  },

  async get(id: string): Promise<ArtisanApplication> {
    if (USE_MOCK_API) {
      const a = seedApplications.find((x) => x.id === id);
      if (!a) throw new Error(`Application not found: ${id}`);
      return fakeResolve(a);
    }
    const res = await api.get<ArtisanApplication>(`/admin/applications/${encodeURIComponent(id)}`);
    return res.data;
  },

  async updateStatus(id: string, payload: ApplicationStatusUpdate): Promise<ArtisanApplication> {
    if (USE_MOCK_API) {
      const a = seedApplications.find((x) => x.id === id);
      if (!a) throw new Error(`Application not found: ${id}`);
      a.status = payload.status;
      return fakeResolve(a);
    }
    const res = await api.patch<ArtisanApplication>(
      `/admin/applications/${encodeURIComponent(id)}/status`,
      payload,
    );
    return res.data;
  },
};
