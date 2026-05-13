/**
 * Uken HTTP client.
 *
 * Thin fetch wrapper around the Java Spring Boot backend. Handles:
 * - JWT token storage in localStorage (key: `ukena_token`)
 * - Bearer token attachment on every request
 * - Standard envelope unwrapping ({ success, data, message, errors })
 * - 401 handling via a registerable unauthorized handler
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/* ------------------------------------------------------------------ */
/* Mock toggle (kept so existing services compile — read from env)     */
/* ------------------------------------------------------------------ */

/** Mock API mode is permanently disabled — all data must come from the backend. */
export const USE_MOCK_API: false = false;

/* ------------------------------------------------------------------ */
/* Error type                                                          */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  constructor(
    public override message: string,
    public errors: string[],
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ------------------------------------------------------------------ */
/* Token storage (localStorage, key = ukena_token)                     */
/* ------------------------------------------------------------------ */

const TOKEN_KEY = "ukena_token";

let currentToken: string | null = null;

/** A real backend JWT has the shape `header.payload.signature` (3 base64url segments). */
function isLikelyJwt(t: string): boolean {
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(t);
}

// Hydrate on module load (client only). Discard stale mock tokens left over
// from the previous mock-auth era — they would otherwise poison every request.
if (typeof window !== "undefined") {
  try {
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (stored && (stored.startsWith("mock-") || !isLikelyJwt(stored))) {
      window.localStorage.removeItem(TOKEN_KEY);
      currentToken = null;
    } else {
      currentToken = stored;
    }
  } catch {
    currentToken = null;
  }
}

export function getToken(): string | null {
  return currentToken;
}

export function setToken(t: string): void {
  currentToken = t;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(TOKEN_KEY, t);
    } catch {
      /* ignore */
    }
  }
}

export function clearToken(): void {
  currentToken = null;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  }
}

/* ------------------------------------------------------------------ */
/* Back-compat aliases for existing call-sites                         */
/* ------------------------------------------------------------------ */

export const setAuthToken = (t: string | null): void => {
  if (t) setToken(t);
  else clearToken();
};
export const getAuthToken = getToken;

/* ------------------------------------------------------------------ */
/* Unauthorized (401) handler                                          */
/* ------------------------------------------------------------------ */

let onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(fn: () => void): void {
  onUnauthorized = fn;
}

export function triggerUnauthorized(): void {
  clearToken();
  onUnauthorized?.();
}

/* ------------------------------------------------------------------ */
/* Core request                                                        */
/* ------------------------------------------------------------------ */

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: "omit",
      headers,
    });
  } catch (networkErr) {
    throw new ApiError(
      networkErr instanceof Error ? networkErr.message : "Network error",
      [],
      0,
    );
  }

  if (res.status === 401) {
    triggerUnauthorized();
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  let json: Partial<ApiEnvelope<T>> & { message?: string; errors?: string[] };
  try {
    json = (await res.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError(
      `Invalid JSON response (${res.status})`,
      [],
      res.status,
    );
  }

  if (!res.ok || !json.success) {
    throw new ApiError(
      json.message ?? "Something went wrong",
      json.errors ?? [],
      res.status,
    );
  }

  return json.data as T;
}

/* ------------------------------------------------------------------ */
/* Public api                                                          */
/* ------------------------------------------------------------------ */

export const api = {
  get<T = unknown>(path: string, options: RequestInit = {}) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T = unknown>(path: string, body?: unknown, options: RequestInit = {}) {
    return request<T>(path, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  put<T = unknown>(path: string, body?: unknown, options: RequestInit = {}) {
    return request<T>(path, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  patch<T = unknown>(path: string, body?: unknown, options: RequestInit = {}) {
    return request<T>(path, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
  delete<T = unknown>(path: string, options: RequestInit = {}) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};

/* ------------------------------------------------------------------ */
/* Compatibility helpers retained for existing services                */
/* ------------------------------------------------------------------ */

/** Identity passthrough — `api.*` already returns the unwrapped data. */
export function unwrap<T>(value: T | { data: T }): T {
  if (value && typeof value === "object" && "data" in (value as object)) {
    return (value as { data: T }).data;
  }
  return value as T;
}

/**
 * Many backend list endpoints return Spring-style pagination
 * (`{ content: [...], totalElements, ... }`). Use this to coerce either
 * shape down to a plain array, or `[]` if the response is malformed.
 */
export function unwrapList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && Array.isArray((value as { content?: unknown }).content)) {
    return (value as { content: T[] }).content;
  }
  return [];
}

export function fakeResolve<T>(value: T, delayMs = 0): Promise<T> {
  if (delayMs <= 0) return Promise.resolve(value);
  return new Promise((res) => setTimeout(() => res(value), delayMs));
}
