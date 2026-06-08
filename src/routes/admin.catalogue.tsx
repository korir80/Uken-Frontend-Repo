import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import { CloudinaryImagePicker } from "@/components/uploads/CloudinaryImagePicker";
import { formatGBP } from "@/lib/cart";
import { catalogueService } from "@/services/catalogueService";
import { productService } from "@/services/productService";
import type {
  ProductSummaryDto,
  ProductDto,
  ProductCreatePayload,
} from "@/services/productService";

export const Route = createFileRoute("/admin/catalogue")({
  component: AdminCatalogue,
});

interface Draft {
  id?: string;
  name: string;
  pricePounds: string;
  heroImage: string;
  pieceStory: string;
  materials: string;
  dimensions: string;
  care: string;
  gallery: string[];
}

const emptyDraft: Draft = {
  name: "",
  pricePounds: "",
  heroImage: "",
  pieceStory: "",
  materials: "",
  dimensions: "",
  care: "Wipe gently with a dry cloth.",
  gallery: [],
};

function toPayload(d: Draft): ProductCreatePayload {
  return {
    name: d.name.trim(),
    pricePence: Math.round(parseFloat(d.pricePounds || "0") * 100),
    heroImage: d.heroImage,
    pieceStory: d.pieceStory.trim(),
    materials: d.materials.split(",").map((m) => m.trim()).filter(Boolean),
    dimensions: d.dimensions.trim(),
    care: d.care.trim(),
  };
}

