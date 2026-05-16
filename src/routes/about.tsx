import { routeSeo } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Button, Card, SectionLabel } from "@/components/ukena";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Handshake,
  Sparkles,
  PackageCheck,
  Repeat,
  Layers,
} from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import workshopImage from "@/assets/uken-weavers-workshop.jpg";
import marketImage from "@/assets/uken-baskets-array.jpg";

export const Route = createFileRoute("/about")({
  head: () =>
    routeSeo({
      path: "/about",
      title: "About UKEN — Who we are and what we do",
      description:
        "UKEN is the trusted bridge between authentic African creators — beginning in Kenya — and UK lovers of African art and craft. Fair earnings for makers, traceable provenance for buyers, and a partnership built to last.",
    }),
  component: AboutPage,
});

const audiences = [
  {
    title: "Buyers & lovers of African craft",
    body: "Collectors, gift-givers, and those carrying nostalgia for the continent — people who want pieces with a story, not a stock number.",
    icon: Handshake,
  },
  {
    title: "Authentic creators in Kenya",
    body: "Artisans, weavers, carvers, roasters, and farmers whose skill has, for too long, been priced by intermediaries instead of by the work itself.",
    icon: Sparkles,
  },
  {
    title: "UKEN — your trusted connector",
    body: "We hold the middle: verifying makers, photographing the work honestly, handling logistics from workshop to UK doorstep, and protecting both sides of the exchange.",
    icon: Layers,
  },
  {
    title: "Partners — coming very soon",
    body: "Galleries, cultural institutions, retailers and corporate gifting programmes that want a direct, transparent line to East African craft. Conversations are already underway.",
    icon: PackageCheck,
  },
];

const contracts = [
  {
    tag: "Available today",
    title: "One-off orders",
    body: "Browse, order, pay. The piece is dispatched from the creator in Kenya to the delivery address you choose in the UK. 60% of the sale goes directly to the maker; 40% covers shipping, customs, platform operations and the team keeping it all running.",
    icon: PackageCheck,
    live: true,
  },
  {
    tag: "Final touches",
    title: "Project-based collaboration",
    body: "Commission a creator for bespoke work — a custom run for a shop, a one-of-a-kind piece for a home, a curated commission for a brand. Scoped, milestoned, and protected for both sides.",
    icon: Sparkles,
    live: false,
  },
  {
    tag: "Final touches",
    title: "Recurring orders",
    body: "Set up a regular rhythm — monthly coffee from a single Kenyan farm, quarterly textile drops for a boutique, scheduled artisan gifts for a team. Consistent income for the maker, dependable arrivals for you.",
    icon: Repeat,
    live: false,
  },
];

