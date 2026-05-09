/**
 * Application service — backed by /api/applications and /api/admin/applications.
 */
import { api } from "./api";
import type { ApplicationStatus, ArtisanApplication } from "@/components/admin/admin-data";

export type { ApplicationStatus, ArtisanApplication } from "@/components/admin/admin-data";

export interface ApplicationSubmitPayload {
  fullName: string;
  email: string;
  region: string;
  craft: string;
  yearsOfPractice: number;
  story: string;
  photos: string[];
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus;
  notes?: string;
}

export const applicationService = {
  async submit(payload: ApplicationSubmitPayload): Promise<ArtisanApplication> {
    return api.post<ArtisanApplication>("/applications", payload);
  },
  async list(): Promise<ArtisanApplication[]> {
    return api.get<ArtisanApplication[]>("/admin/applications");
  },
  async get(id: string): Promise<ArtisanApplication> {
    return api.get<ArtisanApplication>(`/admin/applications/${encodeURIComponent(id)}`);
  },
  async updateStatus(id: string, payload: ApplicationStatusUpdate): Promise<ArtisanApplication> {
    return api.patch<ArtisanApplication>(
      `/admin/applications/${encodeURIComponent(id)}/status`,
      payload,
    );
  },
};
