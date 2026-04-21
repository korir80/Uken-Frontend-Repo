import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useCart, type DeliveryDetails } from "@/lib/cart";

export const Route = createFileRoute("/checkout/delivery")({
  component: DeliveryStep,
});

function DeliveryStep() {
  const navigate = useNavigate();
  const { delivery, setDelivery } = useCart();

  const [form, setForm] = useState<DeliveryDetails>(
    delivery ?? {
      fullName: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
      country: "United Kingdom",
    },
  );

  const update = <K extends keyof DeliveryDetails>(
    key: K,
    value: DeliveryDetails[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDelivery(form);
    navigate({ to: "/checkout/payment" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <header>
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Step one
        </p>
        <h1 className="mt-4 font-display text-[36px] leading-[1.05] tracking-tight text-charcoal md:text-[44px]">
          Where shall we send it?
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-muted">
          We deliver across the UK. Pieces are made to order, then packed by
          hand in Nairobi before they travel to you.
        </p>
      </header>

      <fieldset className="space-y-6">
        <legend className="sr-only">Your details</legend>
        <Field
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={(v) => update("fullName", v)}
          required
          autoComplete="name"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          required
          autoComplete="email"
          hint="We'll send you a quiet update when your piece is on its way."
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Delivery address
        </legend>
        <Field
          label="Address line 1"
          name="addressLine1"
          value={form.addressLine1}
          onChange={(v) => update("addressLine1", v)}
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
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Town or city"
            name="city"
            value={form.city}
            onChange={(v) => update("city", v)}
            required
            autoComplete="address-level2"
          />
          <Field
            label="Postcode"
            name="postcode"
            value={form.postcode}
            onChange={(v) => update("postcode", v.toUpperCase())}
            required
            autoComplete="postal-code"
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] text-ink-muted">
          Your details are used only to fulfil this order.
        </p>
        <button
          type="submit"
          className="inline-flex h-13 items-center justify-center rounded-md bg-charcoal px-8 text-[15px] font-medium tracking-wide text-warm-white transition-all hover:bg-charcoal/90"
        >
          Continue to payment →
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  autoComplete,
  hint,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 h-12 w-full rounded-md border border-border bg-warm-white px-4 text-[15px] text-charcoal placeholder:text-ink-muted/60 focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
      />
      {hint && <p className="mt-2 text-[12px] text-ink-muted">{hint}</p>}
    </label>
  );
}
