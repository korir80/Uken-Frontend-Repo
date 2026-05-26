import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/services/api";
import type { CreatorSummary } from "@/services";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import { useSuspendCreator, useUnsuspendCreator } from "@/lib/queries";
import { isCreatorSuspended, type CreatorStatusLike } from "@/lib/creatorStatus";

type StatusFilter = "all" | "active" | "suspended";

export const Route = createFileRoute("/admin/creators")({
  component: AdminCreators,
});

type AdminCreatorRow = CreatorSummary & CreatorStatusLike;

function isSuspended(c: AdminCreatorRow): boolean {
  return isCreatorSuspended(c);
}


async function fetchAdminCreators(): Promise<AdminCreatorRow[]> {
  // The backend's public /creators endpoint hides suspended makers. Try the
  // admin-scoped variants first (which include suspended/deleted rows); fall
  // back through query-param hints; finally use the public list (active-only).
  const candidates = [
    "/admin/creators?status=all",
    "/admin/creators?includeSuspended=true",
    "/admin/creators",
    "/creators?status=all",
    "/creators?includeSuspended=true",
    "/creators",
  ];
  for (const path of candidates) {
    try {
      const r = await api.get<any>(path);
      const arr = r?.content ?? r;
      if (Array.isArray(arr)) return arr as AdminCreatorRow[];
    } catch {
      /* try next */
    }
  }
  return [];
}

function AdminCreators() {
  const { data, isLoading, isError, refetch } = useQuery<AdminCreatorRow[]>({
    queryKey: ["admin", "creators", "real"],
    queryFn: fetchAdminCreators,
  });
  const creators = Array.isArray(data) ? data : [];
  const suspend = useSuspendCreator();
  const unsuspend = useUnsuspendCreator();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const counts = useMemo(() => {
    const suspended = creators.filter(isSuspended).length;
    return { all: creators.length, suspended, active: creators.length - suspended };
  }, [creators]);

  const visibleCreators = useMemo(() => {
    if (statusFilter === "all") return creators;
    if (statusFilter === "suspended") return creators.filter(isSuspended);
    return creators.filter((c) => !isSuspended(c));
  }, [creators, statusFilter]);

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
        title="All makers on UKEN."
        description="Filter by status, open a maker's public page, suspend, or reinstate them."
        refreshKeys={[]}
      />

      <div className="flex flex-wrap items-center gap-2">
        {([
          { key: "all", label: "All", count: counts.all },
          { key: "active", label: "Active", count: counts.active },
          { key: "suspended", label: "Suspended", count: counts.suspended },
        ] as { key: StatusFilter; label: string; count: number }[]).map((f) => {
          const active = statusFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-full border px-4 py-1.5 font-sans text-[12px] transition-colors ${
                active
                  ? "border-clay bg-clay text-warm-white"
                  : "border-border bg-warm-white text-charcoal/70 hover:border-clay/60 hover:text-clay"
              }`}
            >
              {f.label} <span className="opacity-70">({f.count})</span>
            </button>
          );
        })}
      </div>

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
            {visibleCreators.map((c) => {
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
            {!isLoading && !isError && visibleCreators.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/55">
                  No creators match this filter.
                </td>
              </tr>
            )}
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
