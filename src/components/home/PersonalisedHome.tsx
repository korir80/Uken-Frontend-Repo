import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookmarkCheck, Clock } from "lucide-react";
import { Button, SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";
import { creators } from "@/components/explore/creators-data";
import { getProduct } from "@/components/product/product-data";
import { readRecentProducts, readSavedCreators } from "@/lib/ukena-mode";
import type { AuthUser } from "@/services";

interface PersonalisedHomeProps {
  user: AuthUser;
}

/**
 * PersonalisedHome — replaces the marketing hero for returning, signed-in
 * buyers. Shows their saved creators + recently viewed products, with a
 * "Back to explore" link so they can always step out of the personalised
 * surface. Reads from localStorage (saved + recently viewed) — wires to
 * the API in Phase 6.
 */
export function PersonalisedHome({ user }: PersonalisedHomeProps) {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(readSavedCreators());
    setRecentIds(readRecentProducts());
  }, []);

  const savedCreators = useMemo(
    () => savedIds.map((id) => creators.find((c) => c.id === id)).filter(Boolean).slice(0, 4),
    [savedIds],
  );
  const recentProducts = useMemo(
    () => recentIds.map((id) => getProduct(id)).filter(Boolean).slice(0, 4),
    [recentIds],
  );

  const firstName = (user.name ?? "").split(" ")[0] || "friend";
  const empty = savedCreators.length === 0 && recentProducts.length === 0;

  return (
    <section className="bg-warm-white pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Greeting */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel tone="terracotta">Welcome back</SectionLabel>
            <h1 className="mt-5 font-display text-4xl leading-[1.04] tracking-tight text-charcoal md:text-6xl">
              Good to see you, <em className="italic text-clay">{firstName}.</em>
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
          <div className="mt-12 grid gap-4 rounded-3xl border border-border/60 bg-cream/40 p-8 md:grid-cols-2 md:p-10">
            <div>
              <h3 className="font-display text-2xl text-charcoal md:text-3xl">
                Begin with a maker
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
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
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                Pieces first — the maker is always one tap away.
              </p>
              <Button asChild variant="secondary" size="md" className="mt-6">
                <Link to="/shop">Browse the collection</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Saved creators */}
        {savedCreators.length > 0 && (
          <div className="mt-16">
            <header className="mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 font-display text-2xl text-charcoal md:text-3xl">
                <BookmarkCheck className="h-5 w-5 text-clay" />
                Your saved makers
              </h2>
              <Link
                to="/explore"
                className="text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-clay"
              >
                See all
              </Link>
            </header>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {savedCreators.map((c) =>
                c ? (
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
                      <div className="mt-3">
                        <p className="font-display text-lg text-charcoal">{c.fullName}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/55">
                          {c.craft} · {c.region}
                        </p>
                      </div>
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        )}

        {/* Recently viewed */}
        {recentProducts.length > 0 && (
          <div className="mt-16">
            <header className="mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 font-display text-2xl text-charcoal md:text-3xl">
                <Clock className="h-5 w-5 text-clay" />
                Recently viewed
              </h2>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-[0.2em] text-charcoal/60 hover:text-clay"
              >
                Shop more
              </Link>
            </header>
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {recentProducts.map((p) =>
                p ? (
                  <li key={p.id}>
                    <Link
                      to="/products/$productId"
                      params={{ productId: p.id }}
                      className="group block"
                    >
                      <LazyImage
                        src={p.heroImage}
                        alt={p.name}
                        ratio="4/5"
                        wrapperClassName="rounded-2xl"
                        className="transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="mt-3">
                        <p className="font-display text-lg leading-tight text-charcoal">
                          {p.name}
                        </p>
                        <p className="mt-1 text-sm text-charcoal/65">
                          £{(p.pricePence / 100).toFixed(0)} · by {p.creator.firstName}
                        </p>
                      </div>
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
