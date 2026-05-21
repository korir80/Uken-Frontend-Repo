import { api, getToken } from "./api";

interface SignData {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;
  uploadUrl: string;
}

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024;

export function validateUploadFile(file: File): void {
  if (!ALLOWED.includes(file.type)) {
    throw new Error("Only JPEG, PNG, or WebP images are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File is too large. Max 8 MB.");
  }
}

export const cloudinaryService = {
  /**
   * Upload a file to Cloudinary via a signed request from the backend.
   * folder must be "applications" for unauthenticated callers (apply form).
   * Authenticated callers (creators, admins) may use any folder.
   */
  async upload(file: File, folder: string): Promise<string> {
    validateUploadFile(file);
    const signData = await api.post<SignData>("/cloudinary/sign", { folder });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signData.signature);
    formData.append("timestamp", String(signData.timestamp));
    formData.append("api_key", signData.apiKey);
    formData.append("public_id", signData.publicId);
    const res = await fetch(signData.uploadUrl, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error?.message ?? "Upload failed");
    }
    return json.secure_url as string;
  },

  /**
   * Delete an image from Cloudinary by its publicId.
   * Silently skips if the user is not authenticated (apply form context).
   * publicId is extracted from the full Cloudinary URL by the caller.
   */
  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;
    // The DELETE /cloudinary/image endpoint requires CREATOR or ADMIN role.
    // On the public apply form there is no token — skip server deletion.
    // The image will be cleaned up by a scheduled Cloudinary folder policy.
    if (!getToken()) return;
    try {
      await api.delete("/cloudinary/image", {
        body: JSON.stringify({ publicId }),
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // Non-fatal — UI state is already updated by the caller.
    }
  },

  /**
   * Extract the Cloudinary public_id from a full secure URL.
   * e.g. https://res.cloudinary.com/demo/image/upload/v123/applications/abc.jpg
   * → applications/abc
   */
  extractPublicId(url: string): string | null {
    if (!url || url.startsWith("blob:")) return null;
    try {
      const marker = "/image/upload/";
      const idx = url.indexOf(marker);
      if (idx === -1) return null;
      let path = url.substring(idx + marker.length);
      if (/^v\d+\//.test(path)) path = path.substring(path.indexOf("/") + 1);
      const dot = path.lastIndexOf(".");
      return dot > 0 ? path.substring(0, dot) : path;
    } catch {
      return null;
    }
  },
};
