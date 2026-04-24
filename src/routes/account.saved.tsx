import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, Bookmark, X } from "lucide-react";
import {
  PageHeader,
  EmptyState,
} from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import { creators } from "@/components/explore/creators-data";
import { getProduct } from "@/components/product/product-data";
import {
  useSavedProducts,
  useSavedCreators,
  useToggleSavedProduct,
  useToggleSavedCreator,
} from "@/lib/queries";
import { formatGBP, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/saved")({
  component: BuyerSaved,
});

type Tab = "pieces" | "makers";

function BuyerSaved() {
  const [tab, setTab] = useState<Tab>("pieces");
  const { data: productIds = [] } = useSavedProducts();
  const { data: creatorIds = [] } = useSavedCreators();
  const toggleProduct = useToggleSavedProduct();
  const toggleCreator = useToggleSavedCreator();
  const { addItem } = useCart();

  const products = useMemo(
    () =>
      productIds
        .map((id) => getProduct(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [productIds],
  );

  const savedCreators = useMemo(
    () =>
      creatorIds
        .map((id) => creators.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [creatorIds],
  );

  function unsaveProduct(id: string) {
    toggleProduct.mutate({ productId: id, saved: true });
  }
  function unsaveCreator(id: string) {
    toggleCreator.mutate({ creatorId: id, saved: true });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Saved"
        title="The pieces & makers you're keeping hold of."
        description="Hearts and bookmarks live here. Move pieces to your bag when you're ready."
      />

      <div className="flex gap-2 border-b border-border/60">
        <TabBtn active={tab === "pieces"} onClick={() => setTab("pieces")} icon={<Heart className="h-4 w-4" />} label={`Pieces (${products.length})`} />
        <TabBtn active={tab === "makers"} onClick={() => setTab("makers")} icon={<Bookmark className="h-4 w-4" />} label={`Makers (${savedCreators.length})`} />
      </div>

      {tab === "pieces" && (
        products.length === 0 ? (
          <EmptyState
            title="No pieces saved yet."
            body="Tap the heart on any piece to keep it here for later."
            action={
              <Link to="/shop" className="inline-flex items-center rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep">
                Browse the collection
              </Link>
            }
          />
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <li key={p.id} className="group relative">
                <Link to="/products/$productId" params={{ productId: p.id }} className="block">
                  <LazyImage src={p.heroImage} alt={p.name} ratio="1/1" wrapperClassName="rounded-xl" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                </Link>
                <button
                  type="button"
                  onClick={() => unsaveProduct(p.id)}
                  aria-label="Remove from saved"
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-warm-white/95 text-charcoal/70 shadow-sm hover:text-clay"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <p className="truncate font-display text-[15px] text-charcoal">{p.name}</p>
                  <span className="shrink-0 font-display text-[13px] text-clay-deep">{formatGBP(p.pricePence)}</span>
                </div>
                <p className="mt-0.5 truncate font-sans text-[11px] text-charcoal/55">{p.creator.fullName}</p>
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      productId: p.id,
                      name: p.name,
                      pricePence: p.pricePence,
                      image: p.heroImage,
                      creator: { id: p.creator.id, fullName: p.creator.fullName, region: p.creator.region },
                    })
                  }
                  className="mt-2 w-full rounded-full border border-charcoal/20 px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal hover:border-clay hover:bg-clay hover:text-warm-white"
                >
                  Move to bag
                </button>
              </li>
            ))}
          </ul>
        )
      )}

      {tab === "makers" && (
        savedCreators.length === 0 ? (
          <EmptyState
            title="No makers saved yet."
            body="Tap the bookmark on a maker's profile to keep them here."
            action={
              <Link to="/explore" className="inline-flex items-center rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep">
                Meet the makers
              </Link>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {savedCreators.map((c) => (
              <li key={c.id} className="group relative">
                <Link to="/creators/$creatorId" params={{ creatorId: c.id }} className="block">
                  <LazyImage src={c.image} alt={c.fullName} ratio="3/4" wrapperClassName="rounded-2xl" className="transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="mt-3">
                    <p className="font-display text-xl text-charcoal">{c.fullName}</p>
                    <p className="mt-0.5 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/55">{c.craft} · {c.region}</p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => unsaveCreator(c.id)}
                  aria-label="Remove maker"
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-warm-white/95 text-charcoal/70 shadow-sm hover:text-clay"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 border-b-2 px-4 py-3 font-sans text-[13px] font-medium transition-colors",
        active ? "border-clay text-charcoal" : "border-transparent text-charcoal/55 hover:text-charcoal",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
