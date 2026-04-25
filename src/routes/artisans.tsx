import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Button, Card, SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/artisans")({
  head: () => ({
    meta: [
      { title: "For Artisans — UKEN" },
      {
        name: "description",
        content:
          "Join UKEN. Set your price, tell your story, and reach UK buyers directly. No middlemen.",
      },
      { property: "og:title", content: "For Artisans — UKEN" },
      {
        property: "og:description",
        content:
          "Join UKEN. Set your price, tell your story, and reach UK buyers directly. No middlemen.",
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
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <section className="max-w-4xl">
          <SectionLabel tone="terracotta">Opportunity</SectionLabel>
          <h1 className="mt-3 font-display text-[32px] leading-tight text-charcoal md:text-[46px]">
            Your craft. Your name. Your price.
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink-muted md:text-base">
            UKEN exists because the traditional route — exporter, broker, importer, wholesaler, retailer — takes most of the value before it ever reaches the maker. We cut that chain. You list your work, tell your story, set your price, and we handle export logistics, UK customs, and delivery. You get paid in full, on time, every time.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <Card key={value.title} tone="cream" elevation="lift" className="p-5 md:p-6">
              <h2 className="font-display text-[26px] leading-tight text-charcoal md:text-[30px]">{value.title}</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">{value.body}</p>
            </Card>
          ))}
        </section>

        <div className="mt-8">
          <Button asChild variant="primary" size="lg">
            <Link to="/join">
              Apply to join UKEN <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
