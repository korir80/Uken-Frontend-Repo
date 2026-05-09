import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useAdminApplications,
  useAdminPayouts,
  useCreators,
} from "@/lib/queries";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: creators = [] } = useCreators();
  const { data: applications = [] } = useAdminApplications();
  const { data: payouts = [] } = useAdminPayouts();

  const pendingApps = applications.filter(
    (a) => a.status === "PENDING" || a.status === "UNDER_REVIEW",
  ).length;
  const totalPayout = payouts.reduce((s, p) => s + p.pendingPence, 0);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Admin overview"
        title="UKEN, today."
        description="The platform at a glance — what's live, what's waiting, and what needs your attention."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active creators"
          value={String(creators.length)}
          hint="Live profiles"
        />
        <StatCard
          label="Pending applications"
          value={String(pendingApps)}
          hint="Awaiting review"
        />
        <StatCard
          label="Pending payouts"
          value={formatGBP(totalPayout)}
          hint="To be settled"
        />
        <StatCard
          label="Payout creators"
          value={String(payouts.length)}
          hint="On the next cycle"
        />
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

      <section>
        <h2 className="font-display text-2xl text-charcoal">
          Top creators by revenue
        </h2>
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
                      <Link
                        to="/creators/$creatorId"
                        params={{ creatorId: p.creatorId }}
                        className="hover:underline"
                      >
                        {p.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                      {p.region}
                    </td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                      {p.craft}
                    </td>
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

function ActionCard({
  title,
  body,
  to,
}: {
  title: string;
  body: string;
  to: string;
}) {
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

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60 ${className}`}
    >
      {children}
    </th>
  );
}
