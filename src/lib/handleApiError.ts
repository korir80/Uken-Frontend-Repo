/**
 * Shared API error handler.
 *
 * Implements the project-wide error rules so every component can call one
 * function and get consistent toasts + field-level mapping.
 *
 * Rules covered:
 *  - errors[].length > 0 → one toast per item (or routed to fields when the
 *    item is shaped "field: message")
 *  - errors[].length === 0 → toast(error.message)
 *  - 401 → clearToken + toast "Session expired, please sign in again"
 *          (the AuthProvider's registered handler also redirects to /signin)
 *  - 403 → "You don't have permission to do this"
 *  - 409 → toast(error.message)
 *  - 400/422 → parse errors[] into field map (caller decides where to render)
 *  - 500 → "Something went wrong on our end. Please try again."
 *  - status 0 (fetch threw) → "Could not reach the server. Check your connection."
 *
 * Forms can pass `overrides` to short-circuit specific statuses (e.g. login
 * 401 = wrong creds, render under password field, no toast, no redirect).
 */
import { toast } from "sonner";
import { ApiError, clearToken } from "@/services/api";

export interface FieldErrors {
  /** Errors keyed by field name (e.g. { email: ["Already registered"] }). */
  fields: Record<string, string[]>;
  /** Errors that didn't match the "field: message" shape. */
  general: string[];
}

const EMPTY_FIELD_ERRORS: FieldErrors = { fields: {}, general: [] };

/** Parse "field: message" strings into a field map. */
export function parseFieldErrors(errors: readonly string[] | undefined): FieldErrors {
  const result: FieldErrors = { fields: {}, general: [] };
  if (!errors) return result;

  for (const raw of errors) {
    const item = String(raw);
    const idx = item.indexOf(":");
    if (idx > 0 && idx < 64) {
      const field = item.slice(0, idx).trim();
      const message = item.slice(idx + 1).trim();
      // Accept simple identifiers like `email`, `delivery.city`, `items[0].qty`.
      if (field && message && /^[a-zA-Z][\w.[\]]*$/.test(field)) {
        (result.fields[field] ||= []).push(message);
        continue;
      }
    }
    result.general.push(item);
  }
  return result;
}

export type StatusKey = number | "network" | "default";

export interface HandleApiErrorOptions {
  /**
   * Per-status override. Return `true` to skip the default behavior for that
   * status entirely (no default toast, no default redirect).
   */
  overrides?: Partial<Record<StatusKey, (err: ApiError) => boolean | void>>;
  /** Called with parsed field errors (always — even when status isn't 400/422). */
  onFieldErrors?: (fields: FieldErrors) => void;
  /** Suppress all default toasts; useful for forms rendering errors inline. */
  silent?: boolean;
}

/**
 * Centralised error handler. Returns the parsed field errors (or null when
 * the error wasn't an ApiError / had no `errors[]`).
 */
export function handleApiError(
  err: unknown,
  opts: HandleApiErrorOptions = {},
): FieldErrors {
  const { overrides = {}, onFieldErrors, silent } = opts;

  if (!(err instanceof ApiError)) {
    if (!silent) {
      toast.error(err instanceof Error ? err.message : "Unexpected error");
    }
    return EMPTY_FIELD_ERRORS;
  }

  const parsed = parseFieldErrors(err.errors);

  // Per-status override hook fires first.
  const statusKey: StatusKey = err.status === 0 ? "network" : err.status;
  const ov = overrides[statusKey] ?? overrides.default;
  if (ov) {
    onFieldErrors?.(parsed);
    if (ov(err) === true) return parsed;
  }

  switch (err.status) {
    case 0:
      if (!silent) toast.error("Could not reach the server. Check your connection.");
      break;

    case 401:
      // AuthProvider's registered unauthorized handler already clears token
      // and redirects to /signin. We clear defensively + toast as a backup.
      clearToken();
      if (!silent) toast.error("Session expired, please sign in again");
      break;

    case 403:
      if (!silent) toast.error("You don't have permission to do this");
      break;

    case 409:
      if (!silent) toast.error(err.message);
      break;

    case 400:
    case 422:
      onFieldErrors?.(parsed);
      if (!silent) {
        if (parsed.general.length) {
          parsed.general.forEach((m) => toast.error(m));
        } else if (!Object.keys(parsed.fields).length) {
          toast.error(err.message);
        }
      }
      return parsed;

    case 500:
      if (!silent) toast.error("Something went wrong on our end. Please try again.");
      break;

    default:
      // Generic fallback — honour the errors[]/message rules.
      if (err.errors && err.errors.length > 0) {
        onFieldErrors?.(parsed);
        if (!silent) {
          const lines = parsed.general.length ? parsed.general : err.errors;
          lines.forEach((m) => toast.error(m));
        }
      } else if (!silent) {
        toast.error(err.message);
      }
      break;
  }

  return parsed;
}
