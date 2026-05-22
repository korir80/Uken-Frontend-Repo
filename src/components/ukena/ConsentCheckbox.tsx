import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface ConsentCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  /** Override the default copy. */
  label?: ReactNode;
  error?: string | null;
  className?: string;
}

/**
 * Soft, friendly DPA-2019 consent checkbox.
 * Unchecked by default (explicit consent), but written so it doesn't feel legalistic.
 */
export function ConsentCheckbox({
  id = "ukena-consent",
  checked,
  onChange,
  label,
  error,
  className,
}: ConsentCheckboxProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-cream/30 px-3 py-2.5 text-[12.5px] leading-relaxed text-charcoal/75 transition-colors hover:border-clay/50"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-terracotta"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span>
          {label ?? (
            <>
              I'm happy for UKEN to use these details to get back to me,
              kept private as set out in our{" "}
              <Link
                to="/privacy"
                className="underline decoration-clay/40 underline-offset-2 hover:text-clay"
                target="_blank"
              >
                Privacy Notice
              </Link>
              .
            </>
          )}
        </span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
