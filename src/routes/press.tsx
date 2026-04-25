import { createFileRoute } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Card, SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press — Ukena" },
      {
        name: "description",
        content:
          "Press information, partners, affiliates, and media contact details for Ukena.",
      },
      { property: "og:title", content: "Press — Ukena" },
      {
        property: "og:description",
        content:
          "Press information, partners, affiliates, and media contact details for Ukena.",
      },
    ],
  }),
  component: PressPage,
});

function PressPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-5xl px-5 py-16 md:px-10 md:py-24">
        <SectionLabel tone="terracotta">Press</SectionLabel>
        <h1 className="mt-4 font-display text-4xl leading-tight text-charcoal md:text-6xl">
          Ukena in the World
        </h1>

        <div className="mt-12 grid gap-5">
          <Card tone="cream" elevation="soft" className="p-7 md:p-9">
            <h2 className="font-display text-3xl leading-tight text-charcoal">Partners & Affiliates</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-lg">
              University of Nottingham — Academic partner collaborating on research and initiatives to foster sustainable trade and community development between Kenya and the UK.
            </p>
          </Card>

          <Card tone="warm-white" elevation="soft" className="p-7 md:p-9">
            <h2 className="font-display text-3xl leading-tight text-charcoal">Press contact</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-lg">
              For media enquiries contact Andrew Soi at hello@ukena.co.uk or +44 7425 241649
            </p>
          </Card>

          <Card tone="cream" elevation="soft" className="p-7 md:p-9">
            <h2 className="font-display text-3xl leading-tight text-charcoal">Future press coverage</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-lg">
              Coverage and features will appear here as Ukena grows.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
