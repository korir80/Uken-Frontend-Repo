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
      <main className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
        <SectionLabel tone="terracotta">Press</SectionLabel>
        <h1 className="mt-3 font-display text-[32px] leading-tight text-charcoal md:text-[46px]">
          Ukena in the World
        </h1>

        <div className="mt-8 grid gap-4">
          <Card tone="cream" elevation="soft" className="p-5 md:p-7">
            <h2 className="font-display text-[28px] leading-tight text-charcoal md:text-[34px]">Partners & Affiliates</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted md:text-base">
              University of Nottingham — Academic partner collaborating on research and initiatives to foster sustainable trade and community development between Kenya and the UK.
            </p>
          </Card>

          <Card tone="warm-white" elevation="soft" className="p-5 md:p-7">
            <h2 className="font-display text-[28px] leading-tight text-charcoal md:text-[34px]">Press contact</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted md:text-base">
              For media enquiries contact Andrew Soi at hello@ukena.co.uk or +44 7425 241649
            </p>
          </Card>

          <Card tone="cream" elevation="soft" className="p-5 md:p-7">
            <h2 className="font-display text-[28px] leading-tight text-charcoal md:text-[34px]">Future press coverage</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted md:text-base">
              Coverage and features will appear here as Ukena grows.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
