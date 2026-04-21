import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { CreatorAttribution } from "@/components/product/CreatorAttribution";
import { Button } from "@/components/ukena/Button";
import { SectionLabel } from "@/components/ukena";
import { getProduct } from "@/components/product/product-data";
import { useCart, formatGBP } from "@/lib/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Piece — Ukena" }] };
    const title = `${p.name} by ${p.creator.fullName} · Ukena`;
    const description = `${p.pieceStory.slice(0, 150)}…`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: p.heroImage },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.heroImage },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-warm-white">
      <ExploreNav />
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Not in the workshop today
        </p>
        <h1 className="mt-6 font-display text-5xl text-charcoal">
          We couldn't find this piece
        </h1>
        <p className="mt-6 text-ink-muted">
          It may have already found a home, or the link is no longer current.
        </p>
        <Link
          to="/explore"
          className="mt-10 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
        >
          ← Browse the makers
        </Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem } = useCart();
  const [selected, setSelected] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
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
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
  };

  const active = product.gallery[selected] ?? product.gallery[0];

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main>
        {/* Top creator attribution — first thing seen */}
        <div className="border-b border-border/60 bg-cream/60">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-10">
            <CreatorAttribution creator={product.creator} variant="prominent" />
            <Link
              to="/creators/$creatorId"
              params={{ creatorId: product.creator.id }}
              className="hidden items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-charcoal/70 transition-colors hover:text-clay md:inline-flex"
            >
              {product.creator.firstName}'s full story
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">
          <Breadcrumbs creatorName={product.creator.firstName} productName={product.name} />

          <div className="mt-8 grid gap-12 md:mt-12 md:grid-cols-12 md:gap-14">
            {/* Gallery */}
            <div className="md:col-span-7">
              <div className="overflow-hidden rounded-2xl bg-cream">
                <img
                  src={active.src}
                  alt={active.alt}
                  width={1280}
                  height={1280}
                  className="aspect-square w-full object-cover transition-opacity duration-500"
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.gallery.map((g: { src: string; alt: string }, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={g.alt}
                    aria-pressed={i === selected}
                    className={cn(
                      "group relative overflow-hidden rounded-lg bg-cream transition-all",
                      i === selected
                        ? "ring-2 ring-clay"
                        : "ring-1 ring-border/60 hover:ring-charcoal/30",
                    )}
                  >
                    <img
                      src={g.src}
                      alt=""
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                    {g.kind === "process" && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-warm-white/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-clay">
                        Process
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="md:col-span-5">
              <div className="md:sticky md:top-28">
                <h1 className="font-display text-[40px] leading-[1.05] tracking-tight text-charcoal md:text-[52px]">
                  {product.name}
                </h1>
                <p className="mt-4 font-display text-2xl text-clay-deep">
                  {formatGBP(product.pricePence)}
                </p>

                {/* Story for this piece */}
                <section className="mt-10">
                  <SectionLabel>The story behind this piece</SectionLabel>
                  <p className="mt-5 text-[16px] leading-[1.75] text-charcoal/85">
                    {product.pieceStory}
                  </p>
                </section>

                {/* Add to bag */}
                <div className="mt-10 space-y-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAdd}
                    className="!h-13 w-full !bg-terracotta hover:!bg-[oklch(0.52_0.13_38)]"
                  >
                    {added ? (
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4" /> Added to your bag
                      </span>
                    ) : (
                      "Add to bag"
                    )}
                  </Button>

                  <ul className="space-y-2.5 pt-2 text-[13px] leading-relaxed text-ink-muted">
                    <li className="flex items-start gap-2.5">
                      <Dot /> Handmade in {product.creator.region.split(",")[0]},
                      Kenya
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Dot /> Ships within {product.leadTimeDays.min}–
                      {product.leadTimeDays.max} days
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Dot />
                      <span>
                        <span className="font-medium text-charcoal">
                          {product.creator.firstName}
                        </span>{" "}
                        earns fairly from every sale
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Specs */}
                <dl className="mt-10 space-y-4 border-t border-border/70 pt-8 text-[14px]">
                  <SpecRow label="Materials" value={product.materials.join(" · ")} />
                  <SpecRow label="Dimensions" value={product.dimensions} />
                  <SpecRow label="Care" value={product.care} />
                </dl>

                {/* Persistent creator card */}
                <div className="mt-10">
                  <CreatorAttribution creator={product.creator} variant="footer" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-terracotta/70"
    />
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </dt>
      <dd className="col-span-2 text-charcoal/85">{value}</dd>
    </div>
  );
}

function Breadcrumbs({
  creatorName,
  productName,
}: {
  creatorName: string;
  productName: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-ink-muted"
    >
      <Link to="/explore" className="hover:text-clay">
        Makers
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="hover:text-clay">{creatorName}</span>
      <ChevronRight className="h-3 w-3" />
      <span className="text-charcoal/70">{productName}</span>
    </nav>
  );
}
