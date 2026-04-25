import { createFileRoute, Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "Traceability — Uken" },
      {
        name: "description",
        content:
          "How Uken uses QR codes, GPS coordinates, export stamp dates, and container seal verification to make Kenyan trade traceable.",
      },
    ],
  }),
  component: TransparencyPage,
});

function TransparencyPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-4xl px-5 py-16 md:px-10 md:py-24">
        <SectionLabel tone="terracotta">Traceability</SectionLabel>
        <h1 className="mt-4 font-display text-4xl leading-tight text-charcoal md:text-5xl">
          Scan it. Trace it. Trust it.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
          Every product on Ukena carries a QR code. Scan it and see the GPS coordinates of the farm, the export stamp date, and container seal verification. No marketing speak — just proof.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center rounded-sm bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-warm-white transition-colors hover:bg-clay-deep"
        >
          Browse traceable products →
        </Link>
      </main>
      <Footer />
    </div>
  );
}