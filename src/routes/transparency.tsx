import { routeSeo } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";

export const Route = createFileRoute("/transparency")({
  head: () => routeSeo({
    path: "/transparency",
    title: "Traceability — UKEN",
    description:
      "Scan any UKEN product QR code and trace it back to the farm, the maker, and the export date.",
  }),
  component: TransparencyPage,
});

function TransparencyPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-4xl px-5 py-10 md:px-10 md:py-14">
        <SectionLabel tone="terracotta">Traceability</SectionLabel>
        <h1 className="mt-3 font-display text-[32px] leading-tight text-charcoal md:text-[42px]">
          Built on Proof, Not Promises
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted md:text-base">
          Every product on UKEN is tied to a digital traceability record. Scan the QR code on any item and you will see:
        </p>
        <ul className="mt-5 space-y-2.5 border-y border-border/70 py-5 text-[15px] leading-relaxed text-ink-muted md:text-base">
          <li>GPS coordinates of the farm or workshop</li>
          <li>Export stamp date from Kenya</li>
          <li>Container seal verification</li>
        </ul>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-muted md:text-base">
          We replaced marketing language with hard data. You should never have to take our word for it.
        </p>
        <section className="mt-8 rounded-2xl border border-border/60 bg-cream/45 p-5 md:p-7">
          <h2 className="font-display text-[28px] leading-tight text-charcoal md:text-[34px]">
            What traceability means for makers
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted md:text-base">
            For Kenyan producers, traceability is not just a feature — it is protection. It proves origin, commands premium pricing, and ensures no middleman can misrepresent their work.
          </p>
        </section>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center rounded-sm bg-charcoal px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-warm-white transition-colors hover:bg-clay-deep"
        >
          Browse traceable products →
        </Link>
      </main>
      <Footer />
    </div>
  );
}