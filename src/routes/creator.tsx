import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AlertOctagon } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/lib/auth";
import { useMyCreatorProfile } from "@/lib/queries";
import { isCreatorSuspended } from "@/lib/creatorStatus";

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
      { title: "Maker Studio — UKEN" },
      { name: "description", content: "Manage your pieces, orders, profile and earnings on UKEN." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CreatorLayout,
});

function SuspendedBanner() {
  const { user } = useAuth();
  const { data: profile } = useMyCreatorProfile(user?.creatorId ?? "");
  if (!isCreatorSuspended(profile as never)) return null;
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 px-5 py-4 text-amber-900"
    >
      <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="font-sans text-[13px] leading-relaxed">
        <p className="font-medium">Your maker page is currently suspended.</p>
        <p className="mt-1 text-amber-900/85">
          Buyers can't see your profile or pieces, and new orders are paused. Reach out to
          <a href="mailto:hello@ukena.co.uk" className="ml-1 underline">hello@ukena.co.uk</a>
          to discuss reinstatement.
        </p>
      </div>
    </div>
  );
}

function CreatorLayout() {
  return (
    <RoleGuard role="ROLE_CREATOR">
      <DashboardShell variant="creator" links={CREATOR_LINKS}>
        <SuspendedBanner />
        <Outlet />
      </DashboardShell>
    </RoleGuard>
  );
}
