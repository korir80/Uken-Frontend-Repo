import { createFileRoute } from "@tanstack/react-router";
import { Info, Wallet } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCreatorOrders, useAdminPayouts } from "@/lib/queries";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { ExportMenu } from "@/components/ukena";
import { downloadCsv, downloadTableReportPdf } from "@/lib/exports";

export const Route = createFileRoute("/creator/earnings")({
  component: CreatorEarnings,
});

/** Share of each sale that flows to the creator. The remaining 40% covers
 *  shipping, customs, payment processing, platform operations and marketing. */
const CREATOR_SHARE = 0.6;

function creatorShare(pence: number) {
  return Math.round(pence * CREATOR_SHARE);
}

function CreatorEarnings() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? "";
  const { data: orders = [] } = useCreatorOrders();
  const { data: payouts = [] } = useAdminPayouts();
  const summary = payouts.find((p) => p.creatorId === creatorId);

  const myOrders = orders.filter((o) => o.items.some((i) => i.creator.id === creatorId));
  const cols = ["Order", "Date", "Status", "Gross (GBP)", "Your share 60% (GBP)"];
  const rows = myOrders.map((o) => {
    const gross = o.items
      .filter((i) => i.creator.id === creatorId)
      .reduce((s, i) => s + i.pricePence * i.quantity, 0);
    const share = creatorShare(gross);
    return [
      o.id,
      new Date(o.createdAt).toLocaleDateString("en-GB"),
      o.status,
      (gross / 100).toFixed(2),
      (share / 100).toFixed(2),
    ];
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Earnings"
        title="Fair work, paid fairly."
        description="You earn 60% of every sale. UKEN keeps 40% to cover shipping, customs, payments, marketing and the team running the platform."
        refreshKeys={[]}
        action={
          <ExportMenu
            disabled={rows.length === 0}
            onCsv={() => downloadCsv("ukena-earnings", cols, rows)}
            onPdf={() =>
              downloadTableReportPdf({
                filename: "ukena-earnings",
                eyebrow: "Earnings",
                title: "Earnings statement",
                columns: cols,
                rows,
              })
            }
          />
        }
      />

      {/* 60 / 40 split explainer */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-clay/30 bg-clay/[0.06] p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay/15 text-clay">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg text-charcoal">The 60 / 40 split</h3>
              <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-charcoal/75">
                For every order, <strong className="text-charcoal">60% of the sale price is yours</strong>.
                The remaining 40% pays for international shipping, customs, payment processing,
                photography, the marketplace, and the team supporting both makers and buyers.
                The split is published and never changes without notice.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-cream/40 p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-charcoal/10 text-charcoal">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg text-charcoal">How payouts work</h3>
              <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-charcoal/75">
                Right now, payouts are made <strong className="text-charcoal">manually via M-Pesa</strong>{" "}
                after each sale clears. We're moving to{" "}
                <strong className="text-charcoal">automatic monthly payouts</strong> — issued on the
                1st of each month whenever your balance exceeds <strong className="text-charcoal">€100</strong>.
                Balances under €100 roll forward until the threshold is reached.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending (your 60%)"
          value={formatGBP(creatorShare(summary?.pendingPence ?? 0))}
          hint="Next M-Pesa payout"
        />
        <StatCard
          label="Paid this month"
          value={formatGBP(creatorShare(summary?.paidThisMonthPence ?? 0))}
        />
        <StatCard
          label="Lifetime"
          value={formatGBP(creatorShare(summary?.totalLifetimePence ?? 0))}
          hint="Since you joined"
        />
      </div>

      <section>
        <h2 className="font-display text-2xl text-charcoal">Recent transactions</h2>
        <p className="mt-1 font-sans text-[13px] text-charcoal/60">
          "Your share" already reflects the 60% maker split.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60">
          <table className="min-w-[640px] divide-y divide-border/60 sm:min-w-full">
            <thead className="bg-cream/60 text-left">
              <tr>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Order</th>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Date</th>
                <th className="px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Status</th>
                <th className="px-4 py-3 text-right font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Gross</th>
                <th className="px-4 py-3 text-right font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60">Your share (60%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-warm-white">
              {myOrders.map((o) => {
                const gross = o.items
                  .filter((i) => i.creator.id === creatorId)
                  .reduce((s, i) => s + i.pricePence * i.quantity, 0);
                const share = creatorShare(gross);
                return (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono text-[12px] text-charcoal/80">{o.id}</td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                      {new Date(o.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                      {o.status.toLowerCase()}
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal/60">
                      {formatGBP(gross)}
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[13px] font-medium text-charcoal">
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
