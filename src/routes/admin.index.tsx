import { createFileRoute, Link } from "@tanstack/react-router";
import { useCreators } from "@/lib/queries";
import { orderService } from "@/services";
import { useEffect, useState } from "react";
import { applications, payouts } from "@/components/admin/admin-data";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import type { OrderDto } from "@/services";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: creators = [] } = useCreators();
  const [orders, setOrders] = useState<OrderDto[]>([]);

  useEffect(() => {
    orderService.getAllOrders().then(setOrders);
  }, []);

  const gmvPence = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.totalPence, 0);
  const pendingApps = applications.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length;
  const totalPayout = payouts.reduce((s, p) => s + p.pendingPence, 0);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Admin overview"
        title="Ukena, today."
        description="The platform at a glance — what's live, what's waiting, and what needs your attention."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="GMV" value={formatGBP(gmvPence)} hint="Across all orders" />
        <StatCard label="Active creators" value={String(creators.length)} hint="Live profiles" />
        <StatCard label="Total orders" value={String(orders.length)} hint="All time" />
        <StatCard label="Pending payouts" value={formatGBP(totalPayout)} hint="To be settled" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActionCard
          title={`${pendingApps} applications awaiting review`}
          body="Move new artisans through the curation pipeline so the buyer-facing catalogue keeps growing."
          to="/admin/applications"
        />
        <ActionCard
          title={`${orders.filter((o) => o.status === "PENDING").length} orders pending creator action`}
          body="Nudge the maker if a piece has been pending too long, or step in on a stuck dispute."
          to="/admin/orders"
        />
      </div>

      <section>
        <h2 className="font-display text-2xl text-charcoal">Top creators by revenue</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60">
          <table className="min-w-[640px] divide-y divide-border/60 sm:min-w-full">
            <thead className="bg-cream/60 text-left">
              <tr>
                <Th>Creator</Th>
                <Th>Region</Th>
                <Th>Craft</Th>
                <Th className="text-right">Lifetime</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-warm-white">
              {[...payouts]
                .sort((a, b) => b.totalLifetimePence - a.totalLifetimePence)
                .slice(0, 5)
                .map((p) => (
                  <tr key={p.creatorId}>
                    <td className="px-4 py-3 font-sans text-sm text-charcoal">
                      <Link to="/creators/$creatorId" params={{ creatorId: p.creatorId }} className="hover:underline">
                        {p.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{p.region}</td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{p.craft}</td>
                    <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                      {formatGBP(p.totalLifetimePence)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ActionCard({ title, body, to }: { title: string; body: string; to: string }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-border/60 bg-cream/40 p-6 transition hover:border-clay hover:shadow-soft"
    >
      <p className="font-display text-xl text-charcoal">{title}</p>
      <p className="mt-2 font-sans text-[13px] text-charcoal/65">{body}</p>
      <p className="mt-4 font-sans text-[12px] text-clay">Take action →</p>
    </Link>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60 ${className}`}>
      {children}
    </th>
  );
}
