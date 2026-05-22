import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  PageHeader,
  StatusPill,
  EmptyState,
} from "@/components/dashboard/DashboardShell";
import { useBuyerOrders } from "@/lib/queries";
import { type OrderStatus } from "@/services";
import { formatGBP } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportMenu } from "@/components/ukena";
import { downloadCsv, downloadTableReportPdf } from "@/lib/exports";

export const Route = createFileRoute("/account/orders")({
  component: BuyerOrders,
});

const STATUS_TONE: Record<
  OrderStatus,
  "neutral" | "good" | "warn" | "bad" | "info"
> = {
  PENDING: "warn",
  PAID: "info",
  PREPARING: "info",
  SHIPPED: "info",
  DELIVERED: "good",
  CANCELLED: "bad",
};

const FILTERS: { label: string; value: "all" | OrderStatus }[] = [
  { label: "All", value: "all" },
  { label: "In flight", value: "PREPARING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function BuyerOrders() {
  const { data: orders = [], isLoading } = useBuyerOrders();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  const filtered = useMemo(
    () =>
      filter === "all" ? orders : orders.filter((o) => o.status === filter),
    [filter, orders],
  );

  const exportCols = ["Order", "Date", "Items", "Status", "Total (GBP)"];
  const exportRows = filtered.map((o) => [
    o.id,
    new Date(o.createdAt).toLocaleDateString("en-GB"),
    o.items.length,
    o.status,
    (o.totalPence / 100).toFixed(2),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orders"
        title="Every piece, every journey."
        description="Track what's on its way and revisit pieces you've collected."
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-4 py-1.5 font-sans text-[12px] font-medium transition-colors",
                filter === f.value
                  ? "bg-clay text-warm-white"
                  : "border border-border/60 text-charcoal/70 hover:border-clay/60 hover:text-charcoal",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <ExportMenu
          disabled={filtered.length === 0}
          onCsv={() => downloadCsv("ukena-my-orders", exportCols, exportRows)}
          onPdf={() =>
            downloadTableReportPdf({
              filename: "ukena-my-orders",
              eyebrow: "My orders",
              title: "Order history",
              columns: exportCols,
              rows: exportRows,
            })
          }
        />
      </div>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full px-4 py-1.5 font-sans text-[12px] font-medium transition-colors",
              filter === f.value
                ? "bg-clay text-warm-white"
                : "border border-border/60 text-charcoal/70 hover:border-clay/60 hover:text-charcoal",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ul className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="rounded-2xl border border-border/60 bg-warm-white p-4 sm:p-5"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No orders here."
          body={
            filter === "all"
              ? "Once you place your first order it'll appear here."
              : "Nothing matches this filter yet."
          }
          action={
            <Link
              to="/shop"
              className="inline-flex items-center rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
            >
              Browse the collection
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((o) => (
            <li key={o.id}>
              <Link
                to="/account/orders/$orderId"
                params={{ orderId: o.id }}
                className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-warm-white p-4 transition-all hover:border-clay/50 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={o.items[0]?.image}
                    alt=""
                    className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-base text-charcoal">
                      {o.id}
                    </p>
                    <p className="truncate font-sans text-[12px] text-charcoal/60">
                      {new Date(o.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {o.items.length}{" "}
                      {o.items.length === 1 ? "piece" : "pieces"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:gap-6">
                  <StatusPill
                    label={o.status.toLowerCase()}
                    tone={STATUS_TONE[o.status]}
                  />
                  <span className="font-display text-base text-charcoal">
                    {formatGBP(o.totalPence)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-charcoal/30 transition-transform group-hover:translate-x-0.5 group-hover:text-clay" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
