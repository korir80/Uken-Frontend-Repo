import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, Clock, Heart, ShoppingBag, X } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";
import { creators } from "@/components/explore/creators-data";
import {
  getAllProducts,
  getProduct,
  type Product,
} from "@/components/product/product-data";
import { readRecentProducts } from "@/lib/ukena-mode";
import {
  useSavedProducts,
  useSavedCreators,
  useToggleSavedProduct,
  useToggleSavedCreator,
} from "@/lib/queries";
import { formatGBP, useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved — UKEN" },
      {
        name: "description",
        content:
          "The makers and pieces you've kept hold of. Pick up where you left off.",
      },
      { property: "og:title", content: "Saved — UKEN" },
      {
        property: "og:description",
        content: "Your saved Kenyan makers and pieces.",
      },
    ],
  }),
  component: SavedPage,
});

type Tab = "pieces" | "creators" | "recent";

function SavedPage() {
  const [tab, setTab] = useState<Tab>("pieces");
  const { data: savedProductIds = [] } = useSavedProducts();
  const { data: savedCreatorIds = [] } = useSavedCreators();
  const toggleProduct = useToggleSavedProduct();
  const toggleCreator = useToggleSavedCreator();
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    // Recently-viewed is a local view-history surface, not server state.
    setRecentIds(readRecentProducts());
  }, []);

  const savedCreators = useMemo(
    () =>
      savedCreatorIds
        .map((id) => creators.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [savedCreatorIds],
  );

  /**
   * For every saved product id, resolve it against the catalogue. Ids that
   * no longer match a live product are surfaced as "found a home" cards
   * with a fallback to other pieces by the same creator (when we can find
   * the creator from the recent/saved context). Today the mock catalogue
   * is static so this exercises the empty-result branch — wired correctly
   * for when the real API marks pieces as sold-out.
   */
  const savedProducts = useMemo(() => {
    return savedProductIds.map((id) => ({
      id,
      product: getProduct(id) ?? null,
    }));
  }, [savedProductIds]);

  const recentProducts = useMemo(
    () =>
      recentIds
        .map((id) => getProduct(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [recentIds],
  );

  function unsaveCreator(id: string) {
    toggleCreator.mutate({ creatorId: id, saved: true });
  }

  function unsaveProduct(id: string) {
    toggleProduct.mutate({ productId: id, saved: true });
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
              The pieces and makers you've kept hold of. All stored on this
              device — sign in to keep them when you switch.
            </p>
          </div>
        </section>

        {/* Tabs */}
        <section className="sticky top-[64px] z-30 border-b border-border/60 bg-warm-white/95 backdrop-blur-md md:top-[76px]">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 md:px-10 md:py-4">
            <TabButton
              active={tab === "pieces"}
              onClick={() => setTab("pieces")}
              icon={<Heart className="h-4 w-4" />}
              label="Saved pieces"
              count={savedProducts.length}
            />
            <TabButton
              active={tab === "creators"}
              onClick={() => setTab("creators")}
              icon={<Bookmark className="h-4 w-4" />}
              label="Saved makers"
              count={savedCreators.length}
            />
            <TabButton
              active={tab === "recent"}
              onClick={() => setTab("recent")}
              icon={<Clock className="h-4 w-4" />}
              label="Recently viewed"
              count={recentProducts.length}
            />
          </div>
        </section>

        {/* Body */}
        <section className="py-10 md:py-16">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            {tab === "pieces" && (
              savedProducts.length === 0 ? (
                <EmptyState
                  title="No pieces saved yet"
                  body="Tap the heart on any piece to keep it here for later."
                  ctaLabel="Browse the collection"
                  ctaTo="/shop"
                />
              ) : (
                <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-8 md:gap-y-14 lg:grid-cols-4">
                  {savedProducts.map(({ id, product }) =>
                    product ? (
                      <SavedPieceCard
                        key={id}
                        product={product}
                        onRemove={() => unsaveProduct(id)}
                      />
                    ) : (
                      <FoundAHomeCard
                        key={id}
                        productId={id}
                        onRemove={() => unsaveProduct(id)}
                      />
                    ),
                  )}
                </ul>
              )
            )}

            {tab === "creators" && (
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
                        onClick={() => unsaveCreator(c.id)}
                        aria-label={`Remove ${c.firstName} from saved`}
                        className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-warm-white/95 text-charcoal/70 shadow-[var(--shadow-soft)] backdrop-blur transition-colors hover:bg-warm-white hover:text-clay"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )
            )}

            {tab === "recent" && (
              recentProducts.length === 0 ? (
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
              )
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── Saved-piece card with Remove + Move to bag ──────────────────────── */

interface SavedPieceCardProps {
  product: Product;
  onRemove: () => void;
}
function SavedPieceCard({ product, onRemove }: SavedPieceCardProps) {
  const { addItem } = useCart();
  const [moved, setMoved] = useState(false);

  function moveToBag() {
    addItem({
      productId: product.id,
      name: product.name,
      pricePence: product.pricePence,
      image: product.heroImage,
      creator: {
        id: product.creator.id,
        fullName: product.creator.fullName,
        region: product.creator.region,
      },
    });
    setMoved(true);
    // Remove from saved after a beat — feels intentional, not jarring.
    // onRemove already drives the saved-products mutation; no extra toggle needed.
    window.setTimeout(() => {
      onRemove();
    }, 900);
  }

  return (
    <li className="group relative flex flex-col">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="block"
      >
        <LazyImage
          src={product.heroImage}
          alt={product.name}
          ratio="1/1"
          wrapperClassName="rounded-2xl"
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${product.name} from saved`}
        className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-warm-white/95 text-charcoal/70 shadow-[var(--shadow-soft)] backdrop-blur transition-colors hover:bg-warm-white hover:text-clay"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-display text-[17px] leading-tight text-charcoal md:text-xl">
            {product.name}
          </p>
          <span className="shrink-0 font-display text-[15px] tabular-nums text-clay-deep md:text-base">
            {formatGBP(product.pricePence)}
          </span>
        </div>
        <p className="mt-1 text-[12px] text-ink-muted">
          by{" "}
          <Link
            to="/creators/$creatorId"
            params={{ creatorId: product.creator.id }}
            className="font-medium text-charcoal underline-offset-4 hover:text-clay hover:underline"
          >
            {product.creator.fullName}
          </Link>
        </p>

        <button
          type="button"
          onClick={moveToBag}
          disabled={moved}
          className={cn(
            "mt-3 inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border px-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors",
            moved
              ? "border-clay bg-clay text-warm-white"
              : "border-charcoal/25 text-charcoal hover:border-clay hover:bg-clay hover:text-warm-white",
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {moved ? "In your bag" : "Move to bag"}
        </button>
      </div>
    </li>
  );
}

/* ── Sold-out fallback: "This piece has found a home" ────────────────── */

interface FoundAHomeCardProps {
  productId: string;
  onRemove: () => void;
}
function FoundAHomeCard({ productId, onRemove }: FoundAHomeCardProps) {
  // Try to recover the creator from the productId prefix (mock convention),
  // and offer 1-2 alternatives by the same hand. Falls back to /shop.
  // Mock-data convention: ids look like "p-{slug}-NN". When the API is
  // wired up this card will receive the creator id directly from the
  // wishlist payload.
  const slug = productId.split("-")[1] ?? "";
  const alternatives = useMemo(() => {
    if (!slug) return [];
    return getAllProducts()
      .filter((p: Product) => p.id.startsWith(`p-${slug}-`))
      .slice(0, 2);
  }, [slug]);
  const creatorName = alternatives[0]?.creator.fullName;

  return (
    <li className="col-span-2 sm:col-span-3 lg:col-span-4">
      <article className="rounded-3xl border border-border/60 bg-cream/50 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-clay">
              Found a home
            </p>
            <h3 className="mt-3 font-display text-2xl italic text-charcoal md:text-3xl">
              This piece has gone to live with someone else.
            </h3>
            {creatorName && (
              <p className="mt-3 max-w-xl text-base text-charcoal/75">
                Here are more pieces from{" "}
                <span className="font-medium text-charcoal">
                  {creatorName}
                </span>{" "}
                — every one made by the same hand.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove from saved"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-warm-white text-charcoal/70 transition-colors hover:text-clay"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {alternatives.length > 0 ? (
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {alternatives.map((p) => (
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
                  <p className="mt-2 font-display text-base leading-tight text-charcoal">
                    {p.name}
                  </p>
                  <p className="text-[12px] text-ink-muted">
                    {formatGBP(p.pricePence)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Link
            to="/shop"
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-charcoal/30 px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.22em] text-charcoal hover:border-clay hover:bg-clay hover:text-warm-white"
          >
            Browse other pieces
          </Link>
        )}
      </article>
    </li>
  );
}

/* ── Tabs + empty state ──────────────────────────────────────────────── */

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
        "inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300",
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
