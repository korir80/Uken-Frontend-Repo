import { routeSeo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { catalogueService } from "@/services/catalogueService";
import type { Product } from "@/components/product/product-data";

const searchSchema = z.object({
  sort: fallback(z.enum(["newest", "price-asc", "price-desc"]), "newest").default("newest"),
});

export const Route = createFileRoute("/catalogue")({
  validateSearch: zodValidator(searchSchema),
  head: () =>
    routeSeo({
      path: "/catalogue",
      title: "The Uken Collection — Curated by Uken",
      description:
        "Products sourced, finished and fulfilled directly by Uken — coffee, tea, and small-batch goods from Kenya, traced from origin to UK door.",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Collection", path: "/catalogue" },
      ],
    }),
  component: CataloguePage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center font-sans text-sm text-destructive">
      Couldn't load the collection. {error.message}
    </div>
  ),
});

const PAGE_SIZE = 12;

function CataloguePage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["catalogue", "list"],
    queryFn: () => catalogueService.list(),
  });

  const products = useMemo(() => {
    const list = Array.isArray(data) ? [...data] : [];
    if (search.sort === "price-asc") list.sort((a, b) => a.pricePence - b.pricePence);
    else if (search.sort === "price-desc") list.sort((a, b) => b.pricePence - a.pricePence);
    return list;
  }, [data, search.sort]);

  const shown = products.slice(0, visible);

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="pb-24">
        <section className="bg-gradient-to-b from-gold-soft/30 to-warm-white">
          <div className="mx-auto max-w-7xl px-5 pb-10 pt-12 md:px-10 md:pb-14 md:pt-16">
            <SectionLabel>✦ Curated by Uken</SectionLabel>
            <h1 className="mt-3 max-w-2xl font-display text-[34px] leading-[1.05] tracking-tight text-charcoal md:text-[52px]">
              The Uken <em className="italic text-terracotta">Collection</em>.
            </h1>
            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-muted md:text-[15px]">
              Pieces sourced, finished and fulfilled directly by Uken. Small batches,
              traced from origin and shipped from our UK studio.
            </p>
          </div>
        </section>

        <section className="sticky top-[64px] z-30 border-y border-border/60 bg-warm-white/95 backdrop-blur-md md:top-[76px]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 md:px-10">
            <span className="font-sans text-[12px] uppercase tracking-[0.2em] text-ink-muted">
              {products.length} piece{products.length === 1 ? "" : "s"}
            </span>
            <label className="flex items-center gap-2 font-sans text-[12px] text-charcoal/70">
              Sort
              <select
                value={search.sort}
                onChange={(e) =>
                  navigate({
                    search: (p: typeof search) => ({ ...p, sort: e.target.value as typeof search.sort }),
                  })
                }
                className="rounded-full border border-border bg-warm-white px-3 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-clay/40"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price · low to high</option>
                <option value="price-desc">Price · high to low</option>
              </select>
            </label>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
          {isLoading ? (
            <p className="text-center font-sans text-sm text-charcoal/60">Loading the collection…</p>
          ) : isError ? (
            <p className="text-center font-sans text-sm text-destructive">
              Couldn't load.{" "}
              <button onClick={() => refetch()} className="underline">Retry</button>
            </p>
          ) : products.length === 0 ? (
            <p className="text-center font-sans text-sm text-charcoal/60">
              No Uken pieces yet — check back soon.
            </p>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((p, i) => (
                  <ShopProductCard
                    key={p.id}
                    index={i}
                    product={{ ...p, isUkenaOwned: true } as unknown as Product}
                  />
                ))}
              </div>
              {visible < products.length && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="rounded-full border border-charcoal px-6 py-2.5 font-sans text-[12px] uppercase tracking-[0.18em] text-charcoal hover:bg-charcoal hover:text-warm-white"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
