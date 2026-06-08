import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview", description: "Platform at a glance" },
  { to: "/admin/applications", label: "Applications", description: "Approve new makers" },
  { to: "/admin/creators", label: "Creators", description: "Manage active makers" },
  { to: "/admin/buyers", label: "Buyers", description: "User management" },
  { to: "/admin/products", label: "Products", description: "Listing moderation" },
  { to: "/admin/catalogue", label: "Catalogue", description: "Uken-owned products" },
  { to: "/admin/orders", label: "Orders", description: "Oversight & disputes" },
  { to: "/admin/revenue", label: "Revenue", description: "Platform income" },
  { to: "/admin/payouts", label: "Payouts", description: "Creator earnings" },
  { to: "/admin/reviews", label: "Reviews", description: "Moderate buyer reviews" },
  { to: "/admin/curation", label: "Curation", description: "Featured slots" },
  { to: "/admin/delivery-zones", label: "Delivery Zones", description: "Shipping fees" },
  { to: "/admin/staff", label: "Staff", description: "Admin & support" },
];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Studio — UKEN" },
      { name: "description", content: "Moderate, oversee and curate the UKEN marketplace." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <RoleGuard role="ROLE_ADMIN">
      <DashboardShell variant="admin" links={ADMIN_LINKS}>
        <Outlet />
      </DashboardShell>
    </RoleGuard>
  );
}
