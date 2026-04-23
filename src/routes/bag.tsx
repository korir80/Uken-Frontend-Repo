import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Button } from "@/components/ukena/Button";
import { SectionLabel } from "@/components/ukena";
import { useCart, formatGBP } from "@/lib/cart";

// TODO: on user login, call GET /api/cart to hydrate the local cart
// (productService.getCart()) and POST /api/cart/sync on every mutation.
// Until that wire-up exists, the cart lives in memory + a localStorage mirror
// (see src/lib/cart.tsx).
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
    totalPence,
    uniqueCreators,
  } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:px-10 md:pb-32 md:pt-14">
        <SectionLabel>Your bag</SectionLabel>
        <h1 className="mt-4 font-display text-[30px] leading-[1.05] tracking-tight text-charcoal md:text-[42px]">
          {isEmpty ? "Quietly empty" : "A small selection"}
          {!isEmpty && <em className="italic text-terracotta">.</em>}
        </h1>

        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="mt-10 grid gap-12 md:mt-14 md:grid-cols-12 md:gap-14">
            <ItemList
              items={items}
              onQuantity={setQuantity}
              onRemove={removeItem}
            />
            <Summary
              subtotal={subtotalPence}
              total={totalPence}
              creatorCount={uniqueCreators.length}
            />
          </div>
        )}

        {!isEmpty && uniqueCreators.length >= 2 && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-cream/80 px-5 py-3 text-center md:mt-14">
            <p className="text-[13px] italic leading-relaxed text-clay">
              Your purchase directly supports{" "}
              <ImpactNames creators={uniqueCreators} /> in Kenya.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Line items list
// ───────────────────────────────────────────────────────────────────────────

function ItemList({
  items,
  onQuantity,
  onRemove,
}: {
  items: ReturnType<typeof useCart>["items"];
  onQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <ul className="md:col-span-7">
      <AnimatePresence initial={false}>
        {items.map((item, idx) => (
          <motion.li
            key={item.productId}
            layout
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={
              idx === 0
                ? "flex gap-4 py-5 first:pt-0"
                : "flex gap-4 border-t border-border/60 py-5"
            }
          >
            {/* Thumbnail — 64px square */}
            <Link
              to="/products/$productId"
              params={{ productId: item.productId }}
              className="block h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream"
            >
              <img
                src={item.image}
                alt={item.name}
                width={128}
                height={128}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              {/* Top row: name + remove */}
              <div className="flex items-start justify-between gap-3">
                <Link
                  to="/products/$productId"
                  params={{ productId: item.productId }}
                  className="font-display text-[15px] leading-tight text-charcoal hover:text-clay"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => onRemove(item.productId)}
                  aria-label={`Remove ${item.name}`}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-sand-soft/60 hover:text-charcoal"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Second row: creator byline */}
              <Link
                to="/creators/$creatorId"
                params={{ creatorId: item.creator.id }}
                className="mt-0.5 text-[11px] text-clay hover:text-clay-deep"
              >
                by{" "}
                <span className="font-medium underline-offset-4 hover:underline">
                  {item.creator.fullName}
                </span>{" "}
                · {item.creator.region}
              </Link>

              {/* Third row: quantity + price */}
              <div className="mt-3 flex items-end justify-between gap-3">
                <QuantityStepper
                  quantity={item.quantity}
                  onChange={(q) => onQuantity(item.productId, q)}
                  onDelete={() => onRemove(item.productId)}
                />
                <span className="text-[14px] font-medium tabular-nums text-charcoal">
                  {formatGBP(item.pricePence * item.quantity)}
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Order summary aside
// ───────────────────────────────────────────────────────────────────────────

function Summary({
  subtotal,
  total,
  creatorCount,
}: {
  subtotal: number;
  total: number;
  creatorCount: number;
}) {
  return (
    <aside className="md:col-span-5">
      <div className="md:sticky md:top-24 rounded-2xl border border-border/70 bg-cream p-6 md:p-7">
        <p className="text-[16px] font-medium text-charcoal">Order summary</p>

        <dl className="mt-5 space-y-2.5 text-[14px]">
          <Row label="Subtotal" value={formatGBP(subtotal)} />
          <Row label="Shipping" value="Calculated at checkout" muted />
        </dl>

        <div className="mt-5 flex items-baseline justify-between border-t border-border/70 pt-5">
          <span className="text-[12px] uppercase tracking-[0.22em] text-ink-muted">
            Total
          </span>
          <span className="font-display text-[22px] text-charcoal">
            {formatGBP(total)}
          </span>
        </div>

        <p className="mt-2 text-[11px] text-ink-muted">
          All prices in GBP · VAT included
        </p>

        <Link
          to="/checkout/delivery"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-terracotta px-6 text-[14px] font-medium tracking-wide text-warm-white transition-all hover:bg-[oklch(0.52_0.13_38)]"
        >
          Proceed to checkout →
        </Link>

        {/* Trust signals */}
        <ul className="mt-5 space-y-1.5 text-center text-[11px] leading-relaxed text-charcoal/35">
          <li>Secure checkout</li>
          <li>Free returns within 30 days</li>
          <li>
            Each piece is handmade — slight variations are part of its beauty
          </li>
        </ul>

        {creatorCount > 0 && (
          <p className="mt-5 text-center text-[11px] uppercase tracking-[0.22em] text-clay">
            Supporting {creatorCount} maker{creatorCount === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </aside>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────

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

/**
 * Quantity stepper. At qty 1, the minus icon becomes a trash icon — one more
 * tap removes the line. This keeps the UI compact without losing affordance.
 */
function QuantityStepper({
  quantity,
  onChange,
  onDelete,
}: {
  quantity: number;
  onChange: (q: number) => void;
  onDelete: () => void;
}) {
  const isOne = quantity <= 1;
  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => (isOne ? onDelete() : onChange(quantity - 1))}
        aria-label={isOne ? "Remove from bag" : "Decrease quantity"}
        className="grid h-7 w-7 place-items-center rounded-md border border-border bg-warm-white text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal"
      >
        {isOne ? (
          <Trash2 className="h-3 w-3" />
        ) : (
          <Minus className="h-3 w-3" />
        )}
      </button>
      <span className="w-7 text-center text-[13px] tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
        className="grid h-7 w-7 place-items-center rounded-md border border-border bg-warm-white text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

function ImpactNames({
  creators,
}: {
  creators: { id: string; fullName: string }[];
}) {
  if (creators.length === 0) return null;
  if (creators.length <= 2) {
    return (
      <>
        {creators.map((c, i) => (
          <span key={c.id}>
            <Link
              to="/creators/$creatorId"
              params={{ creatorId: c.id }}
              className="font-medium text-charcoal underline-offset-4 hover:underline"
            >
              {c.fullName.split(" ")[0]}
            </Link>
            {i === 0 && creators.length === 2 ? " and " : ""}
          </span>
        ))}
      </>
    );
  }
  // 3+ creators
  const [first, second, ...rest] = creators;
  return (
    <>
      <Link
        to="/creators/$creatorId"
        params={{ creatorId: first.id }}
        className="font-medium text-charcoal underline-offset-4 hover:underline"
      >
        {first.fullName.split(" ")[0]}
      </Link>
      {", "}
      <Link
        to="/creators/$creatorId"
        params={{ creatorId: second.id }}
        className="font-medium text-charcoal underline-offset-4 hover:underline"
      >
        {second.fullName.split(" ")[0]}
      </Link>
      {" and "}
      <span className="font-medium text-charcoal">{rest.length} more</span>
      {" makers"}
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 flex flex-col items-center gap-5 py-10 text-center md:mt-16 md:py-16">
      <p className="font-display text-[28px] italic leading-snug text-charcoal/85 md:text-[34px]">
        Your bag is empty.
      </p>
      <p className="max-w-md text-[14px] font-light leading-relaxed text-charcoal/50">
        But the stories are waiting.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <Button asChild variant="primary" size="lg">
          <Link to="/shop">Explore the collection</Link>
        </Button>
        <Link
          to="/explore"
          className="text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
        >
          Meet the makers →
        </Link>
      </div>
    </div>
  );
}
