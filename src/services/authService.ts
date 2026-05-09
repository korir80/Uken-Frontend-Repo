/**
 * Auth service — backed by /api/auth/*.
 *
 *   POST /api/auth/login    → { token, user }
 *   POST /api/auth/register → { token, user }
 *   POST /api/auth/logout   → 204
 *   GET  /api/auth/me       → user
 *
 * Role comes exclusively from the backend response — no client-side inference.
 */
import { api } from "./api";

export type UserRole = "ROLE_BUYER" | "ROLE_CREATOR" | "ROLE_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  /** For ROLE_CREATOR — links the user back to their creator profile. */
  creatorId?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    return api.post<AuthSession>("/auth/login", { email, password } satisfies LoginPayload);
  },

  async register(data: RegisterPayload): Promise<AuthSession> {
    return api.post<AuthSession>("/auth/register", data);
  },

  async logout(): Promise<void> {
    try {
      await api.post<void>("/auth/logout");
    } catch {
      // logout should be best-effort even if the cookie/token already expired
    }
  },

  async me(): Promise<AuthUser | null> {
    try {
      return await api.get<AuthUser>("/auth/me");
    } catch {
      return null;
    }
  },
};
