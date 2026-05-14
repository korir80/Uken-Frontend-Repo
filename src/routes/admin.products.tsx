import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  useAllProducts,
  useSetProductStatus,
  useDeleteProductAdmin,
} from "@/lib/queries";

type Status =
  | "ACTIVE"
  | "OUT_OF_STOCK"
  | "SUSPENDED_BY_CREATOR"
  | "SUSPENDED_BY_ADMIN";

const TONE: Record<Status, "neutral" | "good" | "warn" | "bad" | "info"> = {
  ACTIVE: "good",
  OUT_OF_STOCK: "warn",
  SUSPENDED_BY_CREATOR: "neutral",
  SUSPENDED_BY_ADMIN: "bad",
};

const LABEL: Record<Status, string> = {
  ACTIVE: "live",
  OUT_OF_STOCK: "out of stock",
  SUSPENDED_BY_CREATOR: "paused",
  SUSPENDED_BY_ADMIN: "suspended",
};

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { data, isLoading, isError, refetch } = useAllProducts();
  const products = Array.isArray(data) ? data : [];
  const setStatus = useSetProductStatus();
  const remove = useDeleteProductAdmin();

  function toggle(id: string, current: Status) {
    const next: "ACTIVE" | "SUSPENDED_BY_ADMIN" =
      current === "SUSPENDED_BY_ADMIN" ? "ACTIVE" : "SUSPENDED_BY_ADMIN";
    setStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => toast.success(`Marked ${LABEL[next as Status]}.`),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    remove.mutate(id, {
      onSuccess: () => toast.success("Product deleted."),
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Products"
        title="Listing moderation."
        description="Suspend listings that breach guidelines, or restore them when resolved."
        refreshKeys={[]}
      />

      {isError ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-center font-sans text-[13px] text-destructive">
          Couldn't load products.{" "}
          <button onClick={() => refetch()} className="underline">Retry</button>
        </p>
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
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-10 animate-pulse rounded bg-charcoal/[0.06]" />
                    </td>
                  </tr>
                ))}
              {products.map((p) => {
                const status = ((p as any).status as Status) ?? "ACTIVE";
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <LazyImage src={p.heroImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <Link
                            to="/products/$productId"
                            params={{ productId: p.id }}
                            className="font-display text-base text-charcoal hover:underline"
                          >
                            {p.name}
                          </Link>
                          <p className="font-sans text-[12px] text-charcoal/55">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                      {(p as any).creatorName ?? (p as any).creator?.fullName ?? ""}
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                      {formatGBP(p.pricePence)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill label={LABEL[status]} tone={TONE[status]} />
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[12px]">
                      <div className="inline-flex items-center gap-3">
                        <button
                          onClick={() => toggle(p.id, status)}
                          disabled={setStatus.isPending}
                          className="text-clay hover:underline disabled:opacity-50"
                        >
                          {status === "SUSPENDED_BY_ADMIN" ? "Reinstate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={remove.isPending}
                          className="text-destructive hover:underline disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
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
