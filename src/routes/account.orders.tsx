import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  PageHeader,
  StatusPill,
  EmptyState,
} from "@/components/dashboard/DashboardShell";
import { orderService, type OrderDto, type OrderStatus } from "@/services";
import { formatGBP, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/orders")({
  component: BuyerOrders,
});

const STATUS_TONE: Record<OrderStatus, "neutral" | "good" | "warn" | "bad" | "info"> = {
  PENDING: "warn",
  PREPARING: "info",
  SHIPPED: "info",
  DELIVERED: "good",
  CANCELLED: "bad",
};

const FILTERS: { label: string; value: "all" | OrderStatus }[] = [
  { label: "All", value: "all" },
  { label: "In flight", value: "PREPARING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function BuyerOrders() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    orderService.getOrdersByBuyer().then(setOrders);
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [filter, orders],
  );

  function reorder(o: OrderDto) {
    o.items.forEach((it) => {
      for (let i = 0; i < it.quantity; i++) {
        addItem({
          productId: it.productId,
          name: it.name,
          pricePence: it.pricePence,
          image: it.image,
          creator: it.creator,
        });
      }
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orders"
        title="Every piece, every journey."
        description="Track what's on its way and revisit pieces you've collected."
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full px-4 py-1.5 font-sans text-[12px] font-medium transition-colors",
              filter === f.value
                ? "bg-clay text-warm-white"
                : "border border-border/60 text-charcoal/70 hover:border-clay/60 hover:text-charcoal",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No orders here."
          body={
            filter === "all"
              ? "Once you place your first order it'll appear here."
              : "Nothing matches this filter yet."
          }
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
          {filtered.map((o) => {
            const open = openId === o.id;
            return (
              <li
                key={o.id}
                className="overflow-hidden rounded-2xl border border-border/60 bg-warm-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : o.id)}
                  className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-cream/40 sm:flex-row sm:items-center sm:justify-between sm:p-5"
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
                        {new Date(o.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · {o.items.length} {o.items.length === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:gap-6">
                    <StatusPill label={o.status.toLowerCase()} tone={STATUS_TONE[o.status]} />
                    <span className="font-display text-base text-charcoal">
                      {formatGBP(o.totalPence)}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "font-sans text-[14px] text-charcoal/40 transition-transform",
                        open && "rotate-180",
                      )}
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-border/60 bg-cream/30 p-4 sm:p-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                      {/* Items */}
                      <ul className="space-y-3">
                        {o.items.map((it) => (
                          <li
                            key={it.productId}
                            className="flex items-center gap-3 rounded-xl bg-warm-white p-3"
                          >
                            <img
                              src={it.image}
                              alt=""
                              className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <Link
                                to="/products/$productId"
                                params={{ productId: it.productId }}
                                className="block truncate font-display text-base text-charcoal hover:text-clay"
                              >
                                {it.name}
                              </Link>
                              <p className="font-sans text-[11px] text-charcoal/55">
                                {it.creator.fullName} · {it.creator.region}
                              </p>
                              <p className="mt-1 font-sans text-[12px] text-charcoal/70">
                                Qty {it.quantity} · {formatGBP(it.pricePence)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* Delivery + actions */}
                      <div className="space-y-4">
                        <div>
                          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
                            Delivery
                          </p>
                          <div className="mt-2 font-sans text-[13px] leading-relaxed text-charcoal/80">
                            <p>{o.delivery.fullName}</p>
                            <p>{o.delivery.addressLine1}</p>
                            {o.delivery.addressLine2 && <p>{o.delivery.addressLine2}</p>}
                            <p>
                              {o.delivery.city}, {o.delivery.postcode}
                            </p>
                            <p>{o.delivery.country}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => reorder(o)}
                          className="w-full rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
                        >
                          Reorder pieces
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
