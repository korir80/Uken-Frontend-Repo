import { Link } from "@tanstack/react-router";
import { LazyImage } from "@/components/ui/lazy-image";
import { getAllProducts } from "@/components/product/product-data";
import { formatGBP } from "@/lib/cart";
import type { Craft } from "@/components/explore/creators-data";

const FEATURED_IDS = ["p-mara-01", "p-kaj-01", "p-nrb-01", "p-mwi-01", "p-lam-01", "p-mara-04"];

const CRAFT_TILES: { craft: Craft; label: string; tagline: string }[] = [
  { craft: "Weaving", label: "Weaving", tagline: "Sisal, coiled by hand." },
  { craft: "Beadwork", label: "Beadwork", tagline: "Stories told in glass." },
  { craft: "Pottery", label: "Pottery", tagline: "Earth, fire, water." },
  { craft: "Leatherwork", label: "Leatherwork", tagline: "Saddle-stitched, never glued." },
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
    <section className="bg-warm-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Section header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-label">Shop the collection</p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-charcoal md:text-5xl">
              Pieces leaving studios this week.
            </h2>
            <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-charcoal/70">
              A handful of work fresh from the makers' hands. Every piece carries
              its maker's name and a fair share of every sale.
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
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p.id}
              to="/products/$productId"
              params={{ productId: p.id }}
              className="group block"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-cream">
                <LazyImage
                  src={p.heroImage}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
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

        {/* Shop by craft tiles */}
        <div className="mt-20">
          <p className="section-label">Shop by craft</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CRAFT_TILES.map((tile) => (
              <Link
                key={tile.craft}
                to="/shop"
                search={{ craft: tile.craft }}
                className="group block rounded-2xl border border-border/60 bg-cream/50 p-6 transition hover:-translate-y-0.5 hover:border-clay hover:shadow-soft"
              >
                <p className="font-display text-2xl text-charcoal">{tile.label}</p>
                <p className="mt-2 font-sans text-[13px] text-charcoal/65">
                  {tile.tagline}
                </p>
                <p className="mt-6 font-sans text-[12px] text-clay">
                  See pieces →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
