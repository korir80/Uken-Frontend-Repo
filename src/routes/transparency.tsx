import { createFileRoute, Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "Traceability — Ukena" },
      {
        name: "description",
        content:
          "Scan any Ukena product QR code and trace it back to the farm, the maker, and the export date.",
      },
      { property: "og:title", content: "Traceability — Ukena" },
      {
        property: "og:description",
        content:
          "Scan any Ukena product QR code and trace it back to the farm, the maker, and the export date.",
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
          Built on Proof, Not Promises
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
          Every product on Ukena is tied to a digital traceability record. Scan the QR code on any item and you will see:
        </p>
        <ul className="mt-6 space-y-3 border-y border-border/70 py-6 text-base leading-relaxed text-ink-muted md:text-lg">
          <li>GPS coordinates of the farm or workshop</li>
          <li>Export stamp date from Kenya</li>
          <li>Container seal verification</li>
        </ul>
        <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
          We replaced marketing language with hard data. You should never have to take our word for it.
        </p>
        <section className="mt-12 rounded-3xl border border-border/60 bg-cream/45 p-7 md:p-10">
          <h2 className="font-display text-3xl leading-tight text-charcoal md:text-4xl">
            What traceability means for makers
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted md:text-lg">
            For Kenyan producers, traceability is not just a feature — it is protection. It proves origin, commands premium pricing, and ensures no middleman can misrepresent their work.
          </p>
        </section>
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