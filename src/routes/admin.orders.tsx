import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import { formatGBP } from "@/lib/cart";
import { useAdminOrders, useRefundOrder } from "@/lib/queries";
import type { OrderStatus } from "@/services";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const TONE: Record<OrderStatus, "neutral" | "good" | "warn" | "bad" | "info"> = {
  PENDING: "warn",
  PAID: "info",
  PREPARING: "info",
  SHIPPED: "good",
  DELIVERED: "good",
  CANCELLED: "bad",
};

function AdminOrders() {
  const { data, isLoading, isError, refetch } = useAdminOrders();
  const orders = Array.isArray(data) ? data : [];
  const refund = useRefundOrder();
  const [open, setOpen] = useState<string | null>(null);

  function handleRefund(displayId: string) {
    if (
      !window.confirm(
        "This will cancel the order. Stripe refund must be processed manually in the Stripe dashboard for now. Continue?",
      )
    )
      return;
    refund.mutate(displayId, {
      onSuccess: () => toast.success("Order cancelled."),
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orders"
        title="Order moderation."
        description="Oversee buyer orders, expand any row for detail, or cancel & refund."
      />

      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center font-sans text-[13px] text-destructive">
          Couldn't load orders.{" "}
          <button onClick={() => refetch()} className="underline">Retry</button>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="min-w-[860px] divide-y divide-border/60 sm:min-w-full">
            <thead className="bg-cream/60 text-left">
              <tr>
                <Th>Order</Th>
                <Th>Date</Th>
                <Th>Buyer</Th>
                <Th>Items</Th>
                <Th className="text-right">Total</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-warm-white">
              {orders.map((o) => {
                const expanded = open === o.displayId;
                const itemSummary =
                  o.items.length === 0
                    ? "—"
                    : o.items.length === 1
                      ? o.items[0].name
                      : `${o.items[0].name} and ${o.items.length - 1} more`;
                return (
                  <Fragment key={o.displayId}>
                    <tr
                      className="cursor-pointer hover:bg-cream/30"
                      onClick={() => setOpen(expanded ? null : o.displayId)}
                    >
                      <td className="px-4 py-3 font-mono text-[12px] text-charcoal">{o.displayId}</td>
                      <td className="px-4 py-3 font-sans text-[12px] text-charcoal/70">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-sans text-[13px] text-charcoal">
                        <p>{o.buyer?.fullName ?? "—"}</p>
                        <p className="text-[11px] text-charcoal/55">{o.buyer?.email}</p>
                      </td>
                      <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{itemSummary}</td>
                      <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                        {formatGBP(o.totalPence)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill label={o.status.toLowerCase()} tone={TONE[o.status] ?? "neutral"} />
                      </td>
                      <td className="px-4 py-3 text-right font-sans text-[12px]">
                        {o.status !== "CANCELLED" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRefund(o.displayId);
                            }}
                            disabled={refund.isPending}
                            className="text-destructive hover:underline disabled:opacity-50"
                          >
                            Cancel & refund
                          </button>
                        )}
                      </td>
                    </tr>
                    {expanded && (
                      <tr key={o.displayId + "-detail"} className="bg-cream/30">
                        <td colSpan={7} className="px-6 py-5">
                          <div className="grid gap-6 md:grid-cols-[1fr_280px]">
                            <div className="space-y-3">
                              <h4 className="section-label">Items</h4>
                              {o.items.map((it, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <LazyImage
                                    src={it.image}
                                    alt=""
                                    className="h-12 w-12 rounded-lg object-cover"
                                  />
                                  <div className="flex-1">
                                    <p className="font-display text-[14px] text-charcoal">{it.name}</p>
                                    <p className="font-sans text-[12px] text-charcoal/60">
                                      {it.creator?.fullName} · qty {it.quantity}
                                    </p>
                                  </div>
                                  <p className="font-sans text-[13px] text-charcoal">
                                    {formatGBP(it.pricePence * it.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-3">
                              <div>
                                <h4 className="section-label">Delivery</h4>
                                <div className="mt-1 font-sans text-[12px] text-charcoal/75">
                                  <p>{o.delivery?.fullName}</p>
                                  <p>{o.delivery?.addressLine1}</p>
                                  <p>{o.delivery?.city} {o.delivery?.postcode}</p>
                                  <p>{o.delivery?.country}</p>
                                  {o.delivery?.phone && <p>{o.delivery.phone}</p>}
                                </div>
                              </div>
                              <div className="border-t border-border/40 pt-3 font-sans text-[13px]">
                                <Row label="Subtotal" value={formatGBP(o.productsTotalPence)} />
                                <Row label="Shipping" value={formatGBP(o.shippingPence)} />
                                <Row label="Total" value={formatGBP(o.totalPence)} bold />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-charcoal/60">{label}</span>
      <span className={bold ? "font-medium text-charcoal" : "text-charcoal/80"}>{value}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-2 rounded-2xl border border-border/60 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-charcoal/[0.06]" />
      ))}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60 ${className}`}>
      {children}
    </th>
  );
}
