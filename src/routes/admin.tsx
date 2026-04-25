import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview", description: "Platform at a glance" },
  { to: "/admin/applications", label: "Applications", description: "Approve new makers" },
  { to: "/admin/creators", label: "Creators", description: "Manage active makers" },
  { to: "/admin/buyers", label: "Buyers", description: "User management" },
  { to: "/admin/products", label: "Products", description: "Listing moderation" },
  { to: "/admin/orders", label: "Orders", description: "Oversight & disputes" },
  { to: "/admin/payouts", label: "Payouts", description: "Creator earnings" },
  { to: "/admin/featured", label: "Curation", description: "Home page features" },
  { to: "/admin/content", label: "Content", description: "Reviews & stories" },
];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Studio — Uken" },
      { name: "description", content: "Moderate, oversee and curate the Uken marketplace." },
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
