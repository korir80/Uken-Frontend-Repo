import { createFileRoute } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Card, SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Ukena" },
      {
        name: "description",
        content:
          "Browse Ukena collections across Kenyan handcrafted goods, coffee, tea, honey, spices, and produce.",
      },
      { property: "og:title", content: "Collections — Ukena" },
      {
        property: "og:description",
        content:
          "Browse Ukena collections across Kenyan handcrafted goods, coffee, tea, honey, spices, and produce.",
      },
    ],
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
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <section className="max-w-4xl">
          <SectionLabel tone="gold">Collections</SectionLabel>
          <h1 className="mt-4 font-display text-4xl leading-tight text-charcoal md:text-6xl">
            Kenyan goods for the homes that remember.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-muted md:text-lg">
            Ukena carries everything a UK visitor or Kenyan diaspora member misses — from single-origin coffee grown on the slopes of Mount Kenya to hand-coiled baskets built to last a lifetime.
          </p>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {collections.map((collection) => (
            <Card key={collection.title} tone="cream" elevation="lift" className="p-7 md:p-9">
              <h2 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
                {collection.title}
              </h2>
              <ul className="mt-7 space-y-4 text-base leading-relaxed text-ink-muted">
                {collection.items.map((item) => (
                  <li key={item} className="border-t border-border/70 pt-4 first:border-t-0 first:pt-0">
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
