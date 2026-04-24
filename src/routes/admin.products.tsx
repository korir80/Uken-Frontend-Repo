import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import type { ProductModerationStatus } from "@/services";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  useAllProducts,
  useAdminProductStatuses,
  useSetProductStatus,
} from "@/lib/queries";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { data: products = [], isLoading } = useAllProducts();
  const { data: statuses = [] } = useAdminProductStatuses();
  const setStatus = useSetProductStatus();

  const statusMap = useMemo(() => {
    const m = new Map<string, ProductModerationStatus>();
    for (const s of statuses) m.set(s.productId, s.status);
    return m;
  }, [statuses]);

  function update(productId: string, status: ProductModerationStatus) {
    setStatus.mutate(
      { productId, status },
      {
        onSuccess: () =>
          toast.success(
            `Marked ${status.replace(/_/g, " ").toLowerCase()}.`,
          ),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Products"
        title="Listing moderation."
        description="Approve drafts, take down listings that breach our guidelines, or feature a piece."
      />

      {isLoading ? (
        <p className="font-sans text-sm text-charcoal/60">Loading catalogue…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="min-w-[720px] divide-y divide-border/60 sm:min-w-full">
            <thead className="bg-cream/60 text-left">
              <tr>
                <Th>Piece</Th>
                <Th>Creator</Th>
                <Th className="text-right">Price</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-warm-white">
              {products.map((p) => {
                const s: ProductModerationStatus =
                  statusMap.get(p.id) ?? "LIVE";
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <LazyImage
                          src={p.heroImage}
                          alt=""
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <Link
                            to="/products/$productId"
                            params={{ productId: p.id }}
                            className="font-display text-base text-charcoal hover:underline"
                          >
                            {p.name}
                          </Link>
                          <p className="font-sans text-[12px] text-charcoal/55">
                            {p.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                      {p.creator.fullName}
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                      {formatGBP(p.pricePence)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill
                        label={s.replace(/_/g, " ").toLowerCase()}
                        tone={
                          s === "LIVE"
                            ? "good"
                            : s === "DRAFT"
                              ? "warn"
                              : "bad"
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[12px]">
                      {s !== "LIVE" && (
                        <button
                          disabled={setStatus.isPending}
                          onClick={() => update(p.id, "LIVE")}
                          className="text-clay hover:underline disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      {s === "LIVE" && (
                        <button
                          disabled={setStatus.isPending}
                          onClick={() => update(p.id, "TAKEN_DOWN")}
                          className="text-destructive hover:underline disabled:opacity-50"
                        >
                          Take down
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
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
