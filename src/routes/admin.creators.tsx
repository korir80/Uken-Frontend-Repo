import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { CreatorSummary } from "@/services";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import { useSuspendCreator, useUnsuspendCreator } from "@/lib/queries";

export const Route = createFileRoute("/admin/creators")({
  component: AdminCreators,
});

type AdminCreatorRow = CreatorSummary & {
  deletedAt?: string | null;
  status?: string;
};

function isSuspended(c: AdminCreatorRow): boolean {
  if (c.deletedAt != null) return true;
  if (typeof c.status === "string" && c.status.toUpperCase() === "SUSPENDED")
    return true;
  return false;
}

async function fetchAdminCreators(): Promise<AdminCreatorRow[]> {
  // Try admin-scoped endpoint first (includes suspended); fall back to public.
  try {
    const r = await api.get<any>("/admin/creators");
    const arr = r?.content ?? r;
    if (Array.isArray(arr)) return arr as AdminCreatorRow[];
  } catch {
    /* fall through */
  }
  const r = await api.get<any>("/creators");
  const arr = r?.content ?? r;
  return Array.isArray(arr) ? (arr as AdminCreatorRow[]) : [];
}

function AdminCreators() {
  const { data, isLoading, isError, refetch } = useQuery<AdminCreatorRow[]>({
    queryKey: ["admin", "creators", "real"],
    queryFn: fetchAdminCreators,
  });
  const creators = Array.isArray(data) ? data : [];
  const suspend = useSuspendCreator();
  const unsuspend = useUnsuspendCreator();

  function handleSuspend(id: string, name: string) {
    if (
      !window.confirm(
        "This will hide this creator, block their login, and suspend all their products. You can unsuspend them at any time.",
      )
    )
      return;
    suspend.mutate(id, {
      onSuccess: () => {
        toast.success("Creator suspended");
        refetch();
      },
      onError: (e) => toast.error(e.message),
    });
  }

  function handleUnsuspend(id: string) {
    unsuspend.mutate(id, {
      onSuccess: () => {
        toast.success("Creator reinstated");
        refetch();
      },
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creators"
        title="Active makers on UKEN."
        description="Open a maker's public page, suspend, or reinstate them."
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
            {creators.map((c) => {
              const suspended = isSuspended(c);
              const busy = suspend.isPending || unsuspend.isPending;
              return (
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
                    {suspended ? (
                      <StatusPill label="suspended" tone="bad" />
                    ) : (
                      <StatusPill label="active" tone="good" />
                    )}
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
                      {suspended ? (
                        <button
                          onClick={() => handleUnsuspend(c.id)}
                          disabled={busy}
                          className="text-emerald-600 hover:underline disabled:opacity-50"
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspend(c.id, c.fullName)}
                          disabled={busy}
                          className="text-amber-600 hover:underline disabled:opacity-50"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
