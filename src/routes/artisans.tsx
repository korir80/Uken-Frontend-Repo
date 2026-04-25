import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Button, Card, SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/artisans")({
  head: () => ({
    meta: [
      { title: "For Artisans — Ukena" },
      {
        name: "description",
        content:
          "Join Ukena. Set your price, tell your story, and reach UK buyers directly. No middlemen.",
      },
      { property: "og:title", content: "For Artisans — Ukena" },
      {
        property: "og:description",
        content:
          "Join Ukena. Set your price, tell your story, and reach UK buyers directly. No middlemen.",
      },
    ],
  }),
  component: ArtisansPage,
});

const values = [
  {
    title: "You set the price",
    body: "No race to the bottom. Your craft is priced by you.",
  },
  {
    title: "Your name on every piece",
    body: "Buyers know who made it, where, and why.",
  },
  {
    title: "Direct to UK homes",
    body: "We handle Kenyan export permits and UK customs end to end.",
  },
];

function ArtisansPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <section className="max-w-4xl">
          <SectionLabel tone="terracotta">Opportunity</SectionLabel>
          <h1 className="mt-4 font-display text-4xl leading-tight text-charcoal md:text-6xl">
            Your craft. Your name. Your price.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-muted md:text-lg">
            Ukena exists because the traditional route — exporter, broker, importer, wholesaler, retailer — takes most of the value before it ever reaches the maker. We cut that chain. You list your work, tell your story, set your price, and we handle export logistics, UK customs, and delivery. You get paid in full, on time, every time.
          </p>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} tone="cream" elevation="lift" className="p-7 md:p-8">
              <h2 className="font-display text-3xl leading-tight text-charcoal">{value.title}</h2>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-muted">{value.body}</p>
            </Card>
          ))}
        </section>

        <div className="mt-12">
          <Button asChild variant="primary" size="lg">
            <Link to="/join">
              Apply to join Ukena <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
