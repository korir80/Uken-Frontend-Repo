import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const CREATOR_LINKS = [
  { to: "/creator", label: "Overview", description: "Today at a glance" },
  { to: "/creator/analytics", label: "Analytics", description: "Revenue, top buyers, funnel" },
  { to: "/creator/products", label: "Pieces", description: "Your catalogue" },
  { to: "/creator/orders", label: "Orders", description: "Awaiting your hands" },
  { to: "/creator/profile", label: "Your story", description: "Profile & images" },
  { to: "/creator/earnings", label: "Earnings", description: "Pending & paid" },
  { to: "/creator/application", label: "Application", description: "Status & history" },
];

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [
      { title: "Maker Studio — Ukena" },
      { name: "description", content: "Manage your pieces, orders, profile and earnings on Ukena." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CreatorLayout,
});

function CreatorLayout() {
  return (
    <RoleGuard role="ROLE_CREATOR">
      <DashboardShell variant="creator" links={CREATOR_LINKS}>
        <Outlet />
      </DashboardShell>
    </RoleGuard>
  );
}
