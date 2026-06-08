import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { catalogueService } from "@/services/catalogueService";

export const Route = createFileRoute("/admin/revenue")({
  component: AdminRevenue,
});

function AdminRevenue() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "revenue"],
    queryFn: () => catalogueService.revenue(),
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Revenue"
        title="Platform income at a glance."
        description="Catalogue sales, creator commission, and the balance owed to makers."
        refreshKeys={[]}
      />

      {isLoading ? (
        <p className="font-sans text-[13px] text-charcoal/60">Loading…</p>
      ) : isError ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center font-sans text-[13px] text-destructive">
          {error instanceof Error ? error.message : "Couldn't load revenue."}{" "}
          <button onClick={() => refetch()} className="underline">Retry</button>
        </p>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total revenue"
              value={formatGBP(data.totalRevenuePence)}
              hint="All paid orders"
            />
            <StatCard
              label="Uken catalogue revenue"
              value={formatGBP(data.ukenaRevenuePence)}
              hint="Uken-owned sales"
            />
            <StatCard
              label="Platform commission"
              value={formatGBP(data.platformCommissionPence)}
              hint="40% from creator sales"
            />
            <StatCard
              label="Total Uken income"
              value={formatGBP(data.totalUkenaIncomePence)}
              hint="Catalogue + commission"
            />
            <StatCard
              label="Creator payouts balance"
              value={formatGBP(data.creatorPayoutsBalancePence)}
              hint="Net owed to creators"
            />
            <StatCard
              label="Total paid orders"
              value={String(data.totalPaidOrderCount)}
              hint="All time"
            />
            <StatCard
              label="Uken catalogue orders"
              value={String(data.ukenaOrderCount)}
              hint="Uken-fulfilled"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
