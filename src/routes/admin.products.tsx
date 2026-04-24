import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getAllProducts } from "@/components/product/product-data";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { LazyImage } from "@/components/ui/lazy-image";

type Status = "LIVE" | "DRAFT" | "TAKEN_DOWN";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const seedProducts = getAllProducts();
  const [statuses, setStatuses] = useState<Record<string, Status>>(() =>
    Object.fromEntries(seedProducts.map((p) => [p.id, "LIVE" as Status])),
  );

  const setStatus = (id: string, status: Status) =>
    setStatuses((prev) => ({ ...prev, [id]: status }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Products"
        title="Listing moderation."
        description="Approve drafts, take down listings that breach our guidelines, or feature a piece."
      />

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
            {seedProducts.map((p) => {
              const s = statuses[p.id];
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
                    {p.creator.fullName}
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                    {formatGBP(p.pricePence)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      label={s.replace(/_/g, " ").toLowerCase()}
                      tone={s === "LIVE" ? "good" : s === "DRAFT" ? "warn" : "bad"}
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-sans text-[12px]">
                    {s !== "LIVE" && (
                      <button
                        onClick={() => setStatus(p.id, "LIVE")}
                        className="text-clay hover:underline"
                      >
                        Approve
                      </button>
                    )}
                    {s === "LIVE" && (
                      <button
                        onClick={() => setStatus(p.id, "TAKEN_DOWN")}
                        className="text-destructive hover:underline"
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
