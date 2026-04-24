import { useRef, useState } from "react";
import { ImagePlus, Loader2, X, AlertCircle } from "lucide-react";
import {
  uploadToCloudinary,
  validateImageFile,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

/**
 * Cloudinary-direct image picker. Pure presentation + upload — never touches
 * the backend. Caller owns the URL list and gets a callback whenever it
 * changes.
 *
 * Falls back to local blob URLs in dev when Cloudinary isn't configured, so
 * the UI stays testable.
 */
export function CloudinaryImagePicker({
  value,
  onChange,
  max = 5,
  folder = "ukena",
  label,
  helper,
  multiple = true,
  className,
  aspect = "square",
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  folder?: string;
  label?: string;
  helper?: string;
  multiple?: boolean;
  className?: string;
  aspect?: "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busyCount, setBusyCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const slotsLeft = max - value.length;

  const aspectCls = aspect === "wide" ? "aspect-[4/3]" : "aspect-square";

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const list = Array.from(files).slice(0, slotsLeft);
    if (list.length === 0) return;

    // Validate all up front so we don't half-upload a bad batch.
    try {
      list.forEach((f) => validateImageFile(f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid file.");
      return;
    }

    if (!isCloudinaryConfigured()) {
      // Dev fallback — local previews. Backend gets these URLs only in mock mode.
      const next = list.map((f) => URL.createObjectURL(f));
      onChange([...value, ...next]);
      return;
    }

    setBusyCount((c) => c + list.length);
    try {
      const uploaded = await Promise.all(
        list.map((f) => uploadToCloudinary(f, { folder })),
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
    <div className={cn("space-y-3", className)}>
      {label && (
        <div>
          <p className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal/55">
            {label}
          </p>
          {helper && (
            <p className="mt-1 font-sans text-[12px] text-charcoal/55">
              {helper}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className={cn(
              "group relative overflow-hidden rounded-xl bg-cream",
              aspectCls,
            )}
          >
            <img
              src={src}
              alt={`Image ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remove image ${i + 1}`}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-warm-white/95 text-charcoal opacity-0 shadow-soft transition-all duration-300 group-hover:opacity-100 hover:bg-terracotta hover:text-warm-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-2 left-2 rounded-full bg-charcoal/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-warm-white">
                Cover
              </span>
            )}
          </div>
        ))}

        {Array.from({ length: busyCount }).map((_, i) => (
          <div
            key={`busy-${i}`}
            className={cn(
              "grid place-items-center rounded-xl border border-dashed border-border bg-cream/50",
              aspectCls,
            )}
          >
            <Loader2 className="h-5 w-5 animate-spin text-clay" />
          </div>
        ))}

        {slotsLeft - busyCount > 0 && (
          <label
            className={cn(
              "group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-cream/40 text-center transition hover:border-clay/60 hover:bg-cream",
              aspectCls,
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple={multiple}
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <ImagePlus className="h-5 w-5 text-clay/80" />
            <span className="px-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">
              Add image
            </span>
          </label>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/45">
          {value.length} of {max} added
        </p>
        {!isCloudinaryConfigured() && (
          <p className="font-sans text-[11px] text-charcoal/45">
            Dev mode — local preview only.
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 font-sans text-[12px] text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
