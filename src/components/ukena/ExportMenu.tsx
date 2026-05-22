import { useEffect, useRef, useState } from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

interface ExportMenuProps {
  /** Disabled when there's nothing to export. */
  disabled?: boolean;
  onPdf: () => void;
  onCsv: () => void;
  label?: string;
}

/**
 * Small dropdown used across dashboards for "Export → PDF / CSV".
 * Kept intentionally minimal — no portal, closes on outside click.
 */
export function ExportMenu({ disabled, onPdf, onCsv, label = "Export" }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-warm-white px-4 py-2 font-sans text-[12px] font-medium text-charcoal transition-colors hover:border-clay/60 hover:text-clay disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-3.5 w-3.5" />
        {label}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-xl border border-border/70 bg-warm-white shadow-lg">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onPdf();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-sans text-[13px] text-charcoal transition-colors hover:bg-cream/70"
          >
            <FileText className="h-4 w-4 text-terracotta" />
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onCsv();
            }}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-sans text-[13px] text-charcoal transition-colors hover:bg-cream/70"
          >
            <FileSpreadsheet className="h-4 w-4 text-clay" />
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
}
