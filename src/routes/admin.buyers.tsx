import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { useAdminBuyers, useSuspendBuyer } from "@/lib/queries";

export const Route = createFileRoute("/admin/buyers")({
  component: AdminBuyers,
});

function AdminBuyers() {
  const { data: buyers = [], isLoading } = useAdminBuyers();
  const suspend = useSuspendBuyer();

  function handleSuspend(id: string, name: string) {
    if (!window.confirm(`Suspend ${name}?`)) return;
    suspend.mutate(id, {
      onSuccess: () => toast.success(`${name} suspended.`),
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Buyers"
        title="People bringing the work home."
        description="Lifetime spend per buyer. Suspend a buyer or reset their access if abuse is reported."
      />

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="min-w-[720px] divide-y divide-border/60 sm:min-w-full">
          <thead className="bg-cream/60 text-left">
            <tr>
              <Th>Buyer</Th>
              <Th>City</Th>
              <Th>Orders</Th>
              <Th>Lifetime spend</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-warm-white">
            {buyers.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3">
                  <p className="font-display text-base text-charcoal">
                    {b.fullName}
                  </p>
                  <p className="font-sans text-[12px] text-charcoal/55">
                    {b.email}
                  </p>
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                  {b.city}
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                  {b.orderCount}
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal">
                  {formatGBP(b.totalPence)}
                </td>
                <td className="px-4 py-3">
                  {b.suspended ? (
                    <StatusPill label="suspended" tone="bad" />
                  ) : (
                    <StatusPill label="active" tone="good" />
                  )}
                </td>
                <td className="px-4 py-3 text-right font-sans text-[12px]">
                  <button className="text-charcoal/60 hover:text-charcoal hover:underline">
                    Reset password
                  </button>
                  <span className="mx-2 text-charcoal/30">·</span>
                  <button
                    disabled={suspend.isPending || b.suspended}
                    onClick={() => handleSuspend(b.id, b.fullName)}
                    className="text-destructive hover:underline disabled:opacity-50"
                  >
                    {b.suspended ? "Suspended" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && buyers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60"
                >
                  No buyers yet.
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60"
                >
                  Loading buyers…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
