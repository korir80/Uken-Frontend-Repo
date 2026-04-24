import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  PageHeader,
  EmptyState,
} from "@/components/dashboard/DashboardShell";
import { LazyImage } from "@/components/ui/lazy-image";
import { getProduct } from "@/components/product/product-data";
import { creators } from "@/components/explore/creators-data";
import {
  readRecentProducts,
  readSavedCreators,
} from "@/lib/ukena-mode";
import { formatGBP } from "@/lib/cart";

export const Route = createFileRoute("/account/activity")({
  component: BuyerActivity,
});

function BuyerActivity() {
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [savedCreatorIds, setSavedCreatorIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentIds(readRecentProducts());
    setSavedCreatorIds(readSavedCreators());
  }, []);

  const recent = useMemo(
    () => recentIds.map((id) => getProduct(id)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [recentIds],
  );

  const suggestions = useMemo(() => {
    return creators.filter((c) => !savedCreatorIds.includes(c.id)).slice(0, 4);
  }, [savedCreatorIds]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Activity"
        title="Where you've been wandering."
        description="Pieces you've recently opened and a few makers you might love."
      />

      <section className="space-y-4">
        <h2 className="font-display text-xl text-charcoal sm:text-2xl">Recently viewed</h2>
        {recent.length === 0 ? (
          <EmptyState title="Nothing viewed yet." body="Pieces you open will appear here so you can find them again." />
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {recent.map((p) => (
              <li key={p.id}>
                <Link to="/products/$productId" params={{ productId: p.id }} className="group block">
                  <LazyImage
                    src={p.heroImage}
                    alt={p.name}
                    ratio="1/1"
                    wrapperClassName="rounded-xl"
                    className="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <p className="mt-2 truncate font-display text-[14px] text-charcoal">{p.name}</p>
                  <p className="font-sans text-[11px] text-charcoal/55">
                    {formatGBP(p.pricePence)} · {p.creator.firstName}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl text-charcoal sm:text-2xl">Makers you might love</h2>
          <Link to="/explore" className="font-sans text-[12px] text-clay hover:underline">
            Meet them all →
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {suggestions.map((c) => (
            <li key={c.id}>
              <Link to="/creators/$creatorId" params={{ creatorId: c.id }} className="group block">
                <LazyImage
                  src={c.image}
                  alt={c.fullName}
                  ratio="3/4"
                  wrapperClassName="rounded-xl"
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <p className="mt-2 font-display text-[15px] text-charcoal">{c.fullName}</p>
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/55">
                  {c.craft} · {c.region}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
