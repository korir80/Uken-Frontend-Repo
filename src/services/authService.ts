import { api, unwrap } from "./api";

export type UserRole = "ROLE_BUYER" | "ROLE_CREATOR" | "ROLE_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
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

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const res = await api.post("/auth/login", { email, password });
    return unwrap<AuthSession>(res);
  },

  async register(data: RegisterPayload): Promise<AuthSession> {
    const res = await api.post("/auth/register", data);
    return unwrap<AuthSession>(res);
  },

  /**
   * Clears server-side session (httpOnly cookie). Local context teardown
   * is handled by AuthProvider — call its logout() instead from UI code.
   */
  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
      // best-effort — local state is the source of truth for sign-out
    }
  },
};
