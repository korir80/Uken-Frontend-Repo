/**
 * Auth service.
 *
 * Real backend endpoints (see BACKEND_SPEC.md §Auth):
 *   POST /api/auth/login    → { token, user }
 *   POST /api/auth/register → { token, user }
 *   POST /api/auth/logout   → 204
 *   GET  /api/auth/me       → user
 *
 * When `VITE_USE_MOCK_API=true` the email pattern decides the role so the
 * dashboards remain reachable before the backend is up:
 *   *@admin.ukena    → ROLE_ADMIN
 *   *@creator.ukena  → ROLE_CREATOR
 *   *@buyer.ukena    → ROLE_BUYER (default for any other email)
 */
import { api, fakeResolve, USE_MOCK_API } from "./api";

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

/* -------------------- Mock helpers -------------------- */

function inferRole(email: string): UserRole {
  const e = email.trim().toLowerCase();
  if (e.endsWith("@admin.ukena")) return "ROLE_ADMIN";
  if (e.endsWith("@creator.ukena")) return "ROLE_CREATOR";
  return "ROLE_BUYER";
}

function fullNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Friend";
  return (
    local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase() + p.slice(1))
      .join(" ") || "Friend"
  );
}

function inferCreatorId(email: string): string | undefined {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  const known = ["wanjiru", "naserian", "mumo", "akinyi", "aluoch", "otieno", "saitoti", "kibet"];
  return known.includes(local) ? local : "wanjiru";
}

function buildMockSession(payload: { email: string; fullName?: string; role?: UserRole }): AuthSession {
  const role = payload.role ?? inferRole(payload.email);
  const user: AuthUser = {
    id: `mock-${payload.email.toLowerCase()}`,
    email: payload.email,
    fullName: payload.fullName?.trim() || fullNameFromEmail(payload.email),
    role,
    creatorId: role === "ROLE_CREATOR" ? inferCreatorId(payload.email) : undefined,
  };
  return { token: `mock-token-${user.id}-${Date.now()}`, user };
}

/* -------------------- Service -------------------- */

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    if (!email.trim()) throw new Error("Email is required");
    if (USE_MOCK_API) return fakeResolve(buildMockSession({ email }), 250);
    const res = await api.post<AuthSession>("/auth/login", { email, password } satisfies LoginPayload);
    return res;
  },

  async register(data: RegisterPayload): Promise<AuthSession> {
    if (!data.email.trim()) throw new Error("Email is required");
    if (USE_MOCK_API)
      return fakeResolve(buildMockSession({ email: data.email, fullName: data.fullName, role: data.role }), 250);
    const res = await api.post<AuthSession>("/auth/register", data);
    return res;
  },

  async logout(): Promise<void> {
    if (USE_MOCK_API) return fakeResolve(undefined, 0);
    try {
      await api.post<void>("/auth/logout");
    } catch {
      // logout should be best-effort even if the cookie/token already expired
    }
  },

  async me(): Promise<AuthUser | null> {
    if (USE_MOCK_API) return null;
    try {
      const res = await api.get<AuthUser>("/auth/me");
      return res;
    } catch {
      return null;
    }
  },
};
