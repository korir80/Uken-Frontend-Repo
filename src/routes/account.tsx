import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const BUYER_LINKS = [
  { to: "/account", label: "Overview", description: "Your space at a glance" },
  { to: "/account/orders", label: "Orders", description: "Track & reorder" },
  { to: "/account/saved", label: "Saved", description: "Pieces & makers" },
  { to: "/account/addresses", label: "Addresses", description: "Where pieces land" },
  { to: "/account/profile", label: "Profile", description: "Your details" },
  { to: "/account/activity", label: "Activity", description: "Recently viewed" },
];

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — Ukena" },
      { name: "description", content: "Track orders, manage saved makers and pieces, and update your details." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <RoleGuard role="ROLE_BUYER">
      <DashboardShell variant="buyer" links={BUYER_LINKS}>
        <Outlet />
      </DashboardShell>
    </RoleGuard>
  );
}
