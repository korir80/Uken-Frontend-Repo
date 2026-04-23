import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Footer slot (sticky) — typically Apply / Reset buttons. */
  footer?: ReactNode;
}

/**
 * BottomSheet — mobile-only modal that slides up from the bottom edge.
 * Used for "Filter & Sort" and any other touch-first picker on <md.
 * Includes scrim, drag handle, sticky footer, and Escape-to-close.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: BottomSheetProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[70] md:hidden",
        open ? "" : "pointer-events-none",
      )}
    >
      {/* Scrim */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-charcoal/55 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-warm-white shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.35)] transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-y-0" : "translate-y-full",
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-charcoal/15" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pb-2 pt-3">
            <h2 className="font-display text-2xl text-charcoal">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-11 w-11 place-items-center rounded-full text-charcoal/70 hover:bg-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 pt-2">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-border/60 bg-warm-white px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
