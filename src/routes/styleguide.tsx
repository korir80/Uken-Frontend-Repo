import { createFileRoute, Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel, Logo } from "@/components/ukena";
import { ArrowRight, Palette, Type, Layers, Sparkles } from "lucide-react";

export const Route = createFileRoute("/styleguide")({
  head: () => ({
    meta: [
      { title: "UKEN · Style Guide — Coming Soon" },
      {
        name: "description",
        content:
          "The UKEN public design system is being prepared — tokens, typography, components and patterns will live here soon.",
      },
      { property: "og:title", content: "UKEN Style Guide — Coming Soon" },
      {
        property: "og:description",
        content:
          "Tokens, typography, and components powering UKEN's editorial marketplace UI. Coming soon.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ComingSoonStyleguide,
});

function ComingSoonStyleguide() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />

      <main className="relative overflow-hidden">
        {/* Decorative background */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-terracotta/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent"
        />

        <section className="mx-auto flex max-w-4xl flex-col items-center px-5 py-20 text-center md:px-8 md:py-28">
          <Logo className="h-14 w-auto md:h-16" />

          <div className="mt-10">
            <SectionLabel tone="terracotta">Design System</SectionLabel>
          </div>

          <h1 className="mt-4 font-display text-[44px] leading-[1.04] tracking-tight text-charcoal md:text-[72px]">
            The UKEN style guide
            <span className="block italic text-terracotta">is being woven.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-ink-muted md:text-[18px]">
            Tokens, typography, motion, and components — the same craft that
            shapes our marketplace, soon documented in one place for partners
            and collaborators.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border/70 bg-warm-white/70 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-ink-muted backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-terracotta" />
            </span>
            Coming Soon
          </div>

          {/* Preview tiles */}
          <div className="mt-14 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Palette, label: "Palette", note: "Clay · Sand · Terracotta · Gold" },
              { icon: Type, label: "Typography", note: "Cormorant Garamond · DM Sans" },
              { icon: Layers, label: "Components", note: "Cards · Buttons · Inputs" },
              { icon: Sparkles, label: "Motion", note: "Soft, considered, never busy" },
            ].map(({ icon: Icon, label, note }) => (
              <div
                key={label}
                className="group rounded-2xl border border-border/60 bg-warm-white/80 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-terracotta/50 hover:shadow-card"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                </div>
                <p className="mt-4 font-display text-[20px] leading-tight text-charcoal">
                  {label}
                </p>
                <p className="mt-1 text-[13px] text-ink-muted">{note}</p>
              </div>
            ))}
          </div>

          {/* Swatch teaser */}
          <div className="mt-10 flex h-3 w-full max-w-md overflow-hidden rounded-full border border-border/60">
            <span className="flex-1 bg-clay" />
            <span className="flex-1 bg-terracotta" />
            <span className="flex-1 bg-sand" />
            <span className="flex-1 bg-gold" />
            <span className="flex-1 bg-cream" />
            <span className="flex-1 bg-charcoal" />
          </div>

          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-[14px] font-medium text-warm-white shadow-soft transition-colors hover:bg-clay"
            >
              Back to the marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border bg-warm-white px-5 py-2.5 text-[14px] font-medium text-charcoal transition-colors hover:border-charcoal/40"
            >
              Get notified
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
