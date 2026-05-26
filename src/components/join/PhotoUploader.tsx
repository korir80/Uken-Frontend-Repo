import { useRef, useState } from "react";
import { Camera, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { cloudinaryService, validateUploadFile } from "@/services/cloudinaryService";

const MAX_PHOTOS = 5;

/**
 * Each slot tracks its own state so multiple files can upload in parallel
 * with individual previews and spinners.
 */
interface PhotoSlot {
  /** Local blob URL shown immediately for preview. */
  preview: string;
  /** Cloudinary secure_url once upload completes; null while uploading. */
  url: string | null;
  uploading: boolean;
  error: string | null;
}

export function PhotoUploader({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper?: string;
  /** Committed Cloudinary URLs owned by the parent form. */
  value: string[];
  /** Called only with fully-uploaded Cloudinary URLs. */
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [slots, setSlots] = useState<PhotoSlot[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const uploadedCount = value.length;
  const pendingCount = slots.filter((s) => s.uploading).length;
  const totalShown = uploadedCount + slots.length;
  const slotsLeft = MAX_PHOTOS - totalShown;

  function updateSlot(preview: string, patch: Partial<PhotoSlot>) {
    setSlots((prev) => prev.map((s) => (s.preview === preview ? { ...s, ...patch } : s)));
  }

  async function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setGlobalError(null);

    const list = Array.from(files).slice(0, slotsLeft);
    if (list.length === 0) return;

    try {
      list.forEach((f) => validateUploadFile(f));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid file.";
      setGlobalError(msg);
      toast.error(msg);
      return;
    }

    // Create local previews immediately so the user sees feedback at once.
    const newSlots: PhotoSlot[] = list.map((f) => ({
      preview: URL.createObjectURL(f),
      url: null,
      uploading: true,
      error: null,
    }));
    setSlots((prev) => [...prev, ...newSlots]);

    if (inputRef.current) inputRef.current.value = "";

    // Upload each file independently so one failure doesn't block others.
    await Promise.allSettled(
      list.map(async (file, i) => {
        const preview = newSlots[i].preview;
        try {
          const url = await cloudinaryService.upload(file, "applications");
          updateSlot(preview, { url, uploading: false });
          // Promote to parent state.
          onChange([...value, url]);
          // Release the blob URL now that Cloudinary URL is confirmed.
          URL.revokeObjectURL(preview);
          // Remove this slot — parent value now owns it.
          setSlots((prev) => prev.filter((s) => s.preview !== preview));
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Upload failed.";
          updateSlot(preview, { uploading: false, error: msg });
          toast.error(msg);
        }
      }),
    );
  }

  /** Remove an already-uploaded Cloudinary URL. */
  async function removeUploaded(index: number) {
    const url = value[index];
    const next = value.filter((_, i) => i !== index);
    onChange(next);
    // Fire-and-forget deletion — non-fatal if it fails.
    const publicId = cloudinaryService.extractPublicId(url);
    if (publicId) void cloudinaryService.deleteImage(publicId);
  }

  /** Remove a pending/failed slot before it commits. */
  function removePending(preview: string) {
    URL.revokeObjectURL(preview);
    setSlots((prev) => prev.filter((s) => s.preview !== preview));
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal/55">
          {label}
        </p>
        {helper && (
          <p className="mt-1 font-sans text-[12px] text-charcoal/55">{helper}</p>
        )}
      </div>


      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {/* Committed uploads */}
        {value.map((src, i) => (
          <div key={src} className="group relative aspect-square overflow-hidden rounded-xl bg-cream">
            <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeUploaded(i)}
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

        {/* In-flight / failed slots */}
        {slots.map((slot) => (
          <div key={slot.preview} className="group relative aspect-square overflow-hidden rounded-xl bg-cream">
            <img
              src={slot.preview}
              alt="Uploading…"
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                slot.uploading && "opacity-60",
              )}
            />
            {slot.uploading && (
              <div className="absolute inset-0 grid place-items-center bg-charcoal/10">
                <Loader2 className="h-6 w-6 animate-spin text-warm-white drop-shadow" />
              </div>
            )}
            {slot.error && (
              <div className="absolute inset-0 grid place-items-center bg-destructive/20 p-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            )}
            <button
              type="button"
              onClick={() => removePending(slot.preview)}
              aria-label="Remove"
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-warm-white/95 text-charcoal opacity-0 shadow-[var(--shadow-soft)] transition-all duration-300 group-hover:opacity-100 hover:bg-terracotta hover:text-warm-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {/* Add slot */}
        {slotsLeft > 0 && (
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
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(e) => addFiles(e.target.files)}
            />
            <Camera className="h-5 w-5 text-clay/80" />
            <span className="px-3 text-[11px] uppercase tracking-[0.2em] text-ink-muted">Add a photo</span>
          </label>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] uppercase tracking-[0.2em] text-ink-muted">
          {uploadedCount} of {MAX_PHOTOS} added
          {pendingCount > 0 && <span className="ml-2 text-clay">· uploading {pendingCount}…</span>}
        </p>
      </div>

      {globalError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-[12px] text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {globalError}
        </p>
      )}
    </div>
  );
}
