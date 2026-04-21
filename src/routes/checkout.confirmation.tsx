import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Footer } from "@/components/home/Footer";
import { useCart, formatGBP } from "@/lib/cart";
import { CreatorAttribution } from "@/components/product/CreatorAttribution";

export const Route = createFileRoute("/checkout/confirmation")({
  head: () => ({
    meta: [
      { title: "Thank you — Ukena" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-warm-white">
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
            Nothing to confirm
          </p>
          <h1 className="mt-6 font-display text-5xl text-charcoal">
            No recent order found
          </h1>
          <Link
            to="/explore"
            className="mt-10 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
          >
            ← Back to the makers
          </Link>
        </div>
      </div>
    );
  }

  // Build the human "made by …" sentence for the headline.
  const makers = Array.from(
    new Map(lastOrder.items.map((i) => [i.creator.id, i.creator])).values(),
  );
  const firstNames = makers.map((m) => m.fullName.split(" ")[0]);
  const sentenceNames =
    firstNames.length === 1
      ? firstNames[0]
      : firstNames.slice(0, -1).join(", ") + " and " + firstNames.at(-1);

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <header className="border-b border-border/60 bg-warm-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link
            to="/"
            className="font-display text-3xl tracking-tight text-charcoal"
          >
            Ukena
          </Link>
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Reference {lastOrder.id}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20 md:px-10 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] uppercase tracking-[0.28em] text-terracotta">
            With gratitude
          </p>
          <h1 className="mt-6 font-display text-[44px] leading-[1.05] tracking-tight text-charcoal md:text-[68px]">
            Thank you,{" "}
            <em className="italic text-clay">
              {lastOrder.delivery.fullName.split(" ")[0]}
            </em>
            .
          </h1>
          <p className="mt-8 max-w-2xl text-[19px] leading-[1.6] text-charcoal/85 md:text-[22px]">
            Your piece is being prepared by {sentenceNames}. We've sent a quiet
            note to{" "}
            <span className="font-medium text-charcoal">
              {lastOrder.delivery.email}
            </span>
            — and we'll write again the day it begins its journey to you.
          </p>
        </motion.div>

        {/* The makers */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 space-y-5"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            The makers behind this order
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {makers.map((m) => (
              <CreatorAttribution key={m.id} creator={m} variant="footer" />
            ))}
          </div>
        </motion.section>

        {/* Order detail */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 rounded-2xl border border-border/70 bg-cream p-7 md:p-10"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
            What you ordered
          </p>

          <ul className="mt-6 space-y-5 border-b border-border/70 pb-6">
            {lastOrder.items.map((item) => (
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
                  <p className="font-display text-[18px] text-charcoal">
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

          <dl className="mt-6 space-y-3 text-[14px]">
            <Row label="Subtotal" value={formatGBP(lastOrder.subtotalPence)} />
            <Row
              label="Shipping"
              value={
                lastOrder.shippingPence === 0
                  ? "Free"
                  : formatGBP(lastOrder.shippingPence)
              }
            />
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-border/70 pt-5">
            <span className="text-[12px] uppercase tracking-[0.22em] text-ink-muted">
              Paid in full
            </span>
            <span className="font-display text-3xl text-charcoal">
              {formatGBP(lastOrder.totalPence)}
            </span>
          </div>

          <div className="mt-8 grid gap-2 border-t border-border/70 pt-6 text-[13px] text-charcoal/85 md:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                Delivering to
              </p>
              <p className="mt-2 leading-relaxed">
                {lastOrder.delivery.fullName}
                <br />
                {lastOrder.delivery.addressLine1}
                {lastOrder.delivery.addressLine2
                  ? `, ${lastOrder.delivery.addressLine2}`
                  : ""}
                <br />
                {lastOrder.delivery.city}, {lastOrder.delivery.postcode}
                <br />
                {lastOrder.delivery.country}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                Reference
              </p>
              <p className="mt-2 font-mono text-[13px] tracking-wide text-charcoal">
                {lastOrder.id}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Continue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-14 flex flex-col items-center gap-5 text-center"
        >
          <Link
            to="/explore"
            className="text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
          >
            Meet another maker →
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
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
