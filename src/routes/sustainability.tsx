import { createFileRoute } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Card, SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/sustainability")({
  head: () => ({
    meta: [
      { title: "Sustainability — Ukena" },
      {
        name: "description",
        content:
          "How Ukena protects Kenyan soil, culture, and communities through long-term stewardship.",
      },
      { property: "og:title", content: "Sustainability — Ukena" },
      {
        property: "og:description",
        content:
          "How Ukena protects Kenyan soil, culture, and communities through long-term stewardship.",
      },
    ],
  }),
  component: SustainabilityPage,
});

const stewardship = [
  {
    title: "Environmental",
    body: "We encourage sustainable, organic-first farming and production methods to protect Kenyan soil, water, and biodiversity for future generations.",
  },
  {
    title: "Cultural",
    body: "Traditional artisanal skills only survive if they are profitable. Ukena ensures makers earn enough that young people in their communities choose to learn the craft rather than abandon it.",
  },
  {
    title: "Economic",
    body: "Every sale on Ukena is structured so the largest share of value stays in Kenya. We publish our margin structure openly because transparency is one of our five founding values.",
  },
];

function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <div className="max-w-3xl">
          <SectionLabel tone="gold">Stewardship</SectionLabel>
          <h1 className="mt-3 font-display text-[32px] leading-tight text-charcoal md:text-[42px]">
            Stewardship Over Short-Term Gain
          </h1>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {stewardship.map((item) => (
            <Card key={item.title} tone="cream" elevation="lift" className="p-5 md:p-6">
              <h2 className="font-display text-[26px] leading-tight text-charcoal md:text-[30px]">{item.title}</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
