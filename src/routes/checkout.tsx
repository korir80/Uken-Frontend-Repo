import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Footer } from "@/components/home/Footer";
import { useCart, formatGBP } from "@/lib/cart";
import { CreatorAttribution } from "@/components/product/CreatorAttribution";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Ukena" },
      { name: "description", content: "Complete your Ukena purchase." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutLayout,
});

function CheckoutLayout() {
  const { items, subtotalPence, shippingPence, totalPence, lastOrder } = useCart();
  const location = useLocation();

  // If the bag is empty AND we're not on the confirmation flow, send the
  // buyer back to /bag — checkout makes no sense without items.
  useEffect(() => {
    if (items.length === 0 && !lastOrder && typeof window !== "undefined") {
      // Avoid redirecting if buyer is already on the bag page (defensive).
      if (!location.pathname.endsWith("/bag")) {
        // Soft redirect via location, since this is a UI-only flow.
        window.location.replace("/bag");
      }
    }
  }, [items.length, lastOrder, location.pathname]);

  const step = location.pathname.includes("/payment") ? 2 : 1;

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      {/* Slim, focused header — no nav distractions during checkout */}
      <header className="border-b border-border/60 bg-warm-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link
            to="/"
            className="font-display text-3xl tracking-tight text-charcoal"
          >
            Ukena
          </Link>
          <Link
            to="/bag"
            className="text-[12px] uppercase tracking-[0.22em] text-ink-muted hover:text-clay"
          >
            ← Back to bag
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:px-10 md:pb-32 md:pt-16">
        <CheckoutSteps current={step} />

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7">
            <Outlet />
          </div>

          <aside className="md:col-span-5">
            <div className="md:sticky md:top-10 rounded-2xl border border-border/70 bg-cream p-7 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
                Order summary
              </p>

              {items.length > 0 ? (
                <ul className="mt-6 space-y-5 border-b border-border/70 pb-6">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-warm-white">
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-[17px] text-charcoal">
                          {item.name}
                        </p>
                        <div className="mt-0.5">
                          <CreatorAttribution
                            creator={item.creator}
                            variant="inline"
                          />
                        </div>
                        <p className="mt-1 text-[12px] text-ink-muted">
                          Qty {item.quantity}
                        </p>
                      </div>
                      <span className="text-[14px] text-charcoal/85">
                        {formatGBP(item.pricePence * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-[14px] text-ink-muted">
                  Your bag is empty.
                </p>
              )}

              <dl className="mt-6 space-y-3 text-[14px]">
                <Row label="Subtotal" value={formatGBP(subtotalPence)} />
                <Row
                  label="Shipping"
                  value={
                    shippingPence === 0
                      ? "Free"
                      : formatGBP(shippingPence)
                  }
                />
              </dl>

              <div className="mt-5 flex items-baseline justify-between border-t border-border/70 pt-5">
                <span className="text-[12px] uppercase tracking-[0.22em] text-ink-muted">
                  Total
                </span>
                <span className="font-display text-3xl text-charcoal">
                  {formatGBP(totalPence)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CheckoutSteps({ current }: { current: 1 | 2 }) {
  const steps = [
    { n: 1, label: "Delivery", to: "/checkout/delivery" as const },
    { n: 2, label: "Payment", to: "/checkout/payment" as const },
  ];
  return (
    <ol className="flex items-center gap-6 text-[12px] uppercase tracking-[0.22em]">
      {steps.map((s, i) => {
        const active = s.n === current;
        const done = s.n < current;
        return (
          <li key={s.n} className="flex items-center gap-6">
            <span
              className={cn(
                "inline-flex items-center gap-3",
                active
                  ? "text-charcoal"
                  : done
                    ? "text-clay"
                    : "text-ink-muted/70",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full border text-[11px] tabular-nums",
                  active
                    ? "border-charcoal bg-charcoal text-warm-white"
                    : done
                      ? "border-clay bg-clay text-warm-white"
                      : "border-border text-ink-muted",
                )}
              >
                {s.n}
              </span>
              {s.label}
            </span>
            {i === 0 && (
              <span className="h-px w-10 bg-border/80" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-charcoal/80">{label}</dt>
      <dd className="text-charcoal">{value}</dd>
    </div>
  );
}
