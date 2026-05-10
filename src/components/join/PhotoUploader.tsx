import { useRef, useState } from "react";
import { Camera, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  cloudinaryService,
  validateUploadFile,
} from "@/services/cloudinaryService";

const MAX_PHOTOS = 5;

/**
 * Photo uploader for the artisan application. Uploads each file directly to
 * Cloudinary (browser → Cloudinary, never through the Spring backend) and
 * surfaces the resulting public URLs to the parent. In dev without
 * Cloudinary creds it falls back to local blob previews so the form is still
 * testable end-to-end.
 */
export function PhotoUploader({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper?: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [busyCount, setBusyCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const slotsLeft = MAX_PHOTOS - value.length;

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const list = Array.from(files).slice(0, slotsLeft);
    if (list.length === 0) return;

    try {
      list.forEach((f) => validateImageFile(f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid file.");
      return;
    }

    if (!isCloudinaryConfigured()) {
      // Dev fallback — keep the form usable without creds.
      const next = list.map((f) => URL.createObjectURL(f));
      onChange([...value, ...next]);
      return;
    }

    setBusyCount((c) => c + list.length);
    try {
      const uploaded = await Promise.all(
        list.map((f) => uploadToCloudinary(f, { folder: "ukena/applications" })),
      );
      onChange([...value, ...uploaded.map((u) => u.url)]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusyCount((c) => Math.max(0, c - list.length));
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(i: number) {
    const next = [...value];
    const [removed] = next.splice(i, 1);
    if (removed?.startsWith("blob:")) URL.revokeObjectURL(removed);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="block font-display text-[24px] leading-tight text-charcoal md:text-[28px]">
          {label}
        </p>
        {helper && (
          <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
            {helper}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {value.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="group relative aspect-square overflow-hidden rounded-xl bg-cream"
          >
            <img
              src={src}
              alt={`Upload ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-warm-white/95 text-charcoal opacity-0 shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:opacity-100 hover:bg-terracotta hover:text-warm-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <span className="absolute bottom-2 left-2 font-display text-base text-warm-white drop-shadow">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}

        {Array.from({ length: busyCount }).map((_, i) => (
          <div
            key={`busy-${i}`}
            className="grid aspect-square place-items-center rounded-xl border border-dashed border-border bg-cream/50"
          >
            <Loader2 className="h-5 w-5 animate-spin text-clay" />
          </div>
        ))}

        {slotsLeft - busyCount > 0 && (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "group relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center transition-all duration-300",
              dragOver
                ? "border-terracotta bg-terracotta-soft/20"
                : "border-border bg-cream/50 hover:border-clay/60 hover:bg-cream",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="sr-only"
              onChange={(e) => addFiles(e.target.files)}
            />
            <Camera className="h-5 w-5 text-clay/80" />
            <span className="px-3 text-[11px] uppercase tracking-[0.2em] text-ink-muted">
              Add a photo
            </span>
          </label>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] uppercase tracking-[0.2em] text-ink-muted">
          {value.length} of {MAX_PHOTOS} added
        </p>
        {!isCloudinaryConfigured() && (
          <p className="text-[11px] text-ink-muted">
            Dev mode — local preview only.
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-[12px] text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
