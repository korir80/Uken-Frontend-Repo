import { createFileRoute } from "@tanstack/react-router";
import { payouts } from "@/components/admin/admin-data";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";

export const Route = createFileRoute("/admin/payouts")({
  component: AdminPayouts,
});

function AdminPayouts() {
  const totalPending = payouts.reduce((s, p) => s + p.pendingPence, 0);
  const totalPaidThisMonth = payouts.reduce((s, p) => s + p.paidThisMonthPence, 0);
  const totalLifetime = payouts.reduce((s, p) => s + p.totalLifetimePence, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payouts"
        title="What we owe the makers."
        description="Cycle runs on the 1st of each month. Approve a payout to push pending earnings to the maker's account."
        action={
          <button className="rounded-full bg-clay px-5 py-2.5 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep">
            Run cycle
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending this cycle" value={formatGBP(totalPending)} />
        <StatCard label="Paid this month" value={formatGBP(totalPaidThisMonth)} />
        <StatCard label="Lifetime payouts" value={formatGBP(totalLifetime)} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60">
        <table className="min-w-full divide-y divide-border/60">
          <thead className="bg-cream/60 text-left">
            <tr>
              <Th>Creator</Th>
              <Th>Region</Th>
              <Th className="text-right">Pending</Th>
              <Th className="text-right">Paid this month</Th>
              <Th className="text-right">Lifetime</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-warm-white">
            {payouts.map((p) => (
              <tr key={p.creatorId}>
                <td className="px-4 py-3">
                  <p className="font-display text-base text-charcoal">{p.fullName}</p>
                  <p className="font-sans text-[12px] text-charcoal/55">{p.craft}</p>
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{p.region}</td>
                <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                  {formatGBP(p.pendingPence)}
                </td>
                <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal/70">
                  {formatGBP(p.paidThisMonthPence)}
                </td>
                <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal/70">
                  {formatGBP(p.totalLifetimePence)}
                </td>
                <td className="px-4 py-3 text-right font-sans text-[12px]">
                  <button className="text-clay hover:underline">Pay now</button>
                </td>
              </tr>
            ))}
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
