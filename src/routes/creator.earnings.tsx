import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useCreatorOrders } from "@/lib/queries";
import { payouts } from "@/components/admin/admin-data";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";

export const Route = createFileRoute("/creator/earnings")({
  component: CreatorEarnings,
});

function CreatorEarnings() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? "wanjiru";
  const { data: orders = [] } = useCreatorOrders();
  const summary = payouts.find((p) => p.creatorId === creatorId);

  const myOrders = orders.filter((o) => o.items.some((i) => i.creator.id === creatorId));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Earnings"
        title="Fair work, paid fairly."
        description="Ukena pays creators monthly. Pending earnings move to paid on the 1st of each month."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value={formatGBP(summary?.pendingPence ?? 0)} hint="Next payout cycle" />
        <StatCard label="Paid this month" value={formatGBP(summary?.paidThisMonthPence ?? 0)} />
        <StatCard label="Lifetime" value={formatGBP(summary?.totalLifetimePence ?? 0)} hint="Since you joined" />
      </div>

      <section>
        <h2 className="font-display text-2xl text-charcoal">Recent transactions</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border/60">
          <table className="min-w-full divide-y divide-border/60">
            <thead className="bg-cream/60 text-left">
              <tr>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Order</th>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Date</th>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Status</th>
                <th className="px-4 py-3 text-right font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Your share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-warm-white">
              {myOrders.map((o) => {
                const share = o.items
                  .filter((i) => i.creator.id === creatorId)
                  .reduce((s, i) => s + i.pricePence * i.quantity, 0);
                return (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono text-[12px] text-charcoal/80">{o.id}</td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                      {new Date(o.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                      {o.status.toLowerCase()}
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                      {formatGBP(share)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
