import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { ProductReview } from "@/services";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { useAdminReviews, useUpdateReviewStatus } from "@/lib/queries";

const TONE: Record<
  ProductReview["status"],
  "neutral" | "good" | "warn" | "bad" | "info"
> = {
  PUBLISHED: "good",
  PENDING: "warn",
  FLAGGED: "bad",
  REMOVED: "neutral",
};

const FILTERS: { key: ProductReview["status"] | "ALL"; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "PENDING", label: "Pending" },
  { key: "FLAGGED", label: "Flagged" },
  { key: "PUBLISHED", label: "Published" },
  { key: "REMOVED", label: "Removed" },
];

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

function AdminContent() {
  const { data, isLoading } = useAdminReviews();
  const reviews = Array.isArray(data) ? data : [];
  const updateStatus = useUpdateReviewStatus();
  const [filter, setFilter] = useState<ProductReview["status"] | "ALL">("ALL");

  const filtered =
    filter === "ALL" ? reviews : reviews.filter((r) => r.status === filter);

  function setStatus(id: string, status: ProductReview["status"]) {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Marked ${status.toLowerCase()}.`),
        onError: (e) => toast.error(e.message),
      },
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content moderation"
        title="Reviews & buyer stories."
        description="Approve, remove, or flag any review or story published on UKEN."
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
        <p className="font-sans text-sm text-charcoal/60">Loading reviews…</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-border/60 bg-warm-white p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="font-mono text-[12px] text-charcoal/55">
                    {r.id}
                  </p>
                  <p className="mt-1 font-display text-lg text-charcoal">
                    {r.productName}
                  </p>
                  <p className="font-sans text-[12px] text-charcoal/55">
                    {r.buyerName} · {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </p>
                </div>
                <StatusPill label={r.status.toLowerCase()} tone={TONE[r.status]} />
              </div>

              <p className="mt-4 font-sans text-[14px] leading-relaxed text-charcoal/85">
                "{r.body}"
              </p>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-border/40 pt-4">
                <button
                  disabled={updateStatus.isPending}
                  onClick={() => setStatus(r.id, "PUBLISHED")}
                  className="rounded-full bg-clay px-4 py-1.5 font-sans text-[12px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
                >
                  Publish
                </button>
                <button
                  disabled={updateStatus.isPending}
                  onClick={() => setStatus(r.id, "REMOVED")}
                  className="rounded-full px-4 py-1.5 font-sans text-[12px] text-destructive hover:underline disabled:opacity-60"
                >
                  Remove
                </button>
                {r.status !== "FLAGGED" && (
                  <button
                    disabled={updateStatus.isPending}
                    onClick={() => setStatus(r.id, "FLAGGED")}
                    className="rounded-full px-4 py-1.5 font-sans text-[12px] text-charcoal/60 hover:text-charcoal hover:underline disabled:opacity-60"
                  >
                    Flag for second review
                  </button>
                )}
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-2xl border border-border/60 bg-cream/40 px-5 py-8 text-center font-sans text-[13px] text-charcoal/60">
              No reviews in this state.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
