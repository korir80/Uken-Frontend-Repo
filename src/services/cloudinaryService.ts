import { api } from "./api";

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
  async upload(file: File, folder: string): Promise<string> {
    validateUploadFile(file);

    const signData = await api.post<SignData>("/cloudinary/sign", { folder });

    // Only timestamp and public_id are signed on the backend.
    // Do NOT add folder as a separate param — it is already embedded
    // inside public_id and adding it separately breaks the signature.
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
};
