import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import type { CreatorSummary } from "@/services";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";

export const Route = createFileRoute("/admin/creators")({
  component: AdminCreators,
});

function AdminCreators() {
  const { data, isLoading, isError, refetch } = useQuery<CreatorSummary[]>({
    queryKey: ["admin", "creators", "real"],
    queryFn: () => api.get<CreatorSummary[]>("/creators"),
  });
  const creators = Array.isArray(data) ? data : [];
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creators"
        title="Active makers on UKEN."
        description="Suspend a creator if needed, mark a profile as featured, or open their public page."
      />

      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="min-w-[720px] divide-y divide-border/60 sm:min-w-full">
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
                    <LazyImage
                      src={c.image}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-display text-base text-charcoal">
                        {c.fullName}
                      </p>
                      <p className="font-sans text-[12px] text-charcoal/55">
                        {c.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                  {c.craft}
                </td>
                <td className="px-4 py-3 font-sans text-[13px] text-charcoal/70">
                  {c.region}
                </td>
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
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60"
                >
                  Loading creators…
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center font-sans text-[13px] text-destructive"
                >
                  Couldn't load creators.{" "}
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="underline hover:text-clay"
                  >
                    Retry
                  </button>
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
