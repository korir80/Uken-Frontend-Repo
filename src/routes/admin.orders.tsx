import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { orderService, type OrderDto, type OrderStatus } from "@/services";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";

const TONE: Record<OrderStatus, "neutral" | "good" | "warn" | "bad" | "info"> = {
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
  { key: "CANCELLED", label: "Cancelled" },
];

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

  useEffect(() => {
    orderService.getAllOrders().then(setOrders);
  }, []);

  const filtered = useMemo(
    () => (filter === "ALL" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orders"
        title="Every piece, every journey."
        description="Step in if a maker is unresponsive, refund a buyer, or chase a stuck shipment."
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

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="min-w-[760px] divide-y divide-border/60 sm:min-w-full">
          <thead className="bg-cream/60 text-left">
            <tr>
              <Th>Order</Th>
              <Th>Buyer</Th>
              <Th>Creators</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th className="text-right">Total</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-warm-white">
            {filtered.map((o) => {
              const creators = Array.from(new Set(o.items.map((i) => i.creator.fullName)));
              return (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-mono text-[12px] text-charcoal/80">{o.id}</td>
                  <td className="px-4 py-3 font-sans text-[13px]">
                    <p className="text-charcoal">{o.buyer.fullName}</p>
                    <p className="text-[11px] text-charcoal/55">{o.delivery.city}</p>
                  </td>
                  <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                    {creators.join(", ")}
                  </td>
                  <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill label={o.status.toLowerCase()} tone={TONE[o.status]} />
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                    {formatGBP(o.totalPence)}
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-[12px]">
                    <button className="text-clay hover:underline">View</button>
                    <span className="mx-2 text-charcoal/30">·</span>
                    <button className="text-destructive hover:underline">Refund</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
