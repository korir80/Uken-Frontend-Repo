import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { CreatorSummary } from "@/services";
import {
  useAdminApplications,
  useAdminPayouts,
  useAdminOrders,
} from "@/lib/queries";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: creatorsData } = useQuery<CreatorSummary[]>({
    queryKey: ["admin", "creators", "real"],
    queryFn: () => api.get<CreatorSummary[]>("/creators"),
  });
  const creators = Array.isArray(creatorsData) ? creatorsData : [];
  const { data: applications = [] } = useAdminApplications();
  const { data: payouts = [] } = useAdminPayouts();
  const { data: orders = [] } = useAdminOrders();

  const pendingApps = applications.filter((a) => a.status === "PENDING").length;
  const totalPayout = payouts.reduce((s, p) => s + (p.pendingPence ?? 0), 0);
  const payoutCreators = payouts.filter((p) => (p.pendingPence ?? 0) > 0).length;

  const ordersByStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Admin overview"
        title="UKEN, today."
        description="The platform at a glance — what's live, what's waiting, and what needs your attention."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active creators" value={String(creators.length)} hint="Live profiles" />
        <StatCard label="Pending applications" value={String(pendingApps)} hint="Awaiting review" />
        <StatCard label="Pending payouts" value={formatGBP(totalPayout)} hint="To be settled" />
        <StatCard label="Creators awaiting payout" value={String(payoutCreators)} hint="On the next cycle" />
        <StatCard label="Total orders" value={String(orders.length)} hint="All time" />
        {Object.entries(ordersByStatus).map(([s, n]) => (
          <StatCard key={s} label={s.toLowerCase()} value={String(n)} hint="orders" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActionCard
          title={`${pendingApps} applications awaiting review`}
          body="Move new artisans through the curation pipeline so the buyer-facing catalogue keeps growing."
          to="/admin/applications"
        />
        <ActionCard
          title="Review pending payouts"
          body="Approve payouts to push pending earnings to makers' accounts."
          to="/admin/payouts"
        />
      </div>
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
