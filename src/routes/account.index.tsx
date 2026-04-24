import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  PageHeader,
  StatCard,
  StatusPill,
  EmptyState,
} from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth";
import { orderService, type OrderDto, type OrderStatus } from "@/services";
import { formatGBP } from "@/lib/cart";
import {
  readSavedCreators,
  readSavedProducts,
  readRecentProducts,
} from "@/lib/ukena-mode";
import { LazyImage } from "@/components/ui/lazy-image";
import { getProduct } from "@/components/product/product-data";

export const Route = createFileRoute("/account/")({
  component: BuyerOverview,
});

const STATUS_TONE: Record<OrderStatus, "neutral" | "good" | "warn" | "bad" | "info"> = {
  PENDING: "warn",
  PREPARING: "info",
  SHIPPED: "info",
  DELIVERED: "good",
  CANCELLED: "bad",
};

function BuyerOverview() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [savedCreators, setSavedCreators] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    orderService.getOrdersByBuyer().then(setOrders);
    setSavedProducts(readSavedProducts());
    setSavedCreators(readSavedCreators());
    setRecent(readRecentProducts());
  }, []);

  const lifetimeSpend = useMemo(
    () => orders.reduce((sum, o) => sum + o.totalPence, 0),
    [orders],
  );

  const inFlight = useMemo(
    () => orders.filter((o) => o.status === "PENDING" || o.status === "PREPARING" || o.status === "SHIPPED"),
    [orders],
  );

  const recentProducts = useMemo(
    () => recent.slice(0, 4).map((id) => getProduct(id)).filter(Boolean),
    [recent],
  );

  const firstName = user?.fullName.split(" ")[0] ?? "there";

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Overview"
        title={`Hello, ${firstName}.`}
        description="Your saved makers, pieces in flight, and what you've collected so far — all in one place."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pieces in flight" value={String(inFlight.length)} hint="Pending, preparing or shipped" />
        <StatCard label="Lifetime orders" value={String(orders.length)} />
        <StatCard label="Saved makers" value={String(savedCreators.length)} />
        <StatCard label="Lifetime spend" value={formatGBP(lifetimeSpend)} />
      </div>

      {/* In-flight orders */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl text-charcoal sm:text-2xl">In flight</h2>
          <Link to="/account/orders" className="font-sans text-[12px] text-clay hover:underline">
            All orders →
          </Link>
        </div>
        {inFlight.length === 0 ? (
          <EmptyState
            title="Nothing on its way."
            body="When you place an order it'll show up here so you can track its journey."
            action={
              <Link
                to="/shop"
                className="inline-flex items-center rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
              >
                Browse the collection
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {inFlight.map((o) => (
              <li
                key={o.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-cream/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={o.items[0]?.image}
                    alt=""
                    className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-base text-charcoal">{o.id}</p>
                    <p className="truncate font-sans text-[12px] text-charcoal/60">
                      {o.items.length} {o.items.length === 1 ? "piece" : "pieces"} · {o.items[0]?.creator.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:gap-6">
                  <StatusPill label={o.status.toLowerCase()} tone={STATUS_TONE[o.status]} />
                  <span className="font-display text-base text-charcoal">{formatGBP(o.totalPence)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recently viewed */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl text-charcoal sm:text-2xl">Recently viewed</h2>
          <Link to="/account/activity" className="font-sans text-[12px] text-clay hover:underline">
            See all →
          </Link>
        </div>
        {recentProducts.length === 0 ? (
          <EmptyState
            title="Nothing here yet."
            body="Pieces you open will appear here so you can find them again."
          />
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recentProducts.map((p) =>
              p ? (
                <li key={p.id}>
                  <Link
                    to="/products/$productId"
                    params={{ productId: p.id }}
                    className="group block"
                  >
                    <LazyImage
                      src={p.heroImage}
                      alt={p.name}
                      ratio="1/1"
                      wrapperClassName="rounded-xl"
                      className="transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <p className="mt-2 truncate font-display text-[14px] text-charcoal">{p.name}</p>
                    <p className="font-sans text-[11px] text-charcoal/55">{formatGBP(p.pricePence)}</p>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <QuickLink
          to="/account/saved"
          title="Saved"
          body={`${savedProducts.length} pieces · ${savedCreators.length} makers`}
        />
        <QuickLink to="/account/addresses" title="Addresses" body="Where your pieces are sent" />
        <QuickLink to="/account/profile" title="Profile" body="Update your details" />
      </section>
    </div>
  );
}

function QuickLink({
  to,
  title,
  body,
}: {
  to: "/account/saved" | "/account/addresses" | "/account/profile";
  title: string;
  body: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border/60 bg-warm-white p-5 transition-colors hover:border-clay/60 hover:bg-cream/40"
    >
      <p className="font-display text-lg text-charcoal">{title}</p>
      <p className="mt-1 font-sans text-[12px] text-charcoal/60">{body}</p>
      <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.22em] text-clay group-hover:underline">
        Open →
      </p>
    </Link>
  );
}
