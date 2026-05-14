import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { CreatorSummary } from "@/services";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import { useDeleteCreator } from "@/lib/queries";

export const Route = createFileRoute("/admin/creators")({
  component: AdminCreators,
});

function AdminCreators() {
  const { data, isLoading, isError, refetch } = useQuery<CreatorSummary[]>({
    queryKey: ["admin", "creators", "real"],
    queryFn: () => api.get<CreatorSummary[]>("/creators"),
  });
  const creators = Array.isArray(data) ? data : [];
  const remove = useDeleteCreator();

  function handleDelete(id: string, name: string) {
    if (
      !window.confirm(
        `This will hide ${name} and all their products. Are you sure?`,
      )
    )
      return;
    remove.mutate(id, {
      onSuccess: () => toast.success(`${name} removed.`),
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creators"
        title="Active makers on UKEN."
        description="Open a maker's public page or remove them from the marketplace."
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
                  <div className="inline-flex items-center gap-3">
                    <Link
                      to="/creators/$creatorId"
                      params={{ creatorId: c.id }}
                      target="_blank"
                      className="text-clay hover:underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id, c.fullName)}
                      disabled={remove.isPending}
                      className="text-destructive hover:underline disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-4 py-3">
                    <div className="h-10 animate-pulse rounded bg-charcoal/[0.06]" />
                  </td>
                </tr>
              ))}
            {isError && !isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center font-sans text-[13px] text-destructive">
                  Couldn't load creators.{" "}
                  <button onClick={() => refetch()} className="underline hover:text-clay">
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

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60 ${className}`}>
      {children}
    </th>
  );
}
