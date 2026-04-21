/**
 * Shared Axios instance for the Ukena Spring Boot backend.
 *
 * Wires up:
 *  - baseURL from VITE_API_BASE_URL
 *  - Bearer token from the auth token store (kept framework-agnostic
 *    so the AuthProvider can register/clear it without circular imports)
 *  - 401 interceptor that clears auth and triggers a /signin redirect
 *
 * The Spring Boot team should respond with the standard envelope:
 *   { success: boolean, data: any, message: string, errors: [] }
 * — `unwrap()` below normalises that to just `data`.
 */
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

const baseURL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8080/api";

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // allow httpOnly cookie-based sessions when backend opts in
  headers: { "Content-Type": "application/json" },
});

/* ------------------------------------------------------------------ */
/* Token store — populated by AuthProvider, read by request interceptor */
/* ------------------------------------------------------------------ */

let currentToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  currentToken = token;
}

export function registerUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

/* ------------------------------------------------------------------ */
/* Interceptors                                                        */
/* ------------------------------------------------------------------ */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (currentToken && config.headers) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      currentToken = null;
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

/**
 * Unwrap the standard Spring Boot envelope. Falls back to the raw body
 * if the backend returns a bare payload (useful during early dev).
 */
export function unwrap<T>(response: AxiosResponse<ApiEnvelope<T> | T>): T {
  const body = response.data as ApiEnvelope<T> | T;
  if (body && typeof body === "object" && "success" in (body as object)) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}