const promises = [
  {
    title: "Environmental care",
    body: "We work with creators who use clean, low-impact methods — natural dyes, responsibly sourced materials, traditional techniques that respect soil and water. We consolidate shipping and avoid wasteful packaging wherever possible.",
    icon: Leaf,
  },
  {
    title: "Authentic creators, authentic buyers",
    body: "Every maker on UKEN is verified in person by our Nairobi team. We refuse mass-produced lookalikes and the resellers who trade in them. In return, we attract buyers who value the work — not the markdown.",
    icon: ShieldCheck,
  },
  {
    title: "A real partnership",
    body: "UKEN exists to bind two communities together: the hands that make and the people who cherish. Both sides must value the art at hand — that is the entire premise of this company.",
    icon: Handshake,
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 pt-8 pb-6 md:px-10 md:pt-12 md:pb-10">
          <div className="max-w-3xl">
            <SectionLabel tone="terracotta">About UKEN</SectionLabel>
            <h1 className="mt-3 font-display text-[32px] leading-[1.05] tracking-tight text-charcoal sm:text-[38px] md:mt-4 md:text-[52px]">
              We are the bridge between{" "}
              <em className="italic text-clay">African hands</em> and{" "}
              <em className="italic text-clay">British homes.</em>
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base">
              UKEN is the trusted middle between authentic creators across the
              African cradle — beginning in Kenya — and the UK buyers who love,
              remember, and want to live with their work. We exist so that fair
              value reaches the maker and honest provenance reaches the buyer.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-12 md:grid-cols-2 md:gap-5 md:px-10 md:pb-16">
          <LazyImage
            src={workshopImage}
            alt="Kenyan women weaving sisal baskets together under banana trees, with a finished red-and-yellow striped basket in the foreground"
            ratio="4/5"
            wrapperClassName="rounded-2xl"
          />
          <LazyImage
            src={marketImage}
            alt="A spread of handwoven sisal baskets in indigo, terracotta, green and natural fibre — laid out by the makers"
            ratio="4/5"
            wrapperClassName="rounded-2xl"
          />
        </section>

        {/* Who we are */}
        <section className="mx-auto max-w-3xl px-6 pb-14 md:px-10 md:pb-16">
          <SectionLabel tone="gold">Who we are</SectionLabel>
          <h2 className="mt-3 font-display text-[28px] leading-tight text-charcoal md:text-[36px]">
            A small team holding the line between two continents.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted md:text-base">
            UKEN is the partnership between creators in the African cradle — and
            specifically Kenya, where we began — and buyers across the United
            Kingdom. We are based in Nottingham, with a working office in
            Nairobi, and we move daily between both. Our job is to find the
            real makers, tell their work honestly, and deliver it intact.
          </p>
        </section>

        {/* What we do */}
        <section className="bg-cream/40 py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-6 md:px-10">
            <SectionLabel tone="terracotta">What we do</SectionLabel>
            <h2 className="mt-3 font-display text-[28px] leading-tight text-charcoal md:text-[36px]">
              Deliver value both ways — and refuse to lose either.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted md:text-base">
              We bring UK buyers the arts and crafts of the African cradle —
              the pieces that carry memory, skill, and quiet beauty — and we
              return real income, recognition, and motivation to the creators
              who made them. Every sale is structured so the larger share of
              value stays in Kenya, with the maker. We don't broker the work,
              we walk alongside it.
            </p>
          </div>
        </section>

        {/* Parties involved */}
        <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
          <div className="max-w-3xl">
            <SectionLabel tone="gold">Who's involved</SectionLabel>
            <h2 className="mt-3 font-display text-[28px] leading-tight text-charcoal md:text-[36px]">
              Four parties. One exchange worth protecting.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {audiences.map(({ title, body, icon: Icon }) => (
              <Card
                key={title}
                tone="cream"
                elevation="lift"
                className="flex gap-4 p-5 md:p-6"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-clay/10 text-clay">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-display text-[20px] leading-tight text-charcoal md:text-[22px]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                    {body}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* How we trade — contracts */}
        <section className="bg-charcoal text-warm-white">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[oklch(0.85_0.08_55)]">
                How we trade
              </p>
              <h2 className="mt-3 font-display text-[28px] leading-tight md:text-[36px]">
                Three ways to work with Kenyan makers — one live now, two on
                the way.
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-warm-white/75">
                The split is published and unchanged: <strong className="text-warm-white">60% of every one-off sale goes directly to the creator</strong>. The remaining 40% pays for international shipping, customs, payments, the platform, and the people keeping it all running.
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {contracts.map(({ title, body, tag, icon: Icon, live }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-warm-white/12 bg-warm-white/[0.04] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(0.85_0.08_55)]/15 text-[oklch(0.88_0.06_55)]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <span
                      className={
                        live
                          ? "rounded-full bg-[oklch(0.85_0.08_55)]/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[oklch(0.92_0.06_55)]"
                          : "rounded-full border border-warm-white/25 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-warm-white/65"
                      }
                    >
                      {tag}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-[22px] leading-tight text-warm-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-warm-white/75">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promises */}
        <section className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
          <div className="max-w-3xl">
            <SectionLabel tone="terracotta">Our promises</SectionLabel>
            <h2 className="mt-3 font-display text-[28px] leading-tight text-charcoal md:text-[36px]">
              Cleanly made. Honestly sourced. Mutually valued.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {promises.map(({ title, body, icon: Icon }) => (
              <Card
                key={title}
                tone="cream"
                elevation="lift"
                className="p-6 md:p-7"
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-clay/10 text-clay">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 font-display text-[22px] leading-tight text-charcoal">
                  {title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                  {body}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 pb-20 md:px-10">
          <div className="rounded-2xl border border-border/60 bg-cream/40 p-6 md:p-9">
            <p className="font-display text-2xl italic leading-snug text-charcoal md:text-3xl">
              “Both the hands that make and the hands that hold must value the
              art between them. That is UKEN.”
            </p>
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-charcoal/55">
              The UKEN promise
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild variant="primary" size="lg">
                <Link to="/explore">
                  Meet the makers <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/shop">Browse the collection</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/contact">Partner with UKEN</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
