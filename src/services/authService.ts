/**
 * Mock auth service.
 *
 * No HTTP — login/register resolve a fake session based on the email
 * pattern, mirroring the role-based behaviour the real Spring Boot
 * `/api/auth/*` endpoints will eventually return.
 *
 * Email convention (case-insensitive):
 *   *@admin.ukena    → ROLE_ADMIN
 *   *@creator.ukena  → ROLE_CREATOR
 *   *@buyer.ukena    → ROLE_BUYER
 *   anything else    → ROLE_BUYER  (sensible default for visitors)
 *
 * Any non-empty password is accepted while the backend is offline.
 */
import { fakeResolve } from "./api";

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

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}

function inferRole(email: string): UserRole {
  const e = email.trim().toLowerCase();
  if (e.endsWith("@admin.ukena")) return "ROLE_ADMIN";
  if (e.endsWith("@creator.ukena")) return "ROLE_CREATOR";
  return "ROLE_BUYER";
}

function fullNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Friend";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(" ") || "Friend";
}

/** Map known creator emails to a creator profile id from the seed data. */
function inferCreatorId(email: string): string | undefined {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  // Any seeded creator slug works as a login (e.g. wanjiru@creator.ukena)
  const known = [
    "wanjiru",
    "naserian",
    "mumo",
    "akinyi",
    "aluoch",
    "otieno",
    "saitoti",
    "kibet",
  ];
  return known.includes(local) ? local : "wanjiru";
}

function buildSession(payload: {
  email: string;
  fullName?: string;
  role?: UserRole;
}): AuthSession {
  const role = payload.role ?? inferRole(payload.email);
  const user: AuthUser = {
    id: `mock-${payload.email.toLowerCase()}`,
    email: payload.email,
    fullName: payload.fullName?.trim() || fullNameFromEmail(payload.email),
    role,
    creatorId: role === "ROLE_CREATOR" ? inferCreatorId(payload.email) : undefined,
  };
  return {
    token: `mock-token-${user.id}-${Date.now()}`,
    user,
  };
}

export const authService = {
  async login(email: string, _password: string): Promise<AuthSession> {
    if (!email.trim()) throw new Error("Email is required");
    return fakeResolve(buildSession({ email }), 250);
  },

  async register(data: RegisterPayload): Promise<AuthSession> {
    if (!data.email.trim()) throw new Error("Email is required");
    return fakeResolve(
      buildSession({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      }),
      250,
    );
  },

  async logout(): Promise<void> {
    return fakeResolve(undefined, 0);
  },
};
