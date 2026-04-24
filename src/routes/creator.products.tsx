import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useProductsByCreator } from "@/lib/queries";
import { PageHeader, EmptyState, StatusPill } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { LazyImage } from "@/components/ui/lazy-image";

export const Route = createFileRoute("/creator/products")({
  component: CreatorProducts,
});

function CreatorProducts() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? "wanjiru";
  const { data: products = [] } = useProductsByCreator(creatorId);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your pieces"
        title="The work, in your own studio."
        description="Each piece carries your name. Edit details, mark drafts, or list a new piece for sale."
        action={
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className="rounded-full bg-clay px-5 py-2.5 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep"
          >
            + New piece
          </button>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          title="No pieces yet."
          body="Add your first piece to begin appearing in the shop."
          action={
            <button
              type="button"
              onClick={() => setShowNew(true)}
              className="rounded-full bg-clay px-5 py-2.5 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep"
            >
              Add a piece
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-2xl border border-border/60 bg-warm-white shadow-soft"
            >
              <Link to="/products/$productId" params={{ productId: p.id }} className="block aspect-[4/3] overflow-hidden">
                <LazyImage src={p.heroImage} alt={p.name} className="h-full w-full object-cover" />
              </Link>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg text-charcoal">{p.name}</h3>
                  <span className="font-sans text-sm text-charcoal">{formatGBP(p.pricePence)}</span>
                </div>
                <p className="mt-1 font-sans text-[12px] text-charcoal/60">
                  {p.dimensions}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <StatusPill label="Live" tone="good" />
                  <div className="flex gap-3 font-sans text-[12px]">
                    <button className="text-clay hover:underline">Edit</button>
                    <button className="text-charcoal/60 hover:text-charcoal hover:underline">
                      Mark draft
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* New piece sheet — mock only */}
      {showNew && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-charcoal/40 p-4 sm:items-center"
          onClick={() => setShowNew(false)}
        >
          <div
            className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col rounded-2xl bg-warm-white shadow-hero"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex-shrink-0 border-b border-border/40 p-6 pb-4">
              <p className="section-label">New piece</p>
              <h2 className="mt-3 font-display text-2xl text-charcoal">
                List something new.
              </h2>
              <p className="mt-2 font-sans text-[13px] text-charcoal/65">
                The full editor lands once the backend is wired. For now, this is the
                shape it will take.
              </p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              <Field label="Name" placeholder="e.g. Spiral table mat" />
              <Field label="Price (£)" placeholder="48" />
              <Field label="Dimensions" placeholder="H 28cm · Ø 26cm" />
              <Field label="Materials" placeholder="Hand-stripped sisal, plant dye" />
              <Field
                label="The story behind this piece"
                placeholder="A few sentences — what makes this one yours?"
                textarea
              />
            </div>
            <div className="flex flex-shrink-0 justify-end gap-3 border-t border-border/40 p-5">
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="rounded-full px-4 py-2 font-sans text-[13px] text-charcoal/60 hover:text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowNew(false)}
                className="rounded-full bg-clay px-5 py-2 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep"
              >
                Save (mock)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  placeholder,
  textarea,
}: {
  label: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-sans text-[12px] font-medium text-charcoal">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/15"
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/15"
        />
      )}
    </label>
  );
}
