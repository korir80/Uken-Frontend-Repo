import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { CreatorAttribution } from "@/components/product/CreatorAttribution";
import { Button } from "@/components/ukena/Button";
import { SectionLabel } from "@/components/ukena";
import { useCart, formatGBP } from "@/lib/cart";

export const Route = createFileRoute("/bag")({
  head: () => ({
    meta: [
      { title: "Your bag — Ukena" },
      {
        name: "description",
        content: "Review the pieces in your bag and the makers behind them.",
      },
    ],
  }),
  component: BagPage,
});

function BagPage() {
  const {
    items,
    setQuantity,
    removeItem,
    subtotalPence,
    shippingPence,
    totalPence,
    uniqueCreators,
  } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:px-10 md:pb-32 md:pt-16">
        <SectionLabel>Your bag</SectionLabel>
        <h1 className="mt-5 font-display text-[44px] leading-[1.05] tracking-tight text-charcoal md:text-[64px]">
          {isEmpty ? "Quietly empty" : "A small selection"}
          {!isEmpty && <em className="italic text-terracotta">.</em>}
        </h1>

        {isEmpty ? <EmptyState /> : <BagContent />}

        {!isEmpty && (
          <p className="mt-12 text-center text-[12px] uppercase tracking-[0.22em] text-ink-muted md:hidden">
            {uniqueCreators.length} maker{uniqueCreators.length === 1 ? "" : "s"}{" "}
            · {formatGBP(totalPence)} total
          </p>
        )}
      </main>

      <Footer />
    </div>
  );

  function BagContent() {
    return (
      <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-16">
        {/* Lines */}
        <ul className="md:col-span-7 space-y-10">
          {items.map((item) => (
            <li
              key={item.productId}
              className="grid grid-cols-[112px_1fr] gap-5 border-b border-border/70 pb-10 md:grid-cols-[140px_1fr] md:gap-7"
            >
              <Link
                to="/products/$productId"
                params={{ productId: item.productId }}
                className="block overflow-hidden rounded-xl bg-cream"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  width={280}
                  height={280}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </Link>

              <div className="flex min-w-0 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      to="/products/$productId"
                      params={{ productId: item.productId }}
                      className="font-display text-[22px] leading-tight text-charcoal hover:text-clay md:text-[26px]"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-2">
                      <CreatorAttribution
                        creator={item.creator}
                        variant="inline"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-sand-soft/60 hover:text-charcoal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                  <QuantityStepper
                    quantity={item.quantity}
                    onChange={(q) => setQuantity(item.productId, q)}
                  />
                  <span className="font-display text-xl text-clay-deep">
                    {formatGBP(item.pricePence * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="md:col-span-5">
          <div className="md:sticky md:top-28 rounded-2xl border border-border/70 bg-cream p-7 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
              Summary
            </p>

            <dl className="mt-6 space-y-3 text-[14px]">
              <Row label="Subtotal" value={formatGBP(subtotalPence)} />
              <Row
                label="Shipping"
                value={
                  shippingPence === 0
                    ? "Free across the UK"
                    : formatGBP(shippingPence)
                }
                muted
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

            <Link
              to="/checkout/delivery"
              className="mt-7 inline-flex h-13 w-full items-center justify-center rounded-md bg-terracotta px-6 text-[15px] font-medium tracking-wide text-warm-white transition-all hover:bg-[oklch(0.52_0.13_38)]"
            >
              Complete your purchase
            </Link>

            {/* Human impact */}
            <div className="mt-7 rounded-xl bg-warm-white/70 p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-clay">
                Where this goes
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-charcoal/85">
                Your purchase directly supports{" "}
                <CreatorList creators={uniqueCreators} />.
              </p>
            </div>

            <p className="mt-6 text-[12px] leading-relaxed text-ink-muted">
              Each piece is made to order in Kenya. Estimated delivery 5–10 days
              from dispatch.
            </p>
          </div>
        </aside>
      </div>
    );
  }
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-charcoal/80">{label}</dt>
      <dd className={muted ? "text-ink-muted" : "text-charcoal"}>{value}</dd>
    </div>
  );
}

function QuantityStepper({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (q: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-warm-white">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
        className="grid h-9 w-9 place-items-center rounded-l-full text-charcoal/70 transition-colors hover:bg-sand-soft/60 hover:text-charcoal"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-[14px] tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
        className="grid h-9 w-9 place-items-center rounded-r-full text-charcoal/70 transition-colors hover:bg-sand-soft/60 hover:text-charcoal"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CreatorList({
  creators,
}: {
  creators: { id: string; fullName: string }[];
}) {
  if (creators.length === 0) return null;
  return (
    <>
      {creators.map((c, i) => (
        <span key={c.id}>
          <Link
            to="/creators/$creatorId"
            params={{ creatorId: c.id }}
            className="font-medium text-charcoal underline decoration-clay/40 underline-offset-4 hover:decoration-clay"
          >
            {c.fullName}
          </Link>
          {i < creators.length - 2 ? ", " : i === creators.length - 2 ? " and " : ""}
        </span>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-16">
      <div className="md:col-span-7">
        <p className="font-display text-[28px] italic leading-snug text-charcoal/85 md:text-[34px]">
          Your bag is empty —{" "}
          <span className="text-terracotta">but the stories are waiting</span>.
        </p>
        <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-muted">
          Begin with whoever holds your eye. The pieces will follow, and so will
          the people behind them.
        </p>
        <div className="mt-10">
          <Button asChild variant="primary" size="lg">
            <Link to="/explore">Meet the makers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
