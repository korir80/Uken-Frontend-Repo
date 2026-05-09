/**
 * Auth context for Uken — wired to the real Spring Boot backend via
 * src/services/auth.ts and the fetch wrapper in src/services/api.ts.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { authService } from "@/services/auth";
import {
  ApiError,
  clearToken,
  getToken,
  registerUnauthorizedHandler,
  setToken,
} from "@/services/api";
import type { AuthResponse, AuthUserDto } from "@/types/api";

type Role = AuthUserDto["role"];

interface AuthContextValue {
  user: AuthUserDto | null;
  /** Convenience accessor for `user?.role ?? null`. */
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBuyer: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUserDto>;
  register: (email: string, password: string, fullName: string) => Promise<AuthUserDto>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Keep the latest navigate reference inside the 401 handler without
  // re-registering on every render.
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Hydrate from existing token on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authService.me();
        if (!cancelled) setUser(me);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Wire 401 → sign-out + redirect.
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearToken();
      setUser(null);
      toast.error("Session expired");
      navigateRef.current({ to: "/signin" });
    });
  }, []);

  const applySession = useCallback((session: AuthResponse) => {
    setToken(session.token);
    setUser(session.user);
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
    async (email: string, password: string, fullName: string) => {
      const session = await authService.register(email, password, fullName);
      return applySession(session);
    },
    [applySession],
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    navigate({ to: "/signin" });
  }, [navigate]);

  const value = useMemo<AuthContextValue>(() => {
    const role: Role | null = user?.role ?? null;
    return {
      user,
      isAuthenticated: !!user,
      isLoading,
      isBuyer: role === "ROLE_BUYER",
      isCreator: role === "ROLE_CREATOR",
      isAdmin: role === "ROLE_ADMIN",
      login,
      register,
      logout,
    };
  }, [user, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/** Default landing path per role — used by post-login redirect logic. */
export function defaultPathForRole(role: Role | null | undefined): string {
  if (role === "ROLE_ADMIN") return "/admin";
  if (role === "ROLE_CREATOR") return "/creator";
  if (role === "ROLE_BUYER") return "/account";
  return "/";
}
