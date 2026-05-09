import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard/DashboardShell";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orders"
        title="Order moderation."
        description="Admin order moderation is not yet available."
      />
      <p className="rounded-2xl border border-border/60 bg-cream/40 px-5 py-10 text-center font-sans text-[13px] text-charcoal/60">
        This view is unavailable until the backend exposes admin order endpoints.
      </p>
    </div>
  );
}
