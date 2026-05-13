import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Printer } from "lucide-react";
import { Footer } from "@/components/home/Footer";
import { useCart, formatGBP } from "@/lib/cart";
import { safeImg } from "@/lib/safeImage";

// TODO: read order from orderService response (orderService.getOrder(id))
// once real orders are placed via POST /api/orders.
// For now we read from cart context's `lastOrder` snapshot.
export const Route = createFileRoute("/checkout/confirmation")({
  head: () => ({
    meta: [
      { title: "Thank you — UKEN" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { lastOrder, clearCart } = useCart();

  // Belt-and-braces: placeOrder already empties items, but we ensure any
  // residual state (e.g. stale delivery on a hard reload) is wiped once
  // the buyer reaches confirmation. Spring Boot wiring will replace this
  // with a server-authoritative order fetch + local clear.
  useEffect(() => {
    if (lastOrder) clearCart();
    // Intentionally no deps — run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-warm-white">
        <SlimHeader />
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
            Nothing to confirm
          </p>
          <h1 className="mt-6 font-display text-4xl text-charcoal">
            No recent order found
          </h1>
          <Link
            to="/explore"
            className="mt-8 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
          >
            ← Back to the makers
          </Link>
        </div>
      </div>
    );
  }

  const buyerFirstName =
    lastOrder.delivery.fullName.split(" ")[0] ?? lastOrder.delivery.fullName;

  // Group items by creator so the acknowledgement can read naturally.
  const byCreator = new Map<
    string,
    { creator: (typeof lastOrder.items)[number]["creator"]; productName: string }
  >();
  for (const item of lastOrder.items) {
    if (!byCreator.has(item.creator.id)) {
      byCreator.set(item.creator.id, {
        creator: item.creator,
        productName: item.name,
      });
    }
  }
  const creatorRows = Array.from(byCreator.values());

  // Format an issue date for the printed receipt. We avoid relying on
  // server-issued createdAt here because the cart-side `lastOrder` doesn't
  // carry one yet — Spring Boot wiring will replace this with order.createdAt.
  const issuedAt = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const delivery = lastOrder.delivery;

  return (
    <div className="min-h-screen bg-warm-white text-charcoal print:bg-white">
      <SlimHeader />

      <main
        id="confirmation-receipt"
        className="mx-auto max-w-[640px] px-6 py-16 md:py-24 print:max-w-none print:px-10 print:py-8"
      >
        {/* Animated check (hidden on print) */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-clay/10 text-clay print:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12.5L10 17.5L19 7.5" />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-center print:mt-0 print:text-left"
        >
          {/* Wordmark only shows on print so receipts read like a brand document */}
          <p className="hidden font-display text-3xl tracking-tight text-charcoal print:block">
            UKEN
          </p>
          <h1 className="font-display text-[36px] italic leading-[1.1] text-charcoal print:mt-4 print:text-2xl print:not-italic">
            <span className="print:hidden">Thank you, {buyerFirstName}.</span>
            <span className="hidden print:inline">Order receipt</span>
          </h1>
          <p className="mt-3 text-[14px] font-light leading-relaxed text-charcoal/60 print:hidden">
            Your piece is now being prepared with care.
          </p>
        </motion.div>

        {/* Order header — number + date. Visible on screen too so buyers can quote it. */}
        <section className="mt-8 grid gap-4 rounded-xl border border-border/60 bg-warm-white px-5 py-4 sm:grid-cols-3 print:mt-6 print:rounded-none print:border-x-0 print:border-t-0 print:bg-transparent print:px-0 print:py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55">
              Order
            </p>
            <p className="mt-1 font-mono text-[13px] text-charcoal">
              {lastOrder.id}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55">
              Issued
            </p>
            <p className="mt-1 text-[13px] text-charcoal">{issuedAt}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55">
              Buyer
            </p>
            <p className="mt-1 text-[13px] text-charcoal">{delivery.fullName}</p>
            <p className="text-[12px] text-charcoal/65">{delivery.email}</p>
          </div>
        </section>

        {/* Creator acknowledgement (hidden on print — it's a screen-only delight) */}
        <section className="mt-10 space-y-3 print:hidden">
          {creatorRows.map(({ creator, productName }) => (
            <div
              key={creator.id}
              className="flex items-center gap-3 rounded-lg bg-cream/70 px-4 py-3"
            >
              <CreatorAvatar creatorId={creator.id} name={creator.fullName} />
              <p className="text-[13px] leading-snug text-charcoal">
                <Link
                  to="/creators/$creatorId"
                  params={{ creatorId: creator.id }}
                  className="font-medium text-charcoal underline-offset-4 hover:underline"
                >
                  {creator.fullName}
                </Link>{" "}
                is preparing your{" "}
                <span className="text-charcoal/85">{productName}</span> in{" "}
                {creator.region}, Kenya.
              </p>
            </div>
          ))}
        </section>

        {/* Order detail strip — printable line items */}
        <section className="mt-8 rounded-xl bg-cream/80 p-5 print:mt-6 print:rounded-none print:bg-transparent print:p-0">
          <p className="hidden text-[10px] uppercase tracking-[0.22em] text-charcoal/55 print:block">
            Items
          </p>
          <ul className="space-y-3 print:mt-2 print:space-y-2 print:divide-y print:divide-border/60">
            {lastOrder.items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center gap-3 print:py-2"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-warm-white print:hidden">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-charcoal">
                    {item.name}{" "}
                    <span className="text-ink-muted">× {item.quantity}</span>
                  </p>
                  <p className="hidden text-[11px] text-charcoal/55 print:block">
                    by {item.creator.fullName} · {item.creator.region}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] tabular-nums text-charcoal/85">
                  {formatGBP(item.pricePence * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-3 text-[13px]">
            <span className="text-charcoal/70">Total paid</span>
            <span className="font-medium text-charcoal">
              {formatGBP(lastOrder.totalPence)}
            </span>
          </div>
          <p className="mt-2 text-[12px] text-ink-muted">
            Estimated delivery 7–14 days
          </p>
        </section>

        {/* Delivery address — printed for shipping reference */}
        <section className="mt-8 print:mt-6">
          <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55">
            Delivery to
          </p>
          <address className="mt-2 not-italic text-[13px] leading-relaxed text-charcoal">
            <div>{delivery.fullName}</div>
            <div>{delivery.addressLine1}</div>
            {delivery.addressLine2 && <div>{delivery.addressLine2}</div>}
            <div>
              {delivery.city}
              {delivery.postcode ? `, ${delivery.postcode}` : ""}
            </div>
            {delivery.country && <div>{delivery.country}</div>}
          </address>
        </section>

        {/* What happens next (screen only) */}
        <section className="mt-10 print:hidden">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
            What happens next
          </p>
          <ol className="mt-4 space-y-3">
            <NextStep
              n={1}
              text={`${creatorRows[0]?.creator.fullName.split(" ")[0] ?? "Your maker"} is notified and begins final preparation.`}
            />
            <NextStep
              n={2}
              text="Your piece is carefully packaged and handed to our shipping partner."
            />
            <NextStep
              n={3}
              text="It arrives at your door in 7–14 working days."
            />
          </ol>
        </section>

        {/* Buttons (screen only) */}
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-charcoal/20 px-6 text-[14px] font-medium text-charcoal transition-colors hover:border-clay hover:bg-cream"
          >
            <Printer className="h-4 w-4" />
            Print receipt
          </button>
          <Link
            to="/account/orders/$orderId"
            params={{ orderId: lastOrder.id }}
            className="inline-flex h-11 items-center justify-center rounded-md bg-terracotta px-6 text-[14px] font-medium text-warm-white transition-all hover:bg-[oklch(0.52_0.13_38)]"
          >
            View your order
          </Link>
          <Link
            to="/explore"
            className="inline-flex h-11 items-center justify-center rounded-md px-6 text-[14px] font-medium text-charcoal transition-colors hover:bg-cream"
          >
            Explore more makers
          </Link>
        </div>

        {/* Bottom email note (screen only) */}
        <p className="mt-8 text-center text-[11px] text-charcoal/35 print:hidden">
          A confirmation email is on its way to {delivery.email}.
        </p>

        {/* Print-only footer with brand mark */}
        <footer className="hidden print:mt-12 print:block print:border-t print:border-border/60 print:pt-4 print:text-[11px] print:text-charcoal/55">
          <p>UKEN · ukena.co.uk · Thank you for supporting Kenyan makers.</p>
        </footer>
      </main>

      <Footer />

      {/* Print stylesheet — strip chrome, tighten layout, neutralise the
          warm-white background so the receipt prints as plain ink on paper. */}
      <style>{`
        @media print {
          @page { margin: 14mm; }
          html, body { background: #ffffff !important; }
          /* Hide top SlimHeader + bottom Footer so the print is just the receipt. */
          body > * { visibility: hidden; }
          #confirmation-receipt, #confirmation-receipt * { visibility: visible; }
          #confirmation-receipt { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

function SlimHeader() {
  return (
    <header className="border-b border-border/60 bg-warm-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          to="/"
          className="font-display text-2xl tracking-tight text-charcoal"
        >
          UKEN
        </Link>
      </div>
    </header>
  );
}

function CreatorAvatar({
  creatorId,
  name,
}: {
  creatorId: string;
  name: string;
}) {
  // Try to pull the portrait from the products dataset (cheap lookup);
  // fall back to initials if not found.
  // We avoid an extra service call here — once Spring Boot wiring exists,
  // the order payload itself will carry creator portraits.
  const initial = name.charAt(0);
  return (
    <div
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay/15 text-[13px] font-medium text-clay"
      aria-hidden
      title={creatorId}
    >
      {initial}
    </div>
  );
}

function NextStep({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex gap-3 text-[13px] leading-relaxed text-charcoal/70">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-clay/10 text-[10px] font-medium text-clay">
        {n}
      </span>
      <span>{text}</span>
    </li>
  );
}
