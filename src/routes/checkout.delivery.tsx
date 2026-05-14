import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCart, type DeliveryDetails } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { deliveryZoneService, type DeliveryZoneDto } from "@/services/deliveryZoneService";
import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/payment";
import { handleApiError } from "@/lib/handleApiError";
import { formatGBP } from "@/lib/cart";

export const Route = createFileRoute("/checkout/delivery")({
  component: DeliveryStep,
});

interface FormState extends DeliveryDetails {
  phone?: string;
  zoneId: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.fullName.trim()) errors.fullName = "Please tell us your name.";
  if (!form.email.trim()) errors.email = "We need an email to send your confirmation.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "That doesn't look like a valid email.";
  if (!form.zoneId) errors.zoneId = "Please choose a delivery zone.";
  if (!form.addressLine1.trim()) errors.addressLine1 = "Address is required.";
  if (!form.city.trim()) errors.city = "Please add a town or city.";
  if (!form.postcode.trim()) errors.postcode = "Postcode is required.";
  if (!form.country.trim()) errors.country = "Country is required.";
  return errors;
}

function DeliveryStep() {
  const { delivery, items, selectedZone, setDelivery, setZone } = useCart();
  const { user, isAuthenticated } = useAuth();

  const zonesQuery = useQuery({
    queryKey: ["delivery-zones"],
    queryFn: () => deliveryZoneService.list(),
    staleTime: 5 * 60_000,
  });
  const zones = zonesQuery.data ?? [];

  const [form, setForm] = useState<FormState>(() => ({
    fullName: delivery?.fullName ?? user?.fullName ?? "",
    email: delivery?.email ?? user?.email ?? "",
    phone: delivery?.phone ?? "",
    zoneId: selectedZone?.id ?? "",
    addressLine1: delivery?.addressLine1 ?? "",
    addressLine2: delivery?.addressLine2 ?? "",
    city: delivery?.city ?? "",
    postcode: delivery?.postcode ?? "",
    country: delivery?.country ?? selectedZone?.country ?? "",
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from logged-in user once it loads.
  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.fullName || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const groupedZones = useMemo(() => {
    const map = new Map<string, DeliveryZoneDto[]>();
    for (const z of zones) {
      if (!map.has(z.country)) map.set(z.country, []);
      map.get(z.country)!.push(z);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [zones]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onZoneChange = (zoneId: string) => {
    const z = zones.find((x) => x.id === zoneId);
    if (z) {
      setForm((prev) => ({ ...prev, zoneId, country: z.country }));
      setZone({ id: z.id, name: z.name, country: z.country, shippingPence: z.shippingPence });
    } else {
      setForm((prev) => ({ ...prev, zoneId: "" }));
      setZone(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    if (items.length === 0) return;

    const deliveryDetails: DeliveryDetails = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() || undefined,
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2?.trim() || undefined,
      city: form.city.trim(),
      postcode: form.postcode.trim(),
      country: form.country.trim(),
    };
    setDelivery(deliveryDetails);

    setSubmitting(true);
    try {
      const order = await orderService.createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        delivery: deliveryDetails,
        deliveryZoneId: form.zoneId,
        ...(isAuthenticated
          ? {}
          : { guestEmail: deliveryDetails.email, guestFullName: deliveryDetails.fullName }),
      });

      const init = await paymentService.initiate(
        order.displayId,
        isAuthenticated ? undefined : deliveryDetails.email,
      );

      // Persist for the confirmation page in case the gateway strips query params.
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            "ukena.lastOrder",
            JSON.stringify({
              displayId: order.displayId,
              email: deliveryDetails.email,
              isGuest: !isAuthenticated,
            }),
          );
        } catch {
          /* ignore */
        }
      }

      window.location.href = init.paymentLink;
    } catch (err) {
      handleApiError(err);
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">Almost there</p>
        <h1 className="mt-3 font-display text-[28px] leading-[1.1] tracking-tight text-charcoal md:text-[34px]">
          Your bag is empty
        </h1>
        <Link to="/shop" className="mt-6 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep">
          ← Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <header>
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">Checkout</p>
        <h1 className="mt-3 font-display text-[28px] leading-[1.1] tracking-tight text-charcoal md:text-[34px]">
          Where shall we send it?
        </h1>
        <p className="mt-3 max-w-md text-[13px] font-light leading-relaxed text-charcoal/65">
          Pieces are made to order, then packed by hand in Nairobi before they travel to you.
        </p>
      </header>

      <fieldset className="space-y-5">
        <legend className="sr-only">Your details</legend>
        <Field label="Full name" name="fullName" value={form.fullName} onChange={(v) => update("fullName", v)} error={errors.fullName} required autoComplete="name" />
        <Field label="Email address" name="email" type="email" value={form.email} onChange={(v) => update("email", v)} error={errors.email} required autoComplete="email" hint="We'll send your confirmation here." />
        <Field label="Phone number (optional)" name="phone" type="tel" value={form.phone ?? ""} onChange={(v) => update("phone", v)} autoComplete="tel" />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">Delivery zone</legend>

        <label className="block">
          <span className="text-[13px] font-medium text-charcoal">
            Delivery zone<span className="ml-0.5 text-terracotta">*</span>
          </span>
          <select
            value={form.zoneId}
            onChange={(e) => onZoneChange(e.target.value)}
            disabled={zonesQuery.isLoading}
            required
            className={
              "mt-1.5 h-11 w-full rounded-md border bg-warm-white px-3 text-[14px] text-charcoal focus:outline-none focus:ring-2 " +
              (errors.zoneId
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "border-border focus:border-clay focus:ring-clay/20")
            }
          >
            <option value="">{zonesQuery.isLoading ? "Loading zones…" : "Select a delivery zone"}</option>
            {groupedZones.map(([country, list]) => (
              <optgroup key={country} label={country}>
                {list.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} — {formatGBP(z.shippingPence)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {zonesQuery.isError && (
            <p className="mt-1.5 text-[12px] text-destructive">
              Couldn't load delivery zones.{" "}
              <button type="button" onClick={() => zonesQuery.refetch()} className="underline">
                Retry
              </button>
            </p>
          )}
          {errors.zoneId && <p className="mt-1.5 text-[12px] text-destructive">{errors.zoneId}</p>}
        </label>

        <Field label="Address line 1" name="addressLine1" value={form.addressLine1} onChange={(v) => update("addressLine1", v)} error={errors.addressLine1} required autoComplete="address-line1" />
        <Field label="Address line 2 (optional)" name="addressLine2" value={form.addressLine2 ?? ""} onChange={(v) => update("addressLine2", v)} autoComplete="address-line2" />
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="City" name="city" value={form.city} onChange={(v) => update("city", v)} error={errors.city} required autoComplete="address-level2" />
          <Field label="Postcode" name="postcode" value={form.postcode} onChange={(v) => update("postcode", v.toUpperCase())} error={errors.postcode} required autoComplete="postal-code" />
        </div>
        <Field label="Country" name="country" value={form.country} onChange={(v) => update("country", v)} error={errors.country} required autoComplete="country-name" />
      </fieldset>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting || zonesQuery.isLoading || !form.zoneId}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-terracotta px-8 text-[14px] font-medium tracking-wide text-warm-white transition-all hover:bg-[oklch(0.52_0.13_38)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {submitting ? "Securing your payment…" : "Continue to payment →"}
        </button>
        <p className="mt-3 text-center text-[11px] text-ink-muted">
          You'll be redirected to our secure payment partner.
        </p>
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
  error?: string;
}

function Field({ label, name, type = "text", value, onChange, required, autoComplete, hint, error }: FieldProps) {
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
