import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useCreatorOrders, useUpdateOrderStatus } from "@/lib/queries";
import { PageHeader, StatusPill, EmptyState } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import type { OrderStatus } from "@/services";

const STATUS_TONE: Record<OrderStatus, "neutral" | "good" | "warn" | "bad" | "info"> = {
  PENDING: "warn",
  PREPARING: "info",
  SHIPPED: "good",
  DELIVERED: "good",
  CANCELLED: "bad",
};

const FILTERS: { key: OrderStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "PREPARING", label: "Preparing" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

export const Route = createFileRoute("/creator/orders")({
  component: CreatorOrders,
});

function CreatorOrders() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? "wanjiru";
  const { data: orders = [] } = useCreatorOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

  async function advance(id: string, next: OrderStatus) {
    try {
      await updateStatus.mutateAsync({ id, status: next });
      toast.success(`Order marked ${next.toLowerCase()}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update status.");
    }
  }


  const mine = useMemo(
    () => orders.filter((o) => o.items.some((i) => i.creator.id === creatorId)),
    [orders, creatorId],
  );
  const filtered = filter === "ALL" ? mine : mine.filter((o) => o.status === filter);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orders"
        title="Hands waiting for your work."
        description="Mark orders as preparing or shipped so the buyer knows where their piece is on its journey."
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 font-sans text-[12px] font-medium transition ${
              filter === f.key
                ? "bg-clay text-warm-white"
                : "bg-cream text-charcoal/70 hover:bg-sand-soft/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nothing to prepare." body="When a buyer orders a piece in this state, it will land here." />
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => {
            const myItems = o.items.filter((i) => i.creator.id === creatorId);
            const subtotal = myItems.reduce((s, i) => s + i.pricePence * i.quantity, 0);
            return (
              <article
                key={o.id}
                className="rounded-2xl border border-border/60 bg-warm-white p-5 shadow-soft"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-mono text-[12px] text-charcoal/60">{o.id}</p>
                    <p className="mt-1 font-display text-lg text-charcoal">
                      {o.buyer.fullName} · {o.delivery.city}
                    </p>
                    <p className="font-sans text-[12px] text-charcoal/55">
                      Placed {new Date(o.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill label={o.status.toLowerCase()} tone={STATUS_TONE[o.status]} />
                    <span className="font-display text-lg text-charcoal">
                      {formatGBP(subtotal)}
                    </span>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-border/40 border-y border-border/40">
                  {myItems.map((i) => (
                    <li key={i.productId} className="flex items-center gap-4 py-3">
                      <img
                        src={i.image}
                        alt={i.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-sans text-sm text-charcoal">{i.name}</p>
                        <p className="font-sans text-[12px] text-charcoal/55">
                          Qty {i.quantity}
                        </p>
                      </div>
                      <p className="font-sans text-sm text-charcoal">
                        {formatGBP(i.pricePence * i.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2">
                  {o.status === "PENDING" && (
                    <button
                      onClick={() => advance(o.id, "PREPARING")}
                      disabled={updateStatus.isPending}
                      className="rounded-full bg-clay px-4 py-1.5 font-sans text-[12px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
                    >
                      Mark preparing
                    </button>
                  )}
                  {o.status === "PREPARING" && (
                    <button
                      onClick={() => advance(o.id, "SHIPPED")}
                      disabled={updateStatus.isPending}
                      className="rounded-full bg-clay px-4 py-1.5 font-sans text-[12px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
                    >
                      Mark shipped
                    </button>
                  )}
                  {o.status === "SHIPPED" && (
                    <button
                      onClick={() => advance(o.id, "DELIVERED")}
                      disabled={updateStatus.isPending}
                      className="rounded-full bg-clay px-4 py-1.5 font-sans text-[12px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
                    >
                      Mark delivered
                    </button>
                  )}
                  <button className="rounded-full px-4 py-1.5 font-sans text-[12px] text-charcoal/60 hover:text-charcoal hover:underline">
                    Print packing slip
                  </button>
                </div>

              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
