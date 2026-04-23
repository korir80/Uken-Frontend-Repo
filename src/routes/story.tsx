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
          "Why Ukena exists: a marketplace where Kenyan makers come first, and every piece carries the hands and hours behind it.",
      },
      { property: "og:title", content: "Our Story — Ukena" },
      {
        property: "og:description",
        content:
          "We do not make objects. We make the hours that hold them — and the hands that remember the making.",
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
        <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 md:px-10 md:pt-28">
          <SectionLabel tone="terracotta">Our Story</SectionLabel>
          <h1 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
            We came for the makers — <em className="italic text-clay">and stayed for the hours.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-charcoal/75 md:text-lg">
            Ukena is a marketplace built around the people who shape the work.
            Not a catalogue of objects, but a record of the hands and the
            hours behind them — Kenyan artisans, told plainly, sold honestly.
          </p>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 md:grid-cols-2 md:px-10">
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
          <div className="rounded-3xl border border-border/60 bg-cream/40 p-8 md:p-12">
            <p className="font-display text-2xl italic leading-snug text-charcoal md:text-3xl">
              “We do not make objects. We make the hours that hold them — and
              the hands that remember the making.”
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-charcoal/55">
              The Ukena promise
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
