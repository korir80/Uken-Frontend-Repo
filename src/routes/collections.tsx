import { routeSeo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Card, SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/collections")({
  head: () => routeSeo({
    path: "/collections",
    title: "Collections — UKEN",
    description:
      "Browse UKEN collections across Kenyan handcrafted goods, coffee, tea, honey, spices and produce.",
  }),
  component: CollectionsPage,
});

const collections = [
  {
    title: "Handcrafted Goods",
    items: ["Weaving & Baskets", "Beadwork & Jewellery", "Pottery & Ceramics", "Leatherwork"],
  },
  {
    title: "Food & Agricultural",
    items: ["Coffee & Tea", "Honey & Preserves", "Spices & Grains", "Fresh & Dried Produce"],
  },
];

function CollectionsPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <section className="max-w-4xl">
          <SectionLabel tone="gold">Collections</SectionLabel>
          <h1 className="mt-3 font-display text-[32px] leading-tight text-charcoal md:text-[46px]">
            Kenyan goods for the homes that remember.
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-muted md:text-base">
            UKEN carries everything a UK visitor or Kenyan diaspora member misses — from single-origin coffee grown on the slopes of Mount Kenya to hand-coiled baskets built to last a lifetime.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {collections.map((collection) => (
            <Card key={collection.title} tone="cream" elevation="lift" className="p-5 md:p-7">
              <h2 className="font-display text-[28px] leading-tight text-charcoal md:text-[34px]">
                {collection.title}
              </h2>
              <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-ink-muted">
                {collection.items.map((item) => (
                  <li key={item} className="border-t border-border/70 pt-3 first:border-t-0 first:pt-0">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
