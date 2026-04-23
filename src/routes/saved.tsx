import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, Clock, X } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";
import { creators } from "@/components/explore/creators-data";
import { getProduct } from "@/components/product/product-data";
import {
  readRecentProducts,
  readSavedCreators,
  writeSavedCreators,
} from "@/lib/ukena-mode";
import { formatGBP } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved — Ukena" },
      {
        name: "description",
        content:
          "The makers and pieces you've kept hold of. Pick up where you left off.",
      },
      { property: "og:title", content: "Saved — Ukena" },
      {
        property: "og:description",
        content: "Your saved Kenyan makers and recently viewed pieces.",
      },
    ],
  }),
  component: SavedPage,
});

type Tab = "creators" | "pieces";

function SavedPage() {
  const [tab, setTab] = useState<Tab>("creators");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(readSavedCreators());
    setRecentIds(readRecentProducts());
  }, []);

  const savedCreators = useMemo(
    () =>
      savedIds
        .map((id) => creators.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [savedIds],
  );

  const recentProducts = useMemo(
    () =>
      recentIds
        .map((id) => getProduct(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [recentIds],
  );

  function unsave(id: string) {
    const next = savedIds.filter((x) => x !== id);
    setSavedIds(next);
    writeSavedCreators(next);
  }

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main className="pb-24 md:pb-32">
        {/* Header */}
        <section className="border-b border-border/60 bg-warm-white">
          <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-10 md:pb-16 md:pt-20">
            <SectionLabel>Where you left off</SectionLabel>
            <h1 className="mt-5 font-display text-[36px] leading-[1.05] tracking-tight text-charcoal sm:text-5xl md:text-7xl">
              Your <em className="italic text-clay">saved</em>.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted md:text-[17px]">
              The makers you've kept hold of, and the pieces you've recently
              spent time with. All stored on this device.
            </p>
          </div>
        </section>

        {/* Tabs */}
        <section className="sticky top-[64px] z-30 border-b border-border/60 bg-warm-white/95 backdrop-blur-md md:top-[76px]">
          <div className="mx-auto flex max-w-7xl gap-2 px-5 py-3 md:px-10 md:py-4">
            <TabButton
              active={tab === "creators"}
              onClick={() => setTab("creators")}
              icon={<Bookmark className="h-4 w-4" />}
              label="Saved makers"
              count={savedCreators.length}
            />
            <TabButton
              active={tab === "pieces"}
              onClick={() => setTab("pieces")}
              icon={<Clock className="h-4 w-4" />}
              label="Recently viewed"
              count={recentProducts.length}
            />
          </div>
        </section>

        {/* Body */}
        <section className="py-10 md:py-16">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            {tab === "creators" ? (
              savedCreators.length === 0 ? (
                <EmptyState
                  title="No makers saved yet"
                  body="Tap the bookmark on a maker's profile to keep them here."
                  ctaLabel="Meet the makers"
                  ctaTo="/explore"
                />
              ) : (
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {savedCreators.map((c) => (
                    <li key={c.id} className="group relative">
                      <Link
                        to="/creators/$creatorId"
                        params={{ creatorId: c.id }}
                        className="block"
                      >
                        <LazyImage
                          src={c.image}
                          alt={c.fullName}
                          ratio="3/4"
                          wrapperClassName="rounded-2xl"
                          className="transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <div className="mt-4">
                          <p className="font-display text-2xl text-charcoal">
                            {c.fullName}
                          </p>
                          <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-ink-muted">
                            {c.craft} · {c.region}
                          </p>
                        </div>
                      </Link>
                      <button
                        type="button"
                        onClick={() => unsave(c.id)}
                        aria-label={`Remove ${c.firstName} from saved`}
                        className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-warm-white/95 text-charcoal/70 shadow-[var(--shadow-soft)] backdrop-blur transition-colors hover:bg-warm-white hover:text-clay"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : recentProducts.length === 0 ? (
              <EmptyState
                title="Nothing viewed yet"
                body="Pieces you open will appear here so you can find them again."
                ctaLabel="Browse the collection"
                ctaTo="/shop"
              />
            ) : (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
                {recentProducts.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/products/$productId"
                      params={{ productId: p.id }}
                      className="group block"
                    >
                      <LazyImage
                        src={p.heroImage}
                        alt={p.name}
                        ratio="1/1"
                        wrapperClassName="rounded-2xl"
                        className="transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="mt-3">
                        <p className="font-display text-[18px] leading-tight text-charcoal md:text-xl">
                          {p.name}
                        </p>
                        <p className="mt-1 text-sm text-ink-muted">
                          {formatGBP(p.pricePence)} · {p.creator.firstName}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}
function TabButton({ active, onClick, icon, label, count }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300",
        active
          ? "border-charcoal bg-charcoal text-warm-white"
          : "border-border/80 bg-warm-white text-charcoal/75 hover:border-clay/60 hover:text-clay",
      )}
    >
      {icon}
      <span>{label}</span>
      <span
        className={cn(
          "tabular-nums text-[11px]",
          active ? "text-warm-white/65" : "text-ink-muted/70",
        )}
      >
        {count}
      </span>
    </button>
  );
}

interface EmptyStateProps {
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: "/explore" | "/shop";
}
function EmptyState({ title, body, ctaLabel, ctaTo }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-cream/40 px-6 py-16 text-center md:py-24">
      <p className="font-display text-3xl italic text-charcoal md:text-4xl">
        {title}
      </p>
      <p className="mx-auto mt-4 max-w-md text-base text-ink-muted">{body}</p>
      <Link
        to={ctaTo}
        className="mt-8 inline-flex min-h-[48px] items-center gap-3 rounded-full bg-clay px-7 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-warm-white transition-colors hover:bg-clay-deep"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
