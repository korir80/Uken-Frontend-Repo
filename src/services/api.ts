/**
 * Uken HTTP client.
 *
 * Real fetch-based implementation that talks to the Java Spring Boot
 * backend documented in BACKEND_SPEC.md.
 *
 * Behaviour:
 * - Reads the base URL from `VITE_API_BASE_URL` (e.g. http://localhost:8080/api).
 * - Attaches `Authorization: Bearer <token>` when a JWT is set via
 *   {@link setAuthToken}.
 * - Sends `Content-Type: application/json` for JSON bodies.
 * - Unwraps the standard Spring Boot envelope `{ success, data, message, errors }`
 *   so service callers receive the inner payload directly.
 * - On HTTP 401 it clears the in-memory token and invokes any handler
 *   registered through {@link registerUnauthorizedHandler} — typically the
 *   AuthProvider, which boots the user back to /signin.
 *
 * A mock-fallback flag is exposed for development: `VITE_USE_MOCK_API=true`
 * lets every service short-circuit to the seed data shipped in the repo so
 * the app is fully usable before the Spring Boot service is reachable.
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

export class ApiError extends Error {
  status: number;
  errors?: string[];
  constructor(message: string, status: number, errors?: string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8080/api";

/**
 * When true, every service falls back to its in-repo seed data instead of
 * calling the backend. Defaults to true in development so the app keeps
 * working before Spring Boot is up. Flip to "false" in `.env.production`
 * (or once the backend is reachable in dev) to exercise the real API.
 */
export const USE_MOCK_API: boolean =
  String(import.meta.env.VITE_USE_MOCK_API ?? "true").toLowerCase() === "true";

/* ------------------------------------------------------------------ */
/* Token store                                                         */
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

export function triggerUnauthorized() {
  currentToken = null;
  onUnauthorized?.();
}

/* ------------------------------------------------------------------ */
/* Core request                                                        */
/* ------------------------------------------------------------------ */

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  /** Pass FormData/Blob etc. to skip JSON serialisation. */
  raw?: boolean;
  /** Override `credentials` (defaults to `include` for cookie-based auth). */
  credentials?: RequestCredentials;
  /** Skip envelope unwrap — useful if a future endpoint returns a bare list. */
  rawResponse?: boolean;
  signal?: AbortSignal;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<ApiResponse<T>> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers ?? {}),
  };
  if (currentToken) headers.Authorization = `Bearer ${currentToken}`;

  let body: BodyInit | undefined;
  if (opts.body !== undefined && opts.body !== null) {
    if (opts.raw) {
      body = opts.body as BodyInit;
    } else {
      headers["Content-Type"] = headers["Content-Type"] ?? "application/json";
      body = JSON.stringify(opts.body);
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? "GET",
      headers,
      body,
      credentials: opts.credentials ?? "include",
      signal: opts.signal,
    });
  } catch (networkErr) {
    throw new ApiError(
      networkErr instanceof Error ? networkErr.message : "Network error",
      0,
    );
  }

  if (res.status === 401) {
    triggerUnauthorized();
  }

  // 204 No Content
  if (res.status === 204) {
    return { data: undefined as unknown as T, status: 204 };
  }

  let parsed: unknown = null;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      parsed = await res.json();
    } catch {
      parsed = null;
    }
  } else {
    parsed = await res.text();
  }

  if (!res.ok) {
    const env = parsed as Partial<ApiEnvelope<unknown>> | null;
    const message =
      (env && typeof env === "object" && env.message) ||
      (typeof parsed === "string" && parsed) ||
      `Request failed (${res.status})`;
    throw new ApiError(String(message), res.status, env?.errors);
  }

  if (opts.rawResponse) {
    return { data: parsed as T, status: res.status };
  }

  // Unwrap envelope when present.
  if (
    parsed &&
    typeof parsed === "object" &&
    "success" in (parsed as object) &&
    "data" in (parsed as object)
  ) {
    return { data: (parsed as ApiEnvelope<T>).data, status: res.status };
  }

  return { data: parsed as T, status: res.status };
}

export const api = {
  get<T = unknown>(path: string, opts?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...opts, method: "GET" });
  },
  post<T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...opts, method: "POST", body });
  },
  put<T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...opts, method: "PUT", body });
  },
  patch<T = unknown>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...opts, method: "PATCH", body });
  },
  delete<T = unknown>(path: string, opts?: Omit<RequestOptions, "method" | "body">) {
    return request<T>(path, { ...opts, method: "DELETE" });
  },
  /** Multipart upload helper. */
  upload<T = unknown>(path: string, file: File, fieldName = "file") {
    const fd = new FormData();
    fd.append(fieldName, file);
    return request<T>(path, { method: "POST", body: fd, raw: true });
  },
};

/** Compatibility helper kept for existing call-sites — `api` already unwraps. */
export function unwrap<T>(response: { data: ApiEnvelope<T> | T }): T {
  const body = response.data as ApiEnvelope<T> | T;
  if (body && typeof body === "object" && "success" in (body as object) && "data" in (body as object)) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

/** Used by mock branches to mimic network latency without forcing it. */
export function fakeResolve<T>(value: T, delayMs = 0): Promise<T> {
  if (delayMs <= 0) return Promise.resolve(value);
  return new Promise((res) => setTimeout(() => res(value), delayMs));
}
