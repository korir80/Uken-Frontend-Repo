import { useState } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_PHOTOS = 5;

/**
 * UI-only photo uploader. No upload logic — Phase 6 will wire this to
 * Lovable Cloud storage. We keep blob URLs purely for in-page preview.
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
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_PHOTOS - value.length;
    if (remaining <= 0) return;
    const next = Array.from(files)
      .slice(0, remaining)
      .map((f) => URL.createObjectURL(f));
    onChange([...value, ...next]);
  };

  const removeAt = (i: number) => {
    const next = [...value];
    const [removed] = next.splice(i, 1);
    if (removed) URL.revokeObjectURL(removed);
    onChange(next);
  };

  const slotsLeft = MAX_PHOTOS - value.length;

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
            key={src}
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
              type="file"
              accept="image/*"
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

      <p className="text-[12px] uppercase tracking-[0.2em] text-ink-muted">
        {value.length} of {MAX_PHOTOS} added
      </p>
    </div>
  );
}
