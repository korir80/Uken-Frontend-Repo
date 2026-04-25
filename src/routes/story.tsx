import { createFileRoute, Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Button, SectionLabel } from "@/components/ukena";
import { ArrowRight } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import marketImage from "@/assets/authentic-craft-market.jpg";
import workshopImage from "@/assets/creator-workshop-wanjiru.jpg";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Ukena" },
      {
        name: "description",
        content:
          "How Ukena bridges Kenyan producers directly to UK buyers through transparent, fair, and sustainable trade.",
      },
      { property: "og:title", content: "Our Story — Ukena" },
      {
        property: "og:description",
        content:
          "How Ukena bridges Kenyan producers directly to UK buyers through transparent, fair, and sustainable trade.",
      },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main>
        <section className="mx-auto max-w-7xl px-5 pb-6 pt-6 md:px-10 md:pb-8 md:pt-10">
          <div className="max-w-3xl">
            <SectionLabel tone="terracotta">Our Story</SectionLabel>
            <h1 className="mt-3 font-display text-[30px] leading-[1.05] tracking-tight text-charcoal sm:text-[34px] md:mt-3 md:text-[42px]">
              We came for the makers — <em className="italic text-clay">and stayed for the hours.</em>
            </h1>
            <p className="mt-2.5 max-w-2xl text-[13px] leading-relaxed text-ink-muted md:text-sm">
              A marketplace built around the people who grow, shape, and finish the work. Kenyan farmers, artisans, and makers, told plainly, sold honestly.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-12 md:grid-cols-2 md:gap-6 md:px-10 md:pb-16">
          <LazyImage
            src={workshopImage}
            alt="A weaver at her workshop in the Kenyan highlands"
            ratio="4/5"
            wrapperClassName="rounded-2xl"
          />
          <LazyImage
            src={marketImage}
            alt="A bustling Kenyan craft market at dawn"
            ratio="4/5"
            wrapperClassName="rounded-2xl"
          />
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24 md:px-10">
          <div className="mb-12 space-y-10">
            <div>
              <SectionLabel tone="gold">Mission</SectionLabel>
              <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
                To empower Kenyan farmers, artisans, and craftsmen by bridging the gap to the UK market through direct, transparent, and sustainable trade — ensuring exceptional skill and quality are rewarded with equitable value.
              </p>
            </div>
            <div>
              <SectionLabel tone="terracotta">Vision</SectionLabel>
              <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
                To be the premier gateway for Kenyan excellence in the United Kingdom, recognised for an unbroken chain of traceability connecting UK buyers directly to the farmers, artisans, and craftsmen behind the finest agricultural and hand-crafted goods.
              </p>
            </div>
            <div className="grid gap-4 text-sm leading-relaxed text-ink-muted md:grid-cols-3">
              <p><span className="font-medium text-charcoal">UK headquarters</span><br />Osmaston 10, NG7 1SD, Nottingham, UK.</p>
              <p><span className="font-medium text-charcoal">Nairobi office</span><br />Nairobi Garage, Karen — Watermark Business Park, Ndege Rd. Off Langata Rd.</p>
              <p><span className="font-medium text-charcoal">Academic partner</span><br />University of Nottingham, collaborating on sustainable trade research.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-cream/40 p-8 md:p-12">
            <p className="font-display text-2xl italic leading-snug text-charcoal md:text-3xl">
              “We do not make objects. We make the hours that hold them — and
              the hands that remember the making.”
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-charcoal/55">
              The Uken promise
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button asChild variant="primary" size="lg">
              <Link to="/explore">
                Meet the makers <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/shop">Browse the collection</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
