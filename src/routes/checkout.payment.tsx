import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart, formatGBP } from "@/lib/cart";
import { useCreateOrder } from "@/lib/queries";

export const Route = createFileRoute("/checkout/payment")({
  component: PaymentStep,
});

function PaymentStep() {
  const navigate = useNavigate();
  const { delivery, items, placeOrder, totalPence } = useCart();
  const createOrder = useCreateOrder();

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
        <h1 className="mt-3 font-display text-[28px] leading-[1.1] tracking-tight text-charcoal md:text-[34px]">
          We need your delivery details first
        </h1>
        <Link
          to="/checkout/delivery"
          className="mt-6 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
        >
          ← Back to delivery
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!delivery || items.length === 0) return;
    setSubmitting(true);

    // 1. Persist the order on the server (Spring Boot once live; mock today).
    //    The mutation invalidates ['orders','buyer'] on success so the buyer
    //    dashboard picks up the new row immediately.
    let serverOrderId: string | undefined;
    try {
      const created = await createOrder.mutateAsync({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        delivery,
      });
      serverOrderId = created.id;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "We couldn't place your order. Please try again.";
      toast.error(msg);
      setSubmitting(false);
      return;
    }

    // 2. Snapshot the order locally (with the server id) so the confirmation
    //    page can deep-link to /account/orders/:id. When Stripe lands this is
    //    where confirmCardPayment() will go (between API + local snapshot).
    const local = placeOrder({ id: serverOrderId });
    if (!local) {
      setSubmitting(false);
      return;
    }
    toast.success("Order placed — your maker has been notified.");
    navigate({ to: "/checkout/confirmation" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <header>
        <div className="flex items-center gap-3">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
            Step two
          </p>
          <span className="rounded-full border border-terracotta/30 bg-terracotta-soft/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">
            Demo
          </span>
        </div>
        <h1 className="mt-3 font-display text-[28px] leading-[1.1] tracking-tight text-charcoal md:text-[34px]">
          Payment
        </h1>
        <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-ink-muted">
          This card form is for demonstration only — no card is charged. Real
          payments are processed server-side once the backend is live.
        </p>
      </header>

      {/* Delivery recap */}
      {delivery && (
        <section className="rounded-xl border border-border/70 bg-cream p-5">
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
          <p className="mt-3 text-[13px] leading-relaxed text-charcoal/85">
            <span className="font-medium text-charcoal">
              {delivery.fullName}
            </span>
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
      <fieldset className="space-y-5">
        <legend className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Card details
        </legend>
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
        <div className="grid grid-cols-2 gap-5">
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
            placeholder="MM/YY"
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
        <Field
          label="Name on card"
          name="holder"
          value={card.holder}
          onChange={(v) => setCard((c) => ({ ...c, holder: v }))}
          required
          autoComplete="cc-name"
        />
      </fieldset>

      <p className="inline-flex items-start gap-2 text-[11px] leading-relaxed text-charcoal/40">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Demo checkout — no card is charged and no card details leave your
          browser. Live payments will be handled by the backend.
        </span>
      </p>

      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center rounded-md bg-terracotta px-8 text-[14px] font-medium tracking-wide text-warm-white transition-all hover:bg-[oklch(0.52_0.13_38)] disabled:opacity-70"
        >
          {submitting
            ? "Placing your order…"
            : `Place order · ${formatGBP(totalPence)}`}
        </button>
      </div>
    </form>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Field primitive (matches delivery step styling for consistency)
// ───────────────────────────────────────────────────────────────────────────

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
      <span className="text-[13px] font-medium text-charcoal">
        {label}
        {required && <span className="ml-0.5 text-terracotta">*</span>}
      </span>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="mt-1.5 h-11 w-full rounded-md border border-border bg-warm-white px-4 text-[14px] text-charcoal placeholder:text-ink-muted/60 focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
      />
    </label>
  );
}