function AdminCatalogue() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Draft | null>(null);
  const [editingFullId, setEditingFullId] = useState<string | null>(null);

  const list = useQuery({
    queryKey: ["admin", "catalogue", "list"],
    queryFn: () => catalogueService.listAdmin(),
  });
  const products: ProductSummaryDto[] = Array.isArray(list.data) ? list.data : [];

  const detail = useQuery({
    queryKey: ["admin", "catalogue", "detail", editingFullId],
    queryFn: () => productService.getProductById(editingFullId!),
    enabled: !!editingFullId,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "catalogue"] });
    qc.invalidateQueries({ queryKey: ["catalogue"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const create = useMutation({
    mutationFn: (p: ProductCreatePayload) => catalogueService.create(p),
    onSuccess: () => { toast.success("Catalogue piece created."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, p }: { id: string; p: ProductCreatePayload }) =>
      catalogueService.update(id, p),
    onSuccess: () => { toast.success("Updated."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "OUT_OF_STOCK" }) =>
      catalogueService.setStatus(id, status),
    onSuccess: () => { toast.success("Status updated."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => catalogueService.remove(id),
    onSuccess: () => { toast.success("Deleted."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const addImage = useMutation({
    mutationFn: ({ id, url }: { id: string; url: string }) =>
      catalogueService.addImage(id, url),
    onSuccess: () => {
      toast.success("Image added.");
      qc.invalidateQueries({ queryKey: ["admin", "catalogue", "detail"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const removeImage = useMutation({
    mutationFn: ({ id, imageId }: { id: string; imageId: string | number }) =>
      catalogueService.removeImage(id, imageId),
    onSuccess: () => {
      toast.success("Image removed.");
      qc.invalidateQueries({ queryKey: ["admin", "catalogue", "detail"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openCreate() {
    setEditingFullId(null);
    setEditing({ ...emptyDraft });
  }

  async function openEdit(p: ProductSummaryDto) {
    // Fetch full detail to prefill story, materials, etc.
    setEditingFullId(p.id);
    try {
      const full = await productService.getProductById(p.id);
      setEditing({
        id: full.id,
        name: full.name,
        pricePounds: (full.pricePence / 100).toFixed(2),
        heroImage: full.heroImage,
        pieceStory: full.pieceStory ?? "",
        materials: (full.materials ?? []).join(", "),
        dimensions: full.dimensions ?? "",
        care: full.care ?? "",
        gallery: (full.images ?? []).map((i) => i.url),
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't load piece.");
    }
  }

  async function submit() {
    if (!editing) return;
    if (!editing.name.trim() || !editing.pricePounds || !editing.heroImage) {
      toast.error("Name, price and hero image are required.");
      return;
    }
    const payload = toPayload(editing);
    if (editing.id) {
      await update.mutateAsync({ id: editing.id, p: payload });
    } else {
      const created = await create.mutateAsync(payload);
      // Persist subsequent edits against the newly created id
      setEditing((d) => (d ? { ...d, id: created.id } : d));
      setEditingFullId(created.id);
      return;
    }
    setEditing(null);
    setEditingFullId(null);
  }

  async function confirmDelete(p: ProductSummaryDto) {
    if (!window.confirm(`Delete "${p.name}" permanently?`)) return;
    await remove.mutateAsync(p.id);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Catalogue"
        title="Uken-owned products."
        description="Pieces sourced and fulfilled directly by Uken — managed here."
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep"
          >
            <Plus className="h-4 w-4" /> New piece
          </button>
        }
        refreshKeys={[]}
      />

      {list.isLoading ? (
        <p className="font-sans text-[13px] text-charcoal/60">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="min-w-[720px] divide-y divide-border/60 sm:min-w-full">
            <thead className="bg-cream/60 text-left">
              <tr>
                <Th>Piece</Th>
                <Th className="text-right">Price</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 bg-warm-white">
              {products.map((p) => {
                const status = ((p as any).status as "ACTIVE" | "OUT_OF_STOCK") ?? "ACTIVE";
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <LazyImage src={p.heroImage} alt="" className="h-12 w-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-display text-base text-charcoal">{p.name}</p>
                          <p className="font-sans text-[12px] text-charcoal/55">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[13px] text-charcoal">
                      {formatGBP(p.pricePence)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill
                        label={status === "ACTIVE" ? "live" : "out of stock"}
                        tone={status === "ACTIVE" ? "good" : "warn"}
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-sans text-[12px]">
                      <div className="inline-flex items-center gap-3">
                        <button
                          onClick={() =>
                            setStatus.mutate({
                              id: p.id,
                              status: status === "ACTIVE" ? "OUT_OF_STOCK" : "ACTIVE",
                            })
                          }
                          className="text-clay hover:underline"
                        >
                          {status === "ACTIVE" ? "Mark out of stock" : "Mark live"}
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="inline-flex items-center gap-1 text-charcoal hover:underline"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(p)}
                          className="inline-flex items-center gap-1 text-destructive hover:underline"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center font-sans text-[13px] text-charcoal/60">
                    No catalogue pieces yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditorModal
          draft={editing}
          fullProduct={detail.data}
          onChange={setEditing}
          onClose={() => { setEditing(null); setEditingFullId(null); }}
          onSubmit={submit}
          saving={create.isPending || update.isPending}
          onAddImage={(url) => editing.id && addImage.mutate({ id: editing.id, url })}
          onRemoveImage={(imageId) =>
            editing.id && removeImage.mutate({ id: editing.id, imageId })
          }
        />
      )}
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

function EditorModal({
  draft,
  fullProduct,
  onChange,
  onClose,
  onSubmit,
  saving,
  onAddImage,
  onRemoveImage,
}: {
  draft: Draft;
  fullProduct?: ProductDto;
  onChange: (d: Draft) => void;
  onClose: () => void;
  onSubmit: () => void;
  saving: boolean;
  onAddImage: (url: string) => void;
  onRemoveImage: (imageId: string | number) => void;
}) {
  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    onChange({ ...draft, [k]: v });
  }
  const galleryImages = fullProduct?.images ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/40 p-4 backdrop-blur-sm">
      <div className="my-10 w-full max-w-2xl rounded-2xl bg-warm-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-charcoal">
            {draft.id ? "Edit catalogue piece" : "New catalogue piece"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-cream">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <Field label="Name">
            <input
              className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
          <Field label="Price (GBP)">
            <input
              type="number"
              step="0.01"
              className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm"
              value={draft.pricePounds}
              onChange={(e) => set("pricePounds", e.target.value)}
            />
          </Field>
          <Field label="Hero image">
            <CloudinaryImagePicker
              value={draft.heroImage ? [draft.heroImage] : []}
              onChange={(urls) => set("heroImage", urls[0] ?? "")}
              max={1}
              multiple={false}
              folder="ukena/catalogue"
              aspect="wide"
            />
          </Field>
          <Field label="Piece story">
            <textarea
              rows={4}
              className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm"
              value={draft.pieceStory}
              onChange={(e) => set("pieceStory", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Materials (comma-separated)">
              <input
                className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm"
                value={draft.materials}
                onChange={(e) => set("materials", e.target.value)}
              />
            </Field>
            <Field label="Dimensions">
              <input
                className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm"
                value={draft.dimensions}
                onChange={(e) => set("dimensions", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Care">
            <input
              className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm"
              value={draft.care}
              onChange={(e) => set("care", e.target.value)}
            />
          </Field>

          {draft.id && (
            <div className="rounded-lg border border-border/60 bg-cream/40 p-4">
              <p className="font-display text-sm text-charcoal">Gallery images</p>
              <p className="mt-1 text-[12px] text-charcoal/60">
                Add or remove additional images for this piece.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {galleryImages.map((img) => (
                  <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg">
                    <LazyImage src={img.url} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => onRemoveImage(img.id)}
                      className="absolute right-1 top-1 rounded-full bg-warm-white/90 p-1 text-destructive hover:bg-warm-white"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <CloudinaryImagePicker
                  value={[]}
                  onChange={(urls) => urls.forEach((u) => onAddImage(u))}
                  max={5}
                  folder="ukena/catalogue"
                  label="Add gallery images"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={onClose} className="rounded-full border border-border px-5 py-2 text-sm">
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={saving}
              className="rounded-full bg-clay px-5 py-2 text-sm text-warm-white hover:bg-clay-deep disabled:opacity-50"
            >
              {saving ? "Saving…" : draft.id ? "Save changes" : "Create piece"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-sans text-[12px] uppercase tracking-[0.18em] text-charcoal/60">
        {label}
      </span>
      {children}
    </label>
  );
}
