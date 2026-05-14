import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { useAdminPayouts, usePayCreator } from "@/lib/queries";
import type { CreatorPayout } from "@/services";

export const Route = createFileRoute("/admin/payouts")({
  component: AdminPayouts,
});

function AdminPayouts() {
  const { data, isLoading, isError, refetch } = useAdminPayouts();
  const payouts = Array.isArray(data) ? data : [];
  const pay = usePayCreator();
  const [target, setTarget] = useState<CreatorPayout | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const totalPending = payouts.reduce((s, p) => s + (p.pendingPence ?? 0), 0);
  const totalPaidThisMonth = payouts.reduce(
    (s, p) => s + (p.paidThisMonthPence ?? 0),
    0,
  );
  const totalLifetime = payouts.reduce(
    (s, p) => s + (p.totalLifetimePence ?? 0),
    0,
  );

  function submitPayout() {
    if (!target) return;
    if (!accountNumber.trim() || !accountName.trim()) {
      toast.error("Account number and name are required.");
      return;
    }
    pay.mutate(
      {
        creatorId: target.creatorId,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Payout processed. Email sent to creator.");
          setTarget(null);
          setAccountNumber("");
          setAccountName("");
        },
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payouts"
        title="What we owe the makers."
        description="Approve a payout to push pending earnings to the maker's account."
        refreshKeys={[]}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending this cycle" value={formatGBP(totalPending)} />
        <StatCard label="Paid this month" value={formatGBP(totalPaidThisMonth)} />
        <StatCard label="Lifetime payouts" value={formatGBP(totalLifetime)} />
      </div>

      {isLoading ? (
        <SkeletonRows />
      ) : isError ? (
        <ErrorRow onRetry={() => refetch()} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="min-w-[720px] divide-y divide-border/60 sm:min-w-full">
            <thead className="bg-cream/60 text-left">
              <tr>
                <Th>Creator</Th>
                <Th>Region</Th>
                <Th className="text-right">Pending</Th>
                <Th className="text-right">Paid this month</Th>
                <Th className="text-right">Lifetime</Th>
                <Th>Last paid</Th>
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
                  <td className="px-4 py-3 font-sans text-[12px] text-charcoal/60">
                    {p.lastPaidAt ? new Date(p.lastPaidAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-[12px]">
                    {(p.pendingPence ?? 0) > 0 ? (
                      <button
                        onClick={() => setTarget(p)}
                        className="text-clay hover:underline"
                      >
                        Pay out
                      </button>
                    ) : (
                      <span className="text-charcoal/40">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60">
                    No payouts queued.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {target && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4"
          onClick={() => !pay.isPending && setTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-warm-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-xl text-charcoal">
              Pay {target.fullName}
            </h3>
            <p className="mt-1 font-sans text-[13px] text-charcoal/60">
              {formatGBP(target.pendingPence)} pending
            </p>

            <label className="mt-4 block">
              <span className="block font-sans text-[12px] font-medium text-charcoal">
                Account number
              </span>
              <input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] focus:border-clay focus:outline-none"
              />
            </label>
            <label className="mt-3 block">
              <span className="block font-sans text-[12px] font-medium text-charcoal">
                Account name
              </span>
              <input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] focus:border-clay focus:outline-none"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setTarget(null)}
                disabled={pay.isPending}
                className="rounded-full border border-border px-4 py-2 font-sans text-[13px] text-charcoal/70 hover:bg-cream/60"
              >
                Cancel
              </button>
              <button
                onClick={submitPayout}
                disabled={pay.isPending}
                className="rounded-full bg-clay px-5 py-2 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
              >
                {pay.isPending ? "Processing…" : "Confirm payout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="space-y-2 rounded-2xl border border-border/60 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-charcoal/[0.06]" />
      ))}
    </div>
  );
}

function ErrorRow({ onRetry }: { onRetry: () => void }) {
  return (
    <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center font-sans text-[13px] text-destructive">
      Couldn't load payouts.{" "}
      <button onClick={onRetry} className="underline hover:text-clay">
        Retry
      </button>
    </p>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60 ${className}`}
    >
      {children}
    </th>
  );
}
