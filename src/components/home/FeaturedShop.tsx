import { Link } from "@tanstack/react-router";
import { LazyImage } from "@/components/ui/lazy-image";
import { getAllProducts } from "@/components/product/product-data";
import { formatGBP } from "@/lib/cart";
import type { Craft } from "@/components/explore/creators-data";

const FEATURED_IDS = ["p-mara-01", "p-kaj-01", "p-nrb-01", "p-mwi-01", "p-lam-01", "p-mara-04"];

const CATEGORY_TILES: { craft?: Craft; label: string; tagline: string }[] = [
  { craft: "Weaving", label: "Weaving", tagline: "Sisal, coiled by hand." },
  { craft: "Beadwork", label: "Beadwork", tagline: "Stories told in glass." },
  { craft: "Pottery", label: "Pottery", tagline: "Earth, fire, water." },
  { craft: "Leatherwork", label: "Leatherwork", tagline: "Saddle-stitched, never glued." },
  { label: "Coffee & Tea", tagline: "Single-origin, farm to cup." },
  { label: "Foods & Harvest", tagline: "Honey, spices, and grains." },
  { label: "Fresh Produce", tagline: "What UK visitors still think about." },
];

/**
 * Featured commerce strip on the home page — sits between the hero/story
 * and the editorial creator strip so the page feels equally "marketplace"
 * and "magazine".
 */
export function FeaturedShop() {
  const all = getAllProducts();
  const featured = FEATURED_IDS.map((id) => all.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <section className="bg-warm-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Section header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label">Shop the collection</p>
            <h2 className="mt-2 max-w-2xl font-display text-[32px] leading-tight text-charcoal md:text-[42px]">
              Kenyan goods leaving farms and studios this week.
            </h2>
            <p className="mt-2.5 max-w-xl font-sans text-[14px] leading-relaxed text-charcoal/70 md:text-[15px]">
              Coffee, tea, foods, textiles, and craft fresh from Kenyan hands. Every product carries its source and a fair share of every sale.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-clay underline-offset-4 hover:underline"
          >
            Browse the full shop →
          </Link>
        </div>

        {/* Product grid */}
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              to="/products/$productId"
              params={{ productId: p.id }}
              className="group block rounded-2xl border border-border/60 bg-cream/60 p-3 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-sand-soft">
                <LazyImage
                  src={p.heroImage}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-3 px-1 pb-1">
                <div>
                  <h3 className="font-display text-xl text-charcoal">{p.name}</h3>
                  <p className="mt-0.5 font-sans text-[12px] text-clay">
                    by {p.creator.firstName} · {p.creator.region}
                  </p>
                </div>
                <span className="font-sans text-base text-charcoal">
                  {formatGBP(p.pricePence)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Shop by category tiles */}
        <div className="mt-10 md:mt-12">
          <p className="section-label">Shop by category</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_TILES.map((tile) => (
              <Link
                key={tile.label}
                to="/shop"
                search={tile.craft ? { craft: tile.craft } : undefined}
                className="group block rounded-2xl border border-border/60 bg-cream/50 p-4 transition hover:-translate-y-0.5 hover:border-clay hover:shadow-soft md:p-5"
              >
                <p className="font-display text-2xl text-charcoal">{tile.label}</p>
                <p className="mt-2 font-sans text-[13px] text-charcoal/65">
                  {tile.tagline}
                </p>
                <p className="mt-4 font-sans text-[12px] text-clay">
                  See products →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
