/**
 * Auth context for Ukena.
 *
 * Stores { user, token, role } in React context, persists the JWT in
 * localStorage as a fallback (preferred path is the httpOnly cookie set
 * by the Spring Boot backend — `withCredentials: true` is already on
 * the axios client). Registers itself with the api module so the
 * request interceptor can attach the Bearer token, and the 401 handler
 * can boot the user back to /signin.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  authService,
  registerUnauthorizedHandler,
  setAuthToken,
  type AuthUser,
  type RegisterPayload,
  type UserRole,
} from "@/services";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "ukena.auth";

interface PersistedAuth {
  token: string;
  user: AuthUser;
}

function readPersisted(): PersistedAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedAuth;
  } catch {
    return null;
  }
}

function writePersisted(value: PersistedAuth | null) {
  if (typeof window === "undefined") return;
  if (value) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from storage on mount
  useEffect(() => {
    const persisted = readPersisted();
    if (persisted) {
      setUser(persisted.user);
      setToken(persisted.token);
      setAuthToken(persisted.token);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setAuthToken(null);
    writePersisted(null);
  }, []);

  // Wire the 401 → sign-out + redirect handler
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
      setToken(null);
      writePersisted(null);
      if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
        window.location.assign("/signin");
      }
    });
  }, []);

  const applySession = useCallback((session: { token: string; user: AuthUser }) => {
    setUser(session.user);
    setToken(session.token);
    setAuthToken(session.token);
    writePersisted({ token: session.token, user: session.user });
    return session.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authService.login(email, password);
      return applySession(session);
    },
    [applySession],
  );

  const register = useCallback(
    async (data: RegisterPayload) => {
      const session = await authService.register(data);
      return applySession(session);
    },
    [applySession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      role: user?.role ?? null,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/**
 * Default landing path per role — used by the post-login redirect logic.
 *
 * Mock email convention (while Spring Boot is offline):
 *   *@admin.ukena    → /admin
 *   *@creator.ukena  → /creator
 *   *@buyer.ukena    → /account
 */
export function defaultPathForRole(role: UserRole | null): string {
  if (role === "ROLE_ADMIN") return "/admin";
  if (role === "ROLE_CREATOR") return "/creator";
  if (role === "ROLE_BUYER") return "/account";
  return "/";
}
