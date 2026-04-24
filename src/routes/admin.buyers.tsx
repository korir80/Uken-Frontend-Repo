import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { orderService, type OrderDto } from "@/services";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";

interface BuyerRow {
  fullName: string;
  email: string;
  city: string;
  orderCount: number;
  totalPence: number;
  lastOrderAt: string;
}

export const Route = createFileRoute("/admin/buyers")({
  component: AdminBuyers,
});

function AdminBuyers() {
  const [buyers, setBuyers] = useState<BuyerRow[]>([]);

  useEffect(() => {
    orderService.getAllOrders().then((orders: OrderDto[]) => {
      const byEmail = new Map<string, BuyerRow>();
      for (const o of orders) {
        const key = o.buyer.email.toLowerCase();
        const prev = byEmail.get(key);
        const row: BuyerRow = prev ?? {
          fullName: o.buyer.fullName,
          email: o.buyer.email,
          city: o.delivery.city,
          orderCount: 0,
          totalPence: 0,
          lastOrderAt: o.createdAt,
        };
        row.orderCount += 1;
        row.totalPence += o.totalPence;
        if (new Date(o.createdAt) > new Date(row.lastOrderAt)) row.lastOrderAt = o.createdAt;
        byEmail.set(key, row);
      }
      setBuyers([...byEmail.values()].sort((a, b) => b.totalPence - a.totalPence));
    });
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Buyers"
        title="People bringing the work home."
        description="Lifetime spend per buyer. Suspend a buyer or reset their access if abuse is reported."
      />

      <div className="overflow-hidden rounded-2xl border border-border/60">
        <table className="min-w-full divide-y divide-border/60">
          <thead className="bg-cream/60 text-left">
            <tr>
              <Th>Buyer</Th>
              <Th>City</Th>
              <Th>Orders</Th>
              <Th>Lifetime spend</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-warm-white">
            {buyers.map((b) => (
              <tr key={b.email}>
                <td className="px-4 py-3">
                  <p className="font-display text-base text-charcoal">{b.fullName}</p>
                  <p className="font-sans text-[12px] text-charcoal/55">{b.email}</p>
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{b.city}</td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{b.orderCount}</td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal">
                  £{(b.totalPence / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill label="active" tone="good" />
                </td>
                <td className="px-4 py-3 text-right font-sans text-[12px]">
                  <button className="text-charcoal/60 hover:text-charcoal hover:underline">
                    Reset password
                  </button>
                  <span className="mx-2 text-charcoal/30">·</span>
                  <button className="text-destructive hover:underline">Suspend</button>
                </td>
              </tr>
            ))}
            {buyers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60">
                  No buyers yet.
                </td>
              </tr>
            )}
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
