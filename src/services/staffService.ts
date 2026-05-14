/**
 * Staff service — /api/admin/staff
 */
import { api, unwrapList } from "./api";

export type StaffRole = "ROLE_SUPPORT" | "ROLE_ADMIN";

export interface StaffMember {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
}

export interface StaffCreatePayload {
  fullName: string;
  email: string;
  password: string;
}

export const staffService = {
  async list(): Promise<StaffMember[]> {
    return unwrapList<StaffMember>(await api.get<unknown>("/admin/staff"));
  },
  async create(payload: StaffCreatePayload): Promise<StaffMember> {
    return api.post<StaffMember>("/admin/staff", payload);
  },
};
