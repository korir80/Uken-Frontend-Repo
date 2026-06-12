import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { ApplicationStatus } from "@/services";
import { ApiError } from "@/services/api";
import {
  PageHeader,
  StatusPill,
  EmptyState,
} from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  useAdminApplications,
  useUpdateApplicationStatus,
} from "@/lib/queries";
import { ExportMenu } from "@/components/ukena";
import { downloadCsv, downloadTableReportPdf } from "@/lib/exports";

const STATUS_TONE: Record<
  ApplicationStatus,
  "neutral" | "good" | "warn" | "bad" | "info"
> = {
  PENDING: "warn",
  UNDER_REVIEW: "info",
  APPROVED: "good",
  REJECTED: "bad",
  CHANGES_REQUESTED: "warn",
};

const FILTERS: { key: ApplicationStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "UNDER_REVIEW", label: "Under review" },
  { key: "CHANGES_REQUESTED", label: "Changes requested" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

export const Route = createFileRoute("/admin/applications")({
  component: AdminApplications,
});

function AdminApplications() {
  const [filter, setFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [open, setOpen] = useState<string | null>(null);

  const { data: items = [], isLoading } = useAdminApplications();
  const updateStatus = useUpdateApplicationStatus();

  const filtered =
    filter === "ALL" ? items : items.filter((a) => a.status === filter);
  const active =
    items.find((a) => a.id === open) ?? filtered[0] ?? items[0] ?? null;

  function setStatus(id: string, status: ApplicationStatus) {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () =>
          toast.success(`Marked ${status.replace(/_/g, " ").toLowerCase()}.`),
        onError: (e) => {
          if (e instanceof ApiError && e.status === 409) {
            toast.error(
              `This application is already marked as ${status
                .replace(/_/g, " ")
                .toLowerCase()}`,
            );
            return;
          }
          toast.error(e.message);
        },
      },
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Applications"
        title="The next generation of UKEN makers."
        description="Move artisans through the curation pipeline. Each decision should be based on the work and the story together."
        refreshKeys={[]}
        action={
          <ExportMenu
            disabled={filtered.length === 0}
            onCsv={() => {
              const cols = ["ID", "Name", "Email", "Craft", "Region", "Years", "Status"];
              const rows = filtered.map((a) => [
                a.id, a.fullName, a.email, a.craft, a.region, a.yearsOfPractice, a.status,
              ]);
              downloadCsv("ukena-applications", cols, rows);
            }}
            onPdf={() => {
              const cols = ["Name", "Craft", "Region", "Years", "Status"];
              const rows = filtered.map((a) => [a.fullName, a.craft, a.region, a.yearsOfPractice, a.status]);
              downloadTableReportPdf({
                filename: "ukena-applications",
                eyebrow: "Admin",
                title: "Applications report",
                columns: cols,
                rows,
              });
            }}
          />
        }
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 font-sans text-[12px] font-medium transition ${
              filter === f.key
                ? "bg-clay text-warm-white"
                : "bg-cream text-charcoal/70 hover:bg-sand-soft/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="font-sans text-sm text-charcoal/60">Loading applications…</p>
      ) : filtered.length === 0 ? (
        <EmptyState title="No applications in this state." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <ul className="space-y-3">
            {filtered.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setOpen(a.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    (open ?? active?.id) === a.id
                      ? "border-clay bg-cream"
                      : "border-border/60 bg-warm-white hover:border-clay/50"
                  }`}
                >
                  <LazyImage
                    src={a.portrait}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-base text-charcoal">
                      {a.fullName}
                    </p>
                    <p className="font-sans text-[12px] text-charcoal/55">
                      {a.craft} · {a.region}
                    </p>
                  </div>
                  <StatusPill
                    label={a.status.replace(/_/g, " ").toLowerCase()}
                    tone={STATUS_TONE[a.status]}
                  />
                </button>
              </li>
            ))}
          </ul>

          {active && (
            <article className="rounded-2xl border border-border/60 bg-warm-white p-6 shadow-soft">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[12px] text-charcoal/60">
                    {active.id}
                  </p>
                  <h2 className="mt-1 font-display text-2xl text-charcoal">
                    {active.fullName}
                  </h2>
                  <p className="font-sans text-[13px] text-charcoal/65">
                    {active.craft} · {active.region} ·{" "}
                    {active.yearsOfPractice} years practising
                  </p>
                  <p className="mt-1 font-sans text-[12px] text-charcoal/50">
                    {active.email}
                  </p>
                </div>
                <StatusPill
                  label={active.status.replace(/_/g, " ").toLowerCase()}
                  tone={STATUS_TONE[active.status]}
                />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <LazyImage
                  src={active.portrait}
                  alt=""
                  className="aspect-square w-full rounded-xl object-cover"
                />
                <LazyImage
                  src={active.workSample}
                  alt=""
                  className="aspect-square w-full rounded-xl object-cover"
                />
              </div>

              <div className="mt-5">
                <p className="section-label">Their story</p>
                <p className="mt-2 font-sans text-[14px] leading-relaxed text-charcoal/80">
                  {active.story}
                </p>
              </div>

              {active.status === "APPROVED" ? (
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-sans text-[13px] text-emerald-900">
                  This maker has been approved and their account has been created.
                  A welcome email with login credentials has been sent to {active.email}.
                </div>
              ) : active.status === "REJECTED" ? (
                <div className="mt-6 rounded-xl border border-border bg-cream/60 p-4 font-sans text-[13px] text-charcoal/70">
                  This application has been rejected. No further actions are available.
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap gap-2 border-t border-border/40 pt-5">
                  <button
                    disabled={updateStatus.isPending}
                    onClick={() => setStatus(active.id, "APPROVED")}
                    className="rounded-full bg-clay px-5 py-2 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
                  >
                    Approve
                  </button>
                  <button
                    disabled={updateStatus.isPending}
                    onClick={() => setStatus(active.id, "CHANGES_REQUESTED")}
                    className="rounded-full border border-border bg-warm-white px-5 py-2 font-sans text-[13px] text-charcoal hover:bg-cream disabled:opacity-60"
                  >
                    Request changes
                  </button>
                  <button
                    disabled={updateStatus.isPending}
                    onClick={() => setStatus(active.id, "UNDER_REVIEW")}
                    className="rounded-full border border-border bg-warm-white px-5 py-2 font-sans text-[13px] text-charcoal hover:bg-cream disabled:opacity-60"
                  >
                    Mark under review
                  </button>
                  <button
                    disabled={updateStatus.isPending}
                    onClick={() => setStatus(active.id, "REJECTED")}
                    className="rounded-full px-5 py-2 font-sans text-[13px] text-destructive hover:underline disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              )}
            </article>
          )}
        </div>
      )}
    </div>
  );
}
