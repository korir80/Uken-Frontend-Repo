import { createFileRoute, Link } from "@tanstack/react-router";
import { useCreators } from "@/lib/queries";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";

export const Route = createFileRoute("/admin/creators")({
  component: AdminCreators,
});

function AdminCreators() {
  const { data: creators = [] } = useCreators();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creators"
        title="Active makers on Ukena."
        description="Suspend a creator if needed, mark a profile as featured, or open their public page."
      />

      <div className="overflow-hidden rounded-2xl border border-border/60">
        <table className="min-w-full divide-y divide-border/60">
          <thead className="bg-cream/60 text-left">
            <tr>
              <Th>Creator</Th>
              <Th>Craft</Th>
              <Th>Region</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-warm-white">
            {creators.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <LazyImage src={c.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-display text-base text-charcoal">{c.fullName}</p>
                      <p className="font-sans text-[12px] text-charcoal/55">{c.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{c.craft}</td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">{c.region}</td>
                <td className="px-4 py-3">
                  <StatusPill label="active" tone="good" />
                </td>
                <td className="px-4 py-3 text-right font-sans text-[12px]">
                  <Link
                    to="/creators/$creatorId"
                    params={{ creatorId: c.id }}
                    className="text-clay hover:underline"
                  >
                    View
                  </Link>
                  <span className="mx-2 text-charcoal/30">·</span>
                  <button className="text-charcoal/60 hover:text-charcoal hover:underline">
                    Feature
                  </button>
                  <span className="mx-2 text-charcoal/30">·</span>
                  <button className="text-destructive hover:underline">Suspend</button>
                </td>
              </tr>
            ))}
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
