/**
 * Cloudinary direct browser upload (unsigned).
 *
 * The frontend uploads images directly to Cloudinary so we never tie up the
 * Spring Boot backend with multipart streams. The backend only ever sees the
 * resulting public URL (and optionally the `public_id`) as a plain string,
 * which it stores against products, applications, and creator portraits.
 *
 * Setup (one-time, in your Cloudinary dashboard → Settings → Upload):
 *   1. Note your **cloud name** (e.g. "ukena-prod").
 *   2. Create an **unsigned upload preset** (e.g. "ukena_unsigned").
 *      Recommended preset settings:
 *        - Signing Mode: Unsigned
 *        - Folder: "ukena/"
 *        - Allowed formats: jpg,jpeg,png,webp,avif
 *        - Max file size: ~10 MB
 *        - Use filename: false  /  Unique filename: true
 *        - Eager transformations (optional): w_1600,c_limit,q_auto,f_auto
 *
 * Wire the values into the frontend via env vars:
 *   VITE_CLOUDINARY_CLOUD_NAME=ukena-prod
 *   VITE_CLOUDINARY_UPLOAD_PRESET=ukena_unsigned
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
  | string
  | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
  | string
  | undefined;

export interface CloudinaryUploadResult {
  /** Public, CDN-served URL — what we hand to the backend. */
  url: string;
  /** Stable identifier inside Cloudinary (good for deletion / transformations). */
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  resourceType?: "image" | "raw" | "video";
}

export class CloudinaryConfigError extends Error {
  constructor() {
    super(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your env.",
    );
    this.name = "CloudinaryConfigError";
  }
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
}

/**
 * Validate a single file before sending — fail fast with helpful errors.
 * Defaults match the recommended preset above.
 */
export function validateImageFile(
  file: File,
  opts: { maxBytes?: number; allowed?: string[] } = {},
): void {
  const maxBytes = opts.maxBytes ?? 10 * 1024 * 1024; // 10 MB
  const allowed = opts.allowed ?? [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];
  if (!allowed.includes(file.type)) {
    throw new Error(
      `Unsupported file type ${file.type || "(unknown)"}. Use JPEG, PNG, WebP, or AVIF.`,
    );
  }
  if (file.size > maxBytes) {
    const mb = (maxBytes / (1024 * 1024)).toFixed(0);
    throw new Error(`File is too large. Max ${mb} MB.`);
  }
}

/**
 * Upload a single file to Cloudinary. Resolves with the public URL +
 * metadata. Optionally reports progress (0–1) via `onProgress`.
 *
 * Uses XHR (not fetch) so we can stream upload-progress events.
 */
export function uploadToCloudinary(
  file: File,
  opts: {
    folder?: string;
    onProgress?: (pct: number) => void;
    signal?: AbortSignal;
  } = {},
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(new CloudinaryConfigError());
  }
  validateImageFile(file);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET as string);
  if (opts.folder) fd.append("folder", opts.folder);

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    if (opts.signal) {
      const abort = () => xhr.abort();
      if (opts.signal.aborted) abort();
      else opts.signal.addEventListener("abort", abort, { once: true });
    }

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && opts.onProgress) {
        opts.onProgress(ev.loaded / ev.total);
      }
    };

    xhr.onerror = () =>
      reject(new Error("Network error while uploading to Cloudinary."));
    xhr.onabort = () => reject(new Error("Upload cancelled."));

    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            url: body.secure_url ?? body.url,
            publicId: body.public_id,
            width: body.width,
            height: body.height,
            format: body.format,
            bytes: body.bytes,
            resourceType: body.resource_type,
          });
        } else {
          reject(
            new Error(
              body?.error?.message ??
                `Cloudinary upload failed (${xhr.status})`,
            ),
          );
        }
      } catch {
        reject(new Error(`Cloudinary upload failed (${xhr.status})`));
      }
    };

    xhr.send(fd);
  });
}

/** Convenience: upload many files in parallel. Stops at first failure. */
export async function uploadManyToCloudinary(
  files: File[],
  opts: { folder?: string } = {},
): Promise<CloudinaryUploadResult[]> {
  return Promise.all(files.map((f) => uploadToCloudinary(f, opts)));
}
