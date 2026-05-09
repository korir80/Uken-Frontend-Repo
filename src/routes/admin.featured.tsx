import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { FeaturedSlot } from "@/services";
import { PageHeader } from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  useAdminFeatured,
  useAllProducts,
  useCreators,
  useSetFeatured,
} from "@/lib/queries";

export const Route = createFileRoute("/admin/featured")({
  component: AdminFeatured,
});

function AdminFeatured() {
  const { data: creatorsData } = useCreators();
  const { data: productsData } = useAllProducts();
  const { data: serverSlotsData } = useAdminFeatured();
  const creators = Array.isArray(creatorsData) ? creatorsData : [];
  const products = Array.isArray(productsData) ? productsData : [];
  const serverSlots = Array.isArray(serverSlotsData) ? serverSlotsData : [];
  const save = useSetFeatured();

  const [slots, setSlots] = useState<FeaturedSlot[]>([]);

  // Hydrate the local editing buffer once the server payload arrives.
  useEffect(() => {
    if (serverSlots.length > 0) setSlots(serverSlots);
  }, [serverSlots]);

  const updateSlot = (position: number, patch: Partial<FeaturedSlot>) => {
    setSlots((prev) =>
      prev.map((s) => (s.position === position ? { ...s, ...patch } : s)),
    );
  };

  function handleSave() {
    save.mutate(slots, {
      onSuccess: () => toast.success("Curation saved — live on the home page."),
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Curation"
        title="The home page, in your hands."
        description="Choose four creators and four pieces to feature on the public home page. Changes go live immediately."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {slots.map((slot) => {
          const creator = creators.find((c) => c.id === slot.creatorId);
          const product = products.find((p) => p.id === slot.productId);
          return (
            <article
              key={slot.position}
              className="rounded-2xl border border-border/60 bg-warm-white p-5 shadow-soft"
            >
              <p className="section-label">Slot {slot.position}</p>

              <label className="mt-4 block">
                <span className="block font-sans text-[12px] font-medium text-charcoal">
                  Featured creator
                </span>
                <select
                  value={slot.creatorId ?? ""}
                  onChange={(e) =>
                    updateSlot(slot.position, {
                      creatorId: e.target.value || null,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] text-charcoal focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/15"
                >
                  <option value="">— None —</option>
                  {creators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} · {c.craft}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-3 block">
                <span className="block font-sans text-[12px] font-medium text-charcoal">
                  Featured piece
                </span>
                <select
                  value={slot.productId ?? ""}
                  onChange={(e) =>
                    updateSlot(slot.position, {
                      productId: e.target.value || null,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-warm-white px-3 py-2 font-sans text-[13px] text-charcoal focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/15"
                >
                  <option value="">— None —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.creator.firstName}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {creator && (
                  <div>
                    <LazyImage
                      src={creator.image}
                      alt={creator.fullName}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    <p className="mt-2 font-sans text-[12px] text-charcoal/70">
                      {creator.fullName}
                    </p>
                  </div>
                )}
                {product && (
                  <div>
                    <LazyImage
                      src={product.heroImage}
                      alt={product.name}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    <p className="mt-2 font-sans text-[12px] text-charcoal/70">
                      {product.name}
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div>
        <button
          onClick={handleSave}
          disabled={save.isPending || slots.length === 0}
          className="rounded-full bg-clay px-6 py-2.5 font-sans text-[13px] font-medium text-warm-white hover:bg-clay-deep disabled:opacity-60"
        >
          {save.isPending ? "Saving…" : "Save curation"}
        </button>
      </div>
    </div>
  );
}
