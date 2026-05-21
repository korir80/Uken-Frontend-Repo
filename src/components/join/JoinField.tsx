import { cn } from "@/lib/utils";
import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from "react";

/* ---------- Shared label + helper ---------- */

interface FieldShellProps {
  label: string;
  helper?: string;
  children: ReactNode;
  htmlFor?: string;
}

function FieldShell({ label, helper, children, htmlFor }: FieldShellProps) {
  return (
    <div className="space-y-3">
      <label
        htmlFor={htmlFor}
        className="block font-display text-[24px] leading-tight text-charcoal md:text-[28px]"
      >
        {label}
      </label>
      {helper && (
        <p className="text-[14px] leading-relaxed text-ink-muted">{helper}</p>
      )}
      {children}
    </div>
  );
}

/* ---------- Text input ---------- */

interface JoinInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
}

export const JoinInput = forwardRef<HTMLInputElement, JoinInputProps>(
  ({ label, helper, className, id, ...props }, ref) => {
    return (
      <FieldShell label={label} helper={helper} htmlFor={id}>
        <input
          ref={ref}
          id={id}
          className={cn(
            "block w-full min-h-[48px] border-0 border-b border-border bg-transparent px-0 py-3",
            "font-sans text-[16px] text-charcoal placeholder:text-ink-muted/55 md:text-[18px]",
            "transition-colors duration-300 ease-out",
            "focus:border-terracotta focus:outline-none focus:ring-0",
            className,
          )}
          {...props}
        />
      </FieldShell>
    );
  },
);
JoinInput.displayName = "JoinInput";

/* ---------- Textarea ---------- */

interface JoinTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helper?: string;
}

export const JoinTextarea = forwardRef<HTMLTextAreaElement, JoinTextareaProps>(
  ({ label, helper, className, id, ...props }, ref) => {
    return (
      <FieldShell label={label} helper={helper} htmlFor={id}>
        <textarea
          ref={ref}
          id={id}
          rows={4}
          className={cn(
            "w-full resize-none border-0 border-b border-border bg-transparent px-0 py-3",
            "font-sans text-[16px] leading-relaxed text-charcoal placeholder:text-ink-muted/55",
            "transition-colors duration-300 ease-out",
            "focus:border-terracotta focus:outline-none focus:ring-0",
            className,
          )}
          {...props}
        />
      </FieldShell>
    );
  },
);
JoinTextarea.displayName = "JoinTextarea";

/* ---------- Pill select (for craft) ---------- */

interface JoinPillSelectProps {
  label: string;
  helper?: string;
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
}

export function JoinPillSelect({
  label,
  helper,
  options,
  value,
  onChange,
}: JoinPillSelectProps) {
  const isCustom = value.length > 0 && !options.includes(value);
  return (
    <FieldShell label={label} helper={helper}>
      <div className="flex flex-wrap gap-2 pt-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-5 py-2.5 text-[13px] font-medium tracking-wide transition-all duration-300 ease-out",
                active
                  ? "border-terracotta bg-terracotta text-warm-white"
                  : "border-border/80 bg-warm-white text-charcoal/80 hover:border-terracotta/60 hover:text-terracotta",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div className="pt-4">
        <label className="block text-[12px] uppercase tracking-[0.18em] text-ink-muted">
          Or tell us in your own words
        </label>
        <input
          type="text"
          value={isCustom ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Gourd carving, natural dyeing, basket repair…"
          className={cn(
            "mt-2 block w-full min-h-[44px] border-0 border-b border-border bg-transparent px-0 py-2",
            "font-sans text-[16px] text-charcoal placeholder:text-ink-muted/55",
            "transition-colors duration-300 ease-out",
            "focus:border-terracotta focus:outline-none focus:ring-0",
          )}
        />
      </div>
    </FieldShell>
  );
}
