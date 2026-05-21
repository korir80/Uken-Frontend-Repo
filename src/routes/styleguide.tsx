import { createFileRoute } from "@tanstack/react-router";
import {
  Button,
  Badge,
  Avatar,
  Divider,
  SectionLabel,
  Card,
  StoryCard,
  ProductCard,
  Logo,
} from "@/components/ukena";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import storyWeaver from "@/assets/story-weaver.jpg";
import productVessel from "@/assets/product-vessel.jpg";
import productBeads from "@/assets/product-beads.jpg";

export const Route = createFileRoute("/styleguide")({
  head: () => ({
    meta: [
      { title: "UKEN · Style Guide" },
      {
        name: "description",
        content:
          "The UKEN design system — tokens, typography, components and patterns used across the marketplace.",
      },
      { property: "og:title", content: "UKEN Style Guide — Design System" },
      {
        property: "og:description",
        content:
          "Tokens, typography, and components powering UKEN's editorial marketplace UI.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DesignSystemShowcase,
});

const palette = [
  { name: "Deep Clay", token: "clay", hex: "#8B4513", className: "bg-clay", fg: "text-warm-white" },
  { name: "Clay Deep", token: "clay-deep", hex: "—", className: "bg-clay-deep", fg: "text-warm-white" },
  { name: "Warm Sand", token: "sand", hex: "#D2B48C", className: "bg-sand", fg: "text-charcoal" },
  { name: "Sand Soft", token: "sand-soft", hex: "—", className: "bg-sand-soft", fg: "text-charcoal" },
  { name: "Cream", token: "cream", hex: "#FAF7F2", className: "bg-cream border border-border", fg: "text-charcoal" },
  { name: "Warm White", token: "warm-white", hex: "#FEFCF9", className: "bg-warm-white border border-border", fg: "text-charcoal" },
  { name: "Charcoal", token: "charcoal", hex: "#2C2420", className: "bg-charcoal", fg: "text-warm-white" },
  { name: "Terracotta", token: "terracotta", hex: "#C1694F", className: "bg-terracotta", fg: "text-warm-white" },
  { name: "Gold", token: "gold", hex: "#B8860B", className: "bg-gold", fg: "text-warm-white" },
];

function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      {/* ───────────── Header ───────────── */}
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl tracking-tight text-charcoal">
              UKEN
            </span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-ink-muted">
              Design Library
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
            <a href="#palette" className="transition-colors hover:text-clay">Palette</a>
            <a href="#typography" className="transition-colors hover:text-clay">Typography</a>
            <a href="#components" className="transition-colors hover:text-clay">Components</a>
          </nav>
        </div>
      </header>

      {/* ───────────── Hero ───────────── */}
      <section className="mx-auto max-w-6xl px-8 pt-24 pb-20">
        <SectionLabel>The Foundation</SectionLabel>
        <h1 className="mt-6 max-w-3xl font-display text-[64px] leading-[1.02] tracking-tight text-charcoal md:text-[88px]">
          A craft-first design system for{" "}
          <em className="italic text-terracotta">Kenyan makers</em> &amp; British homes.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
          Tokens, components, and editorial primitives — the building blocks for
          UKEN's marketplace. Earthy, considered, and built to let stories breathe.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg">
            Explore Components <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg">View Tokens</Button>
        </div>
      </section>

      <Divider variant="ornament" />

      {/* ───────────── Palette ───────────── */}
      <section id="palette" className="mx-auto max-w-6xl px-8 py-24">
        <div className="mb-14 max-w-2xl">
          <SectionLabel tone="gold">01 · Colour</SectionLabel>
          <h2 className="mt-5 font-display text-5xl leading-tight text-charcoal">
            A palette pulled from earth &amp; afternoon light.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            Nine warm tones, no neon, no gradient buttons. Every surface is built
            on cream and warm white, anchored by deep clay and charcoal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {palette.map((c) => (
            <div
              key={c.token}
              className="overflow-hidden rounded-xl border border-border/70 bg-warm-white shadow-[var(--shadow-soft)]"
            >
              <div className={`${c.className} ${c.fg} flex h-36 items-end p-5`}>
                <span className="font-display text-2xl">{c.name}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3 text-[12px]">
                <code className="font-mono text-ink-muted">--{c.token}</code>
                <span className="font-mono text-charcoal">{c.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Divider variant="ornament" />

      {/* ───────────── Typography ───────────── */}
      <section id="typography" className="mx-auto max-w-6xl px-8 py-24">
        <div className="mb-14 max-w-2xl">
          <SectionLabel tone="gold">02 · Typography</SectionLabel>
          <h2 className="mt-5 font-display text-5xl leading-tight text-charcoal">
            Cormorant Garamond, set against DM Sans.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted">
            A serif with quiet confidence for headlines and editorial moments,
            paired with a humanist sans for product, navigation and prose.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {[
              { tag: "H1 · Display", el: <h1 className="font-display text-7xl leading-[1.02] tracking-tight">The makers of Maragua.</h1> },
              { tag: "H2", el: <h2 className="font-display text-5xl leading-tight">Hands that remember.</h2> },
              { tag: "H3", el: <h3 className="font-display text-4xl leading-snug">A vessel for the morning.</h3> },
              { tag: "H4", el: <h4 className="font-display text-2xl leading-snug">Featured collection</h4> },
              { tag: "H5 · UI", el: <h5 className="font-sans text-base font-medium uppercase tracking-[0.18em]">Latest stories</h5> },
              {
                tag: "Body",
                el: (
                  <p className="max-w-xl text-base leading-relaxed text-charcoal">
                    Every UKEN piece arrives with a name, a place, and the
                    person who made it. Our journal traces the route from
                    workshop to doorstep — from Maragua sisal fields to a
                    kitchen in Margate.
                  </p>
                ),
              },
              {
                tag: "Caption",
                el: (
                  <p className="text-[12px] uppercase tracking-[0.18em] text-ink-muted">
                    Photographed in Nairobi · March 2025
                  </p>
                ),
              },
              {
                tag: "Quote",
                el: (
                  <blockquote className="border-l-2 border-terracotta pl-6">
                    <p className="font-display text-2xl italic leading-snug text-charcoal">
                      "We do not make objects. We make the hours that hold them."
                    </p>
                    <footer className="mt-3 text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                      — Wanjiru K., basket weaver
                    </footer>
                  </blockquote>
                ),
              },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-[120px_1fr] gap-8 border-b border-border/60 pb-8 last:border-0">
                <span className="pt-2 text-[10px] uppercase tracking-[0.22em] text-terracotta">
                  {row.tag}
                </span>
                <div>{row.el}</div>
              </div>
            ))}
          </div>

          <aside className="h-fit space-y-6 rounded-2xl bg-cream p-8">
            <SectionLabel tone="clay">Type Specimens</SectionLabel>
            <div>
              <p className="font-display text-6xl leading-none text-charcoal">Aa</p>
              <p className="mt-3 text-sm text-ink-muted">Cormorant Garamond</p>
              <p className="text-[11px] uppercase tracking-wider text-ink-muted">300 · 400 · 500 · 600</p>
            </div>
            <Divider />
            <div>
              <p className="font-sans text-6xl font-medium leading-none text-charcoal">Aa</p>
              <p className="mt-3 text-sm text-ink-muted">DM Sans</p>
              <p className="text-[11px] uppercase tracking-wider text-ink-muted">300 · 400 · 500 · 600</p>
            </div>
          </aside>
        </div>
      </section>

      <Divider variant="ornament" />

      {/* ───────────── Components ───────────── */}
      <section id="components" className="mx-auto max-w-6xl px-8 py-24">
        <div className="mb-14 max-w-2xl">
          <SectionLabel tone="gold">03 · Components</SectionLabel>
          <h2 className="mt-5 font-display text-5xl leading-tight text-charcoal">
            The library, in working order.
          </h2>
        </div>

        {/* Buttons */}
        <div className="mb-16">
          <h3 className="mb-6 font-display text-2xl text-charcoal">Buttons</h3>
          <div className="space-y-8 rounded-2xl bg-cream p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Shop the collection</Button>
              <Button variant="secondary">Read the journal</Button>
              <Button variant="ghost">Browse all</Button>
              <Button variant="link">Learn about our makers →</Button>
            </div>
            <Divider />
            <div className="flex flex-wrap items-end gap-3">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary"><ShoppingBag /> Add to basket</Button>
              <Button variant="secondary"><Heart /> Save</Button>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-16">
          <h3 className="mb-6 font-display text-2xl text-charcoal">Tags &amp; Badges</h3>
          <div className="flex flex-wrap gap-3 rounded-2xl bg-cream p-10">
            <Badge variant="clay">Handwoven</Badge>
            <Badge variant="terracotta">New arrival</Badge>
            <Badge variant="gold">Limited edition</Badge>
            <Badge variant="sand">In stock</Badge>
            <Badge variant="cream">Made in Kisumu</Badge>
            <Badge variant="outline">Sustainable sisal</Badge>
          </div>
        </div>

        {/* Avatars */}
        <div className="mb-16">
          <h3 className="mb-6 font-display text-2xl text-charcoal">Avatars</h3>
          <div className="flex flex-wrap items-end gap-6 rounded-2xl bg-cream p-10">
            <Avatar name="Wanjiru Kamau" size="sm" />
            <Avatar name="Achieng Otieno" size="md" />
            <Avatar name="Mumo Mwangi" size="lg" ring />
            <Avatar name="Njeri Kariuki" size="xl" ring />
          </div>
        </div>

        {/* Dividers */}
        <div className="mb-16">
          <h3 className="mb-6 font-display text-2xl text-charcoal">Dividers</h3>
          <div className="space-y-10 rounded-2xl bg-cream p-10">
            <Divider />
            <Divider variant="dotted" />
            <Divider variant="ornament" />
            <Divider label="Continued" />
          </div>
        </div>

        {/* Section labels */}
        <div className="mb-16">
          <h3 className="mb-6 font-display text-2xl text-charcoal">Section Labels</h3>
          <div className="flex flex-col gap-5 rounded-2xl bg-cream p-10">
            <SectionLabel>Featured this week</SectionLabel>
            <SectionLabel tone="gold">From the journal</SectionLabel>
            <SectionLabel tone="clay">Meet the maker</SectionLabel>
            <SectionLabel tone="muted">Shipping from Nairobi</SectionLabel>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-16">
          <h3 className="mb-6 font-display text-2xl text-charcoal">Cards</h3>

          <div className="mb-10 grid gap-6 md:grid-cols-3">
            <Card tone="cream" elevation="soft" className="p-8">
              <SectionLabel tone="clay">Base · Cream</SectionLabel>
              <p className="mt-4 font-display text-2xl text-charcoal">
                A quiet container for any content.
              </p>
            </Card>
            <Card tone="warm-white" elevation="lift" className="p-8">
              <SectionLabel tone="clay">Base · Lift</SectionLabel>
              <p className="mt-4 font-display text-2xl text-charcoal">
                Hover for a soft, warm shadow.
              </p>
            </Card>
            <Card tone="sand" elevation="flat" className="p-8">
              <SectionLabel tone="clay">Base · Sand</SectionLabel>
              <p className="mt-4 font-display text-2xl text-charcoal">
                Anchor a section without weight.
              </p>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <StoryCard
              image={storyWeaver}
              eyebrow="Field notes"
              title="The weavers of Maragua"
              excerpt="Three days with the women whose hands turn sisal into the baskets that line our shelves — and the small, slow economy they've built around them."
              author={{ name: "Aoife Connolly", location: "Nairobi · 2025" }}
              readTime="8 min read"
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <ProductCard
                image={productVessel}
                name="Soko Vessel"
                artisan="Mumo Mwangi"
                region="Kiambu"
                price="£68"
                badge={{ label: "New", tone: "terracotta" }}
              />
              <ProductCard
                image={productBeads}
                name="Maa Collar"
                artisan="Naserian L."
                region="Kajiado"
                price="£124"
                badge={{ label: "1 of 12", tone: "gold" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Footer ───────────── */}
      <footer className="border-t border-border/70 bg-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-8 py-12 md:flex-row md:items-center">
          <div>
            <Logo className="h-[60px]" />
            <p className="mt-1 text-sm text-ink-muted">
              Story-driven craft, hand to hand.
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            Design system v0.1 · ukena.co.uk
          </p>
        </div>
      </footer>
    </div>
  );
}
