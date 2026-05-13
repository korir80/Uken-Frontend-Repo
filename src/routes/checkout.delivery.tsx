import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useCart, type DeliveryDetails } from "@/lib/cart";

export const Route = createFileRoute("/checkout/delivery")({
  component: DeliveryStep,
});

interface FormState extends DeliveryDetails {
  phone?: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const COUNTRIES = [
  "United Kingdom",
  "Ireland",
  "France",
  "Germany",
  "Netherlands",
  "Spain",
  "Italy",
  "United States",
] as const;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Please tell us your name.";
  if (!form.email.trim()) {
    errors.email = "We need an email to send your confirmation.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "That doesn't look like a valid email.";
  }
  if (!form.addressLine1.trim()) errors.addressLine1 = "Address is required.";
  if (!form.city.trim()) errors.city = "Please add a town or city.";
  if (!form.postcode.trim()) errors.postcode = "Postcode is required.";
  if (!form.country.trim()) errors.country = "Please select a country.";
  return errors;
}

function DeliveryStep() {
  const navigate = useNavigate();
  const { delivery, setDelivery } = useCart();

  const [form, setForm] = useState<FormState>(
    delivery ?? {
      fullName: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
      country: "United Kingdom",
      phone: "",
    },
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validateField = (key: keyof FormState) => {
    const next = validate(form);
    setErrors((prev) => ({ ...prev, [key]: next[key] }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setDelivery(form);
    navigate({ to: "/checkout/payment" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <header>
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Step one
        </p>
        <h1 className="mt-3 font-display text-[28px] leading-[1.1] tracking-tight text-charcoal md:text-[34px]">
          Where shall we send it?
        </h1>
        <p className="mt-3 max-w-md text-[13px] font-light leading-relaxed text-charcoal/65">
          We deliver across the UK and beyond. Pieces are made to order, then
          packed by hand in Nairobi before they travel to you.
        </p>
      </header>

      <fieldset className="space-y-5">
        <legend className="sr-only">Your details</legend>
        <Field
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={(v) => update("fullName", v)}
          onBlur={() => validateField("fullName")}
          error={errors.fullName}
          required
          autoComplete="name"
        />
        <Field
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          onBlur={() => validateField("email")}
          error={errors.email}
          required
          autoComplete="email"
          hint="We'll send a quiet update when your piece is on its way."
        />
        <Field
          label="Phone number (optional)"
          name="phone"
          type="tel"
          value={form.phone ?? ""}
          onChange={(v) => update("phone", v)}
          autoComplete="tel"
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Delivery address
        </legend>
        <Field
          label="Address line 1"
          name="addressLine1"
          value={form.addressLine1}
          onChange={(v) => update("addressLine1", v)}
          onBlur={() => validateField("addressLine1")}
          error={errors.addressLine1}
          required
          autoComplete="address-line1"
        />
        <Field
          label="Address line 2 (optional)"
          name="addressLine2"
          value={form.addressLine2 ?? ""}
          onChange={(v) => update("addressLine2", v)}
          autoComplete="address-line2"
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="City"
            name="city"
            value={form.city}
            onChange={(v) => update("city", v)}
            onBlur={() => validateField("city")}
            error={errors.city}
            required
            autoComplete="address-level2"
          />
          <Field
            label="Postcode"
            name="postcode"
            value={form.postcode}
            onChange={(v) => update("postcode", v.toUpperCase())}
            onBlur={() => validateField("postcode")}
            error={errors.postcode}
            required
            autoComplete="postal-code"
          />
        </div>
        <SelectField
          label="Country"
          name="country"
          value={form.country}
          onChange={(v) => update("country", v)}
          options={COUNTRIES}
          required
        />
      </fieldset>

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-md bg-terracotta px-8 text-[14px] font-medium tracking-wide text-warm-white transition-all hover:bg-[oklch(0.52_0.13_38)]"
        >
          Continue to payment →
        </button>
        <p className="mt-3 text-center text-[11px] text-ink-muted">
          Your details are used only to fulfil this order.
        </p>
      </div>
    </form>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Form primitives
// ───────────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  error?: string;
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  required,
  autoComplete,
  hint,
  error,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-charcoal">
        {label}
        {required && <span className="ml-0.5 text-terracotta">*</span>}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={
          "mt-1.5 h-11 w-full rounded-md border bg-warm-white px-4 text-[14px] text-charcoal placeholder:text-ink-muted/60 focus:outline-none focus:ring-2 " +
          (error
            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
            : "border-border focus:border-clay focus:ring-clay/20")
        }
      />
      {error ? (
        <p className="mt-1.5 text-[12px] text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-ink-muted">{hint}</p>
      ) : null}
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-charcoal">
        {label}
        {required && <span className="ml-0.5 text-terracotta">*</span>}
      </span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1.5 h-11 w-full rounded-md border border-border bg-warm-white px-3 text-[14px] text-charcoal focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
