import { Link } from "@tanstack/react-router";
import { Button, SectionLabel } from "@/components/ukena";
import { ArrowRight } from "lucide-react";

export function ArtisanCTA() {
  return (
    <section className="relative overflow-hidden bg-warm-white py-24 md:py-32">
      {/* Warm wash backdrop */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 50%, oklch(0.92 0.04 65 / 0.55), transparent 70%), radial-gradient(ellipse 60% 50% at 10% 100%, oklch(0.85 0.06 38 / 0.35), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-12 md:gap-12 md:px-10">
        {/* Left: editorial mark */}
        <div className="md:col-span-4">
          <SectionLabel tone="gold">Are you a Kenyan artisan?</SectionLabel>
          <div className="mt-8 hidden md:block">
            <span className="font-display text-[160px] leading-none italic text-terracotta/25">
              ❋
            </span>
          </div>
        </div>

        {/* Right: headline + CTA */}
        <div className="md:col-span-8">
          <h2 className="font-display text-[40px] leading-[1.05] tracking-tight text-charcoal md:text-6xl lg:text-[68px]">
            Your craft deserves{" "}
            <em className="italic text-terracotta">a global stage.</em>
          </h2>

          <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-ink-muted md:text-[17px]">
            We're building Ukena for the makers first. Fair margins, your name
            on every piece, your story told the way you'd tell it. No middlemen
            mistranslating the work of your hands.
          </p>

          <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="bg-terracotta hover:bg-[oklch(0.52_0.13_38)]"
            >
              <Link to="/join">
                Join Ukena <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <a
              href="/join"
              className="group inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.2em] text-clay"
            >
              How the partnership works
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 text-[12px] uppercase tracking-[0.22em] text-ink-muted">
            <span className="inline-flex items-center gap-3">
              <span className="h-px w-6 bg-terracotta" />
              You set your prices
            </span>
            <span className="inline-flex items-center gap-3">
              <span className="h-px w-6 bg-terracotta" />
              Paid in full, on time
            </span>
            <span className="inline-flex items-center gap-3">
              <span className="h-px w-6 bg-terracotta" />
              Your name, every piece
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
