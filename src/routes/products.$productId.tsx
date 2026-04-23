import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { CreatorAttribution } from "@/components/product/CreatorAttribution";
import { Button } from "@/components/ukena/Button";
import { SectionLabel } from "@/components/ukena";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  getAllProducts,
  getProduct,
  type Product,
} from "@/components/product/product-data";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { CreatorCard } from "@/components/explore/CreatorCard";
import { creators as allCreators } from "@/components/explore/creators-data";
import { SaveHeart } from "@/components/product/SaveHeart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart, formatGBP } from "@/lib/cart";
import { pushRecentProduct } from "@/lib/ukena-mode";
import { cn } from "@/lib/utils";

// TODO: replace seed data with:
//   const product = await productService.getProductById(params.productId)
//   TanStack Query key: ['product', params.productId]
// The Spring Boot envelope is already unwrapped by services/api.ts.
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
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-warm-white">
      <ExploreNav />
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Something went quiet
        </p>
        <h1 className="mt-6 font-display text-4xl text-charcoal">
          We couldn't load this piece
        </h1>
        <p className="mt-4 text-ink-muted">{error.message}</p>
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

  // Track product view for the personalised home (returning authed users).
  useEffect(() => {
    pushRecentProduct(product.id);
    setSelected(0);
  }, [product.id]);

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
    window.setTimeout(() => setAdded(false), 1800);
  };

  // 3 thumbnails — first three gallery entries
  const thumbs = product.gallery.slice(0, 4);
  const active = product.gallery[selected] ?? product.gallery[0];

  // ── Related products: same creator first, then same craft ──────────────
  const related = useMemo<Product[]>(() => {
    const all = getAllProducts();
    const sameCreator = all.filter(
      (p) => p.creator.id === product.creator.id && p.id !== product.id,
    );
    if (sameCreator.length >= 3) return sameCreator.slice(0, 3);
    const sameCraft = all.filter(
      (p) =>
        p.creator.craft === product.creator.craft &&
        p.creator.id !== product.creator.id,
    );
    return [...sameCreator, ...sameCraft].slice(0, 3);
  }, [product.id, product.creator.id, product.creator.craft]);

  // ── Related creators: 2 creators that aren't this product's maker ─────
  const relatedCreators = useMemo(() => {
    return allCreators
      .filter((c) => c.id !== product.creator.id)
      .slice(0, 2);
  }, [product.creator.id]);

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main>
        <div className="mx-auto max-w-7xl px-6 pt-8 md:px-10 md:pt-10">
          <Breadcrumbs
            creatorName={product.creator.firstName}
            productName={product.name}
          />

          {/* Two-column layout: 55 / 45 on desktop */}
          <div className="mt-6 grid gap-10 md:mt-8 md:grid-cols-[55%_45%] md:gap-12 lg:gap-16">
            {/* LEFT — Gallery */}
            <div>
              <div className="overflow-hidden rounded-2xl bg-cream md:h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full"
                  >
                    <LazyImage
                      src={active.src}
                      alt={active.alt}
                      ratio="1 / 1"
                      eager
                      wrapperClassName="md:h-full md:w-full"
                      className="md:h-full md:w-full md:object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Thumbnails — 3-4 across, no carousel chrome */}
              <div className="mt-3 grid grid-cols-4 gap-2 md:mt-4 md:gap-3">
                {thumbs.map((g, i) => (
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

            {/* RIGHT — Details (creator first, then everything else) */}
            <div>
              <div className="md:sticky md:top-24">
                {/* 1. Creator attribution — very first element */}
                <Link
                  to="/creators/$creatorId"
                  params={{ creatorId: product.creator.id }}
                  className="group inline-flex items-center gap-2.5 text-[12px] text-clay transition-colors hover:text-clay-deep"
                >
                  <img
                    src={product.creator.portrait}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-border/70"
                  />
                  <span>
                    by{" "}
                    <span className="font-medium underline-offset-4 group-hover:underline">
                      {product.creator.fullName}
                    </span>{" "}
                    · {product.creator.region}, Kenya
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>

                {/* 2. Product name */}
                <h1 className="mt-4 font-display text-[28px] leading-[1.1] tracking-tight text-charcoal md:text-[36px]">
                  {product.name}
                </h1>

                {/* 3. Price */}
                <p className="mt-3 text-[28px] font-medium tabular-nums text-charcoal">
                  {formatGBP(product.pricePence)}
                </p>

                {/* 4. The making — micro-story */}
                <section className="mt-7">
                  <SectionLabel>The making</SectionLabel>
                  <p className="mt-3 text-[14px] font-light leading-[1.7] text-charcoal/70">
                    {product.pieceStory}
                  </p>
                </section>

                {/* 5. Product details — visible desktop, accordion mobile */}
                <div className="mt-7">
                  {/* Desktop */}
                  <dl className="hidden space-y-3 border-t border-border/70 pt-6 text-[13px] md:block">
                    <SpecRow
                      label="Materials"
                      value={product.materials.join(" · ")}
                    />
                    <SpecRow label="Dimensions" value={product.dimensions} />
                    <SpecRow label="Care" value={product.care} />
                  </dl>
                  {/* Mobile accordion */}
                  <div className="md:hidden">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="details">
                        <AccordionTrigger className="text-[13px] uppercase tracking-[0.18em] text-charcoal">
                          Materials, dimensions & care
                        </AccordionTrigger>
                        <AccordionContent>
                          <dl className="space-y-3 pt-2 text-[13px]">
                            <SpecRow
                              label="Materials"
                              value={product.materials.join(" · ")}
                            />
                            <SpecRow
                              label="Dimensions"
                              value={product.dimensions}
                            />
                            <SpecRow label="Care" value={product.care} />
                          </dl>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* 6. Add to bag */}
                <div className="mt-7 flex items-stretch gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAdd}
                    className="!h-12 flex-1 !bg-terracotta hover:!bg-[oklch(0.52_0.13_38)]"
                  >
                    {added ? (
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4" /> Added
                      </span>
                    ) : (
                      "Add to bag"
                    )}
                  </Button>
                  <SaveHeart
                    productId={product.id}
                    productName={product.name}
                    className="!h-12 !w-12 shrink-0 border border-border/70"
                  />
                </div>

                {/* 7. Ethical sourcing line — centred under button */}
                <p className="mt-4 text-center text-[11px] leading-relaxed text-charcoal/40">
                  Handmade in Kenya · Ships within {product.leadTimeDays.min}–
                  {product.leadTimeDays.max} days ·{" "}
                  <span className="text-charcoal/55">
                    {product.creator.firstName} earns fairly from every sale
                  </span>
                </p>

                {/* 8. Persistent creator mini-card */}
                <div className="mt-8 border-t border-border/60 pt-7">
                  <Link
                    to="/creators/$creatorId"
                    params={{ creatorId: product.creator.id }}
                    className="group flex items-start gap-4 rounded-xl bg-cream/70 p-5 transition-all duration-500 hover:bg-cream"
                  >
                    <img
                      src={product.creator.portrait}
                      alt={product.creator.fullName}
                      width={96}
                      height={96}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-border/70"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta">
                        The maker
                      </p>
                      <p className="mt-1 font-display text-[20px] leading-tight text-charcoal">
                        {product.creator.fullName}
                      </p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                        {product.creator.craft} · {product.creator.region}
                      </p>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-charcoal/75">
                        {makerHook(product.creator.id)}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-clay">
                        Read {product.creator.firstName}'s full story
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </div>

                {/* 9. Two conversion links */}
                <div className="mt-6 border-t border-border/60 pt-5">
                  <ul className="space-y-3">
                    <li>
                      <Link
                        to="/creators/$creatorId"
                        params={{ creatorId: product.creator.id }}
                        className="group inline-flex items-center gap-2 text-[12px] text-clay transition-colors hover:text-clay-deep"
                      >
                        Meet the talent behind this
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/shop"
                        search={{ craft: product.creator.craft as never }}
                        className="group inline-flex items-center gap-2 text-[12px] text-charcoal/50 transition-colors hover:text-charcoal"
                      >
                        See similar pieces
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────── Related products ─────────── */}
        {related.length > 0 && (
          <section className="mx-auto mt-24 max-w-7xl px-6 md:mt-32 md:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionLabel>More from the workshop</SectionLabel>
                <h2 className="mt-3 font-display text-[28px] leading-tight text-charcoal md:text-[34px]">
                  More from {product.creator.firstName}
                </h2>
              </div>
              <Link
                to="/creators/$creatorId"
                params={{ creatorId: product.creator.id }}
                className="text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
              >
                See the full collection →
              </Link>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
              {related.map((p, i) => (
                <ShopProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ─────────── Related creators ─────────── */}
        {relatedCreators.length > 0 && (
          <section className="mx-auto mt-24 max-w-7xl px-6 pb-24 md:mt-32 md:px-10 md:pb-32">
            <div>
              <SectionLabel tone="clay">Other voices</SectionLabel>
              <h2 className="mt-3 font-display text-[28px] leading-tight text-charcoal md:text-[34px]">
                You might also connect with
              </h2>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 md:gap-10">
              {relatedCreators.map((c, i) => (
                <CreatorCard key={c.id} creator={c} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </dt>
      <dd className="col-span-2 text-[13px] text-charcoal/85">{value}</dd>
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
      className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-muted"
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

/** Pull the maker's 1-line hook from the creators dataset. */
function makerHook(creatorId: string): string {
  return (
    allCreators.find((c) => c.id === creatorId)?.hook ??
    "A maker working in the slow, deliberate way of their region."
  );
}
