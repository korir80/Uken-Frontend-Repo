import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useCreateMyProduct, useUpdateMyProduct, useDeleteMyProduct } from "@/lib/queries";
import { productService } from "@/services/productService";
import type { ProductSummaryDto, ProductCreatePayload } from "@/services/productService";
import { PageHeader, EmptyState, StatusPill } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { LazyImage } from "@/components/ui/lazy-image";
import { CloudinaryImagePicker } from "@/components/uploads/CloudinaryImagePicker";
import { ConsentCheckbox } from "@/components/ukena";

export const Route = createFileRoute("/creator/products")({
  component: CreatorProducts,
});

interface DraftProduct {
  id?: string;
  name: string;
  pricePounds: string;
  dimensions: string;
  materials: string;
  pieceStory: string;
  care: string;
  images: string[];
}

const emptyDraft: DraftProduct = {
  name: "",
  pricePounds: "",
  dimensions: "",
  materials: "",
  pieceStory: "",
  care: "Wipe gently with a dry cloth.",
  images: [],
};

function toPayload(d: DraftProduct): ProductCreatePayload {
  const pricePence = Math.round(parseFloat(d.pricePounds || "0") * 100);
  const [hero] = d.images;
  return {
    name: d.name.trim(),
    pricePence,
    heroImage: hero ?? "",
    pieceStory: d.pieceStory.trim(),
    materials: d.materials
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean),
    dimensions: d.dimensions.trim(),
    care: d.care.trim(),
  };
}

function fromSummary(p: ProductSummaryDto): DraftProduct {
  return {
    id: p.id,
    name: p.name,
    pricePounds: (p.pricePence / 100).toFixed(2),
    dimensions: "",
    materials: "",
    pieceStory: "",
    care: "",
    images: p.heroImage ? [p.heroImage] : [],
  };
}

function CreatorProducts() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? "";

  const { data: rawProducts, isLoading } = useQuery({
    queryKey: ["creator-my-products", creatorId],
    queryFn: () => productService.getMyProducts(),
    enabled: !!user,
  });
  const products: ProductSummaryDto[] = Array.isArray(rawProducts) ? rawProducts : [];

  const create = useCreateMyProduct(creatorId);
  const update = useUpdateMyProduct(creatorId);
  const remove = useDeleteMyProduct(creatorId);

  const [editing, setEditing] = useState<DraftProduct | null>(null);

  function startNew() {
    setEditing({ ...emptyDraft });
  }

  async function commit(d: DraftProduct) {
    if (d.images.length === 0) {
      toast.error("Add at least one image so the piece has a cover.");
      return;
    }
    if (!d.name.trim() || !d.pricePounds.trim()) {
      toast.error("Name and price are required.");
      return;
    }
    try {
      const payload = toPayload(d);
      if (d.id) {
        await update.mutateAsync({ id: d.id, payload });
        toast.success("Piece updated.");
      } else {
        await create.mutateAsync(payload);
        toast.success("Piece listed.");
      }
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save the piece.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}"? This can't be undone.`)) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Piece removed.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove that piece.");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Your pieces"
        title="The work, in your own studio."
        description="Each piece carries your name. Edit details, mark drafts, or list a new piece for sale."
        action={
          <button
            type="button"
            onClick={startNew}
            className="rounded-full bg-clay px-5 py-2.5 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep"
          >
            + New piece
          </button>
        }
        refreshKeys={[]}
      />

      {isLoading ? (
        <p className="font-sans text-[13px] text-charcoal/60">Loading your pieces…</p>
      ) : products.length === 0 ? (
        <EmptyState
          title="No pieces yet."
          body="Add your first piece to begin appearing in the shop."
          action={
            <button
              type="button"
              onClick={startNew}
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
              <Link
                to="/products/$productId"
                params={{ productId: p.id }}
                className="block aspect-[4/3] overflow-hidden"
              >
                <LazyImage src={p.heroImage} alt={p.name} className="h-full w-full object-cover" />
              </Link>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg text-charcoal">{p.name}</h3>
                  <span className="font-sans text-sm text-charcoal">{formatGBP(p.pricePence)}</span>
                </div>
                <p className="mt-1 font-sans text-[12px] text-charcoal/60">{p.craft}</p>
                <div className="mt-4 flex items-center justify-between">
                  <StatusPill label="Live" tone="good" />
                  <div className="flex gap-3 font-sans text-[12px]">
                    <button onClick={() => setEditing(fromSummary(p))} className="text-clay hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-destructive hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editing && (
        <ProductEditor
          value={editing}
          saving={create.isPending || update.isPending}
          onCancel={() => setEditing(null)}
          onSave={commit}
        />
      )}
    </div>
  );
}

function ProductEditor({
  value,
  saving,
  onCancel,
  onSave,
}: {
  value: DraftProduct;
  saving: boolean;
  onCancel: () => void;
  onSave: (d: DraftProduct) => void;
}) {
  const [draft, setDraft] = useState(value);
  // Per-submission consent — resets each time the editor opens (because the
  // component remounts) so the maker re-affirms publishing rights every save.
  const [consent, setConsent] = useState(false);
  function set<K extends keyof DraftProduct>(k: K, v: DraftProduct[K]) {
    setDraft((p) => ({ ...p, [k]: v }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-charcoal/40 p-3 sm:items-center sm:p-6"
      onClick={onCancel}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!consent) {
            toast.error("Please tick the consent box to publish this piece.");
            return;
          }
          onSave(draft);
        }}
        onClick={(e) => e.stopPropagation()}
        className="my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-warm-white shadow-2xl"
      >
        <header className="flex-shrink-0 border-b border-border/40 px-6 py-4">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-clay">
            {draft.id ? "Edit piece" : "New piece"}
          </p>
          <h2 className="mt-2 font-display text-2xl text-charcoal">
            {draft.id ? draft.name || "Edit your piece" : "List something new."}
          </h2>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <CloudinaryImagePicker
            label="Photos"
            helper="The first photo becomes the cover. Use natural light, square crop ideal."
            value={draft.images}
            onChange={(urls) => set("images", urls)}
            max={6}
            folder="ukena/products"
          />
          <Field label="Name" value={draft.name} onChange={(v) => set("name", v)} placeholder="Spiral table mat" />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Price (£)"
              value={draft.pricePounds}
              onChange={(v) => set("pricePounds", v)}
              placeholder="48.00"
              type="number"
            />
            <Field
              label="Dimensions"
              value={draft.dimensions}
              onChange={(v) => set("dimensions", v)}
              placeholder="H 28cm · Ø 26cm"
            />
          </div>
          <Field
            label="Materials (comma-separated)"
            value={draft.materials}
            onChange={(v) => set("materials", v)}
            placeholder="Hand-stripped sisal, plant dye"
          />
          <Field
            label="The story behind this piece"
            value={draft.pieceStory}
            onChange={(v) => set("pieceStory", v)}
            placeholder="A few sentences — what makes this one yours?"
            textarea
          />
          <Field label="Care instructions" value={draft.care} onChange={(v) => set("care", v)} textarea />
        </div>

        <footer className="flex flex-shrink-0 justify-end gap-3 border-t border-border/40 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 font-sans text-[13px] text-charcoal/60 hover:text-charcoal"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-clay px-5 py-2 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
          >
            {saving ? "Saving…" : draft.id ? "Save changes" : "Publish piece"}
          </button>
        </footer>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-charcoal/55">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/15"
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/15"
        />
      )}
    </label>
  );
}
