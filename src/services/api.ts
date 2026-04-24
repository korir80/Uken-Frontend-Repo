/**
 * Frontend-only stub of the API layer.
 *
 * The real backend is a separate Java Spring Boot project that will live
 * on Railway. Until that backend is reachable, this module fakes the
 * shape of the future API so call-sites don't have to change when we wire
 * the real HTTP client back in.
 *
 * Future swap path:
 *   1. Re-introduce axios (or fetch) inside `request()` below.
 *   2. Point `baseURL` at the Railway-hosted Spring Boot service.
 *   3. Delete the seed-resolver branches.
 *
 * The Spring Boot envelope that will replace the stubbed responses:
 *   { success: boolean, data: any, message: string, errors: [] }
 * `unwrap()` already handles either the bare body or the envelope so
 * existing services continue to compile.
 */

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

/* ------------------------------------------------------------------ */
/* Token store — kept so AuthProvider can compile without changes      */
/* ------------------------------------------------------------------ */

let currentToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  currentToken = token;
}

export function getAuthToken() {
  return currentToken;
}

export function registerUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

/** Test hook so a service stub can simulate a 401 if it ever needs to. */
export function triggerUnauthorized() {
  currentToken = null;
  onUnauthorized?.();
}

/* ------------------------------------------------------------------ */
/* Stubbed transport                                                   */
/* ------------------------------------------------------------------ */

/**
 * `api` keeps a tiny axios-like surface so service files can keep their
 * existing shape. None of these methods touch the network — services in
 * this folder build their own fake responses from local seed data.
 */
export const api = {
  async get<T = unknown>(_path: string, _config?: unknown): Promise<ApiResponse<T>> {
    throw new Error(
      "api.get is a stub. Service modules should resolve from seed data " +
        "rather than calling api.get directly while the Spring Boot backend " +
        "is not yet wired.",
    );
  },
  async post<T = unknown>(_path: string, _body?: unknown, _config?: unknown): Promise<ApiResponse<T>> {
    throw new Error(
      "api.post is a stub. Service modules should resolve from seed data.",
    );
  },
  async put<T = unknown>(_path: string, _body?: unknown, _config?: unknown): Promise<ApiResponse<T>> {
    throw new Error(
      "api.put is a stub. Service modules should resolve from seed data.",
    );
  },
  async delete<T = unknown>(_path: string, _config?: unknown): Promise<ApiResponse<T>> {
    throw new Error(
      "api.delete is a stub. Service modules should resolve from seed data.",
    );
  },
};

/**
 * Same signature as before so call sites in the service files keep working.
 * Accepts the future Spring Boot envelope or a bare payload.
 */
export function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const body = response.data as ApiEnvelope<T> | T;
  if (body && typeof body === "object" && "success" in (body as object)) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

/** Helper for stub services to mimic network latency without forcing it. */
export function fakeResolve<T>(value: T, delayMs = 0): Promise<T> {
  if (delayMs <= 0) return Promise.resolve(value);
  return new Promise((res) => setTimeout(() => res(value), delayMs));
}
