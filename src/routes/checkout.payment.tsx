import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout/payment")({
  component: PaymentStep,
});

function PaymentStep() {
  const navigate = useNavigate();
  const { delivery, items, placeOrder, uniqueCreators } = useCart();

  const [card, setCard] = useState({
    holder: "",
    number: "",
    expiry: "",
    cvc: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // If buyer skipped step 1, send them back.
  if (!delivery && items.length > 0) {
    return (
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Almost there
        </p>
        <h1 className="mt-4 font-display text-[36px] leading-[1.05] tracking-tight text-charcoal md:text-[44px]">
          We need your delivery details first
        </h1>
        <Link
          to="/checkout/delivery"
          className="mt-8 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
        >
          ← Back to delivery
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // UI-only — no payment processing. Phase 6 will wire Stripe / Spring.
    window.setTimeout(() => {
      const order = placeOrder();
      if (order) {
        navigate({ to: "/checkout/confirmation" });
      } else {
        setSubmitting(false);
      }
    }, 600);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <header>
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Step two
        </p>
        <h1 className="mt-4 font-display text-[36px] leading-[1.05] tracking-tight text-charcoal md:text-[44px]">
          Payment
        </h1>
        <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-ink-muted">
          <Lock className="h-3.5 w-3.5" /> Card details are not stored.
        </p>
      </header>

      {/* Delivery recap */}
      {delivery && (
        <section className="rounded-2xl border border-border/70 bg-cream p-6">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              Delivering to
            </p>
            <Link
              to="/checkout/delivery"
              className="text-[11px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
            >
              Edit
            </Link>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-charcoal/85">
            <span className="font-medium text-charcoal">{delivery.fullName}</span>
            <br />
            {delivery.addressLine1}
            {delivery.addressLine2 ? `, ${delivery.addressLine2}` : ""}
            <br />
            {delivery.city}, {delivery.postcode}
            <br />
            {delivery.country}
          </p>
        </section>
      )}

      {/* Card fields */}
      <fieldset className="space-y-6">
        <legend className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Card details
        </legend>
        <Field
          label="Name on card"
          name="holder"
          value={card.holder}
          onChange={(v) => setCard((c) => ({ ...c, holder: v }))}
          required
          autoComplete="cc-name"
        />
        <Field
          label="Card number"
          name="number"
          value={card.number}
          onChange={(v) =>
            setCard((c) => ({
              ...c,
              number: v.replace(/[^\d ]/g, "").slice(0, 19),
            }))
          }
          placeholder="1234 5678 9012 3456"
          required
          inputMode="numeric"
          autoComplete="cc-number"
        />
        <div className="grid grid-cols-2 gap-6">
          <Field
            label="Expiry (MM/YY)"
            name="expiry"
            value={card.expiry}
            onChange={(v) =>
              setCard((c) => ({
                ...c,
                expiry: v.replace(/[^\d/]/g, "").slice(0, 5),
              }))
            }
            placeholder="08/27"
            required
            inputMode="numeric"
            autoComplete="cc-exp"
          />
          <Field
            label="CVC"
            name="cvc"
            value={card.cvc}
            onChange={(v) =>
              setCard((c) => ({
                ...c,
                cvc: v.replace(/\D/g, "").slice(0, 4),
              }))
            }
            placeholder="123"
            required
            inputMode="numeric"
            autoComplete="cc-csc"
          />
        </div>
      </fieldset>

      <div className="space-y-5 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-13 w-full items-center justify-center rounded-md bg-terracotta px-8 text-[15px] font-medium tracking-wide text-warm-white transition-all hover:bg-[oklch(0.52_0.13_38)] disabled:opacity-70"
        >
          {submitting ? "Placing your order…" : "Place order"}
        </button>

        {uniqueCreators.length > 0 && (
          <p className="text-center text-[13px] leading-relaxed text-ink-muted">
            Your purchase directly supports{" "}
            {uniqueCreators.map((c, i) => (
              <span key={c.id} className="text-charcoal">
                {c.fullName}
                {i < uniqueCreators.length - 2
                  ? ", "
                  : i === uniqueCreators.length - 2
                    ? " and "
                    : ""}
              </span>
            ))}
            .
          </p>
        )}
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric";
}

function Field({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  autoComplete,
  inputMode,
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="mt-2 h-12 w-full rounded-md border border-border bg-warm-white px-4 text-[15px] text-charcoal placeholder:text-ink-muted/60 focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
      />
    </label>
  );
}
