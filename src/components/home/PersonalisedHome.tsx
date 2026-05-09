import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookmarkCheck, Clock, Repeat, Sparkles } from "lucide-react";
import { Button, SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";
import { useCreators, useAllProducts } from "@/lib/queries";
import { readRecentProducts } from "@/lib/ukena-mode";
import { useSavedCreators, useBuyerOrders } from "@/lib/queries";
import { formatGBP } from "@/lib/cart";
import type { AuthUserDto } from "@/types/api";

interface PersonalisedHomeProps {
  user: AuthUserDto;
}

/**
 * PersonalisedHome — replaces the marketing hero for returning, signed-in
 * buyers. Five strips, in priority order:
 *
 *  1. Greeting strip
 *  2. Saved makers (horizontal scroll on mobile)
 *  3. Recently viewed pieces
 *  4. Quick reorder — most recent order, "Buy again"
 *  5. Discover something new — three creators they haven't saved yet
 */
export function PersonalisedHome({ user }: PersonalisedHomeProps) {
  const { data: savedIds = [] } = useSavedCreators();
  const { data: orders = [] } = useBuyerOrders();

  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentIds(readRecentProducts());
  }, []);

  const savedCreators = useMemo(
    () =>
      savedIds
        .map((id) => creators.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .slice(0, 5),
    [savedIds],
  );

  const recentProducts = useMemo(
    () =>
      recentIds
        .map((id) => getProduct(id))
        .filter((p): p is NonNullable<ReturnType<typeof getProduct>> => Boolean(p))
        .slice(0, 4),
    [recentIds],
  );

  // "Discover" — three creators not already saved, deterministic.
  const discoverCreators = useMemo(() => {
    const savedSet = new Set(savedIds);
    return creators.filter((c) => !savedSet.has(c.id)).slice(0, 3);
  }, [savedIds]);

  // Most recent order's first item drives the "Buy again" strip. Sorted by
  // createdAt desc so we always reflect their latest purchase, not the
  // ephemeral cart-side `lastOrder` (which was lost on refresh).
  const lastPurchase = useMemo(() => {
    if (orders.length === 0) return null;
    const sorted = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return sorted[0]?.items?.[0] ?? null;
  }, [orders]);

  const firstName = (user.fullName ?? "").split(" ")[0] || "friend";
  const empty =
    savedCreators.length === 0 &&
    recentProducts.length === 0 &&
    !lastPurchase;

  return (
    <section className="bg-warm-white pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* 1 — Greeting */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel tone="terracotta">Welcome back</SectionLabel>
            <h1 className="mt-5 font-display text-[36px] leading-[1.04] tracking-tight text-charcoal sm:text-5xl md:text-6xl">
              Welcome back, <em className="italic text-clay">{firstName}.</em>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/70 md:text-lg">
              {empty
                ? "You haven't saved a maker or viewed a piece yet. Start where the work begins — with the hands."
                : "Picking up where you left off — the makers and pieces you came back for."}
            </p>
          </div>

          <Link
            to="/explore"
            className="story-link inline-flex items-center gap-2 self-start text-sm font-medium uppercase tracking-[0.18em] text-charcoal/70 hover:text-clay md:self-end"
          >
            Back to explore <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Empty-state — first-time authed visit */}
        {empty && (
          <div className="mt-12 grid gap-4 rounded-3xl border border-border/60 bg-cream/40 p-6 md:grid-cols-2 md:p-10">
            <div>
              <h3 className="font-display text-2xl text-charcoal md:text-3xl">
                Begin with a maker
              </h3>
              <p className="mt-3 text-base leading-relaxed text-charcoal/70">
                The story leads you to the work. Save the ones whose hands you
                want to follow.
              </p>
              <Button asChild variant="primary" size="md" className="mt-6">
                <Link to="/explore">
                  Meet the makers <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div>
              <h3 className="font-display text-2xl text-charcoal md:text-3xl">
                Or browse the collection
              </h3>
              <p className="mt-3 text-base leading-relaxed text-charcoal/70">
                Pieces first — the maker is always one tap away.
              </p>
              <Button asChild variant="secondary" size="md" className="mt-6">
                <Link to="/shop">Browse the collection</Link>
              </Button>
            </div>
          </div>
        )}

        {/* 2 — Saved makers (horizontal scroll on mobile, grid on desktop) */}
        {savedCreators.length > 0 && (
          <Strip
            icon={<BookmarkCheck className="h-5 w-5 text-clay" />}
            title="Your saved makers"
            link={{ to: "/saved", label: "See all" }}
          >
            {/* Mobile horizontal scroll */}
            <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:hidden">
              {savedCreators.map((c) => (
                <li
                  key={c.id}
                  className="w-[62%] shrink-0 snap-start"
                >
                  <SavedCreatorCard creatorId={c.id} fullName={c.fullName} craft={c.craft} region={c.region} image={c.image} />
                </li>
              ))}
            </ul>

            {/* Desktop grid */}
            <ul className="hidden gap-6 md:grid md:grid-cols-5">
              {savedCreators.map((c) => (
                <li key={c.id}>
                  <SavedCreatorCard creatorId={c.id} fullName={c.fullName} craft={c.craft} region={c.region} image={c.image} />
                </li>
              ))}
            </ul>
          </Strip>
        )}

        {/* 3 — Recently viewed */}
        {recentProducts.length > 0 && (
          <Strip
            icon={<Clock className="h-5 w-5 text-clay" />}
            title="Pick up where you left off"
            link={{ to: "/shop", label: "Shop more" }}
          >
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
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
                      <p className="font-display text-lg leading-tight text-charcoal">
                        {p.name}
                      </p>
                      <p className="mt-1 text-sm text-charcoal/65">
                        {formatGBP(p.pricePence)} · by {p.creator.firstName}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Strip>
        )}

        {/* 4 — Quick reorder */}
        {lastPurchase && (
          <Strip
            icon={<Repeat className="h-5 w-5 text-clay" />}
            title="Buy it again"
          >
            <article className="overflow-hidden rounded-3xl border border-border/60 bg-cream/40">
              <div className="grid items-stretch md:grid-cols-12">
                <div className="md:col-span-5 lg:col-span-4">
                  <LazyImage
                    src={lastPurchase.image}
                    alt={lastPurchase.name}
                    ratio="4/3"
                    wrapperClassName="h-full"
                  />
                </div>
                <div className="flex flex-col gap-4 p-6 md:col-span-7 md:p-10 lg:col-span-8">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                    From your last order
                  </span>
                  <h3 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
                    {lastPurchase.name}
                  </h3>
                  <p className="text-base text-charcoal/70">
                    by{" "}
                    <Link
                      to="/creators/$creatorId"
                      params={{ creatorId: lastPurchase.creator.id }}
                      className="font-medium text-charcoal underline-offset-4 hover:text-clay hover:underline"
                    >
                      {lastPurchase.creator.fullName}
                    </Link>{" "}
                    · {lastPurchase.creator.region}
                  </p>
                  <p className="font-display text-2xl tabular-nums text-clay-deep md:text-3xl">
                    {formatGBP(lastPurchase.pricePence)}
                  </p>
                  <div className="mt-2">
                    <Button asChild variant="primary" size="md">
                      <Link
                        to="/products/$productId"
                        params={{ productId: lastPurchase.productId }}
                      >
                        Buy again <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </Strip>
        )}

        {/* 5 — Discover something new */}
        {discoverCreators.length > 0 && (
          <Strip
            icon={<Sparkles className="h-5 w-5 text-clay" />}
            title="Discover something new"
            link={{ to: "/explore", label: "All makers" }}
          >
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
              {discoverCreators.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/creators/$creatorId"
                    params={{ creatorId: c.id }}
                    className="group block"
                  >
                    <LazyImage
                      src={c.image}
                      alt={c.fullName}
                      ratio="3/4"
                      wrapperClassName="rounded-2xl"
                      className="transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="mt-4">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-clay">
                        {c.craft}
                      </p>
                      <p className="mt-1.5 font-display text-2xl leading-tight text-charcoal">
                        {c.fullName}
                      </p>
                      <p className="mt-1 text-sm text-charcoal/70 line-clamp-2">
                        {c.hook}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Strip>
        )}
      </div>
    </section>
  );
}

/* ── helpers ─────────────────────────────────────────────────────────── */

interface StripProps {
  icon: React.ReactNode;
  title: string;
  link?: { to: "/saved" | "/shop" | "/explore"; label: string };
  children: React.ReactNode;
}
function Strip({ icon, title, link, children }: StripProps) {
  return (
    <div className="mt-14 md:mt-20">
      <header className="mb-6 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 font-display text-2xl text-charcoal md:text-3xl">
          {icon}
          {title}
        </h2>
        {link && (
          <Link
            to={link.to}
            className="text-[11px] uppercase tracking-[0.2em] text-charcoal/60 hover:text-clay"
          >
            {link.label}
          </Link>
        )}
      </header>
      {children}
    </div>
  );
}

interface SavedCreatorCardProps {
  creatorId: string;
  fullName: string;
  craft: string;
  region: string;
  image: string;
}
function SavedCreatorCard({
  creatorId,
  fullName,
  craft,
  region,
  image,
}: SavedCreatorCardProps) {
  return (
    <Link
      to="/creators/$creatorId"
      params={{ creatorId }}
      className="group block"
    >
      <LazyImage
        src={image}
        alt={fullName}
        ratio="3/4"
        wrapperClassName="rounded-2xl"
        className="transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="mt-3">
        <p className="font-display text-lg leading-tight text-charcoal">
          {fullName}
        </p>
        <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-charcoal/55">
          {craft} · {region}
        </p>
      </div>
    </Link>
  );
}
