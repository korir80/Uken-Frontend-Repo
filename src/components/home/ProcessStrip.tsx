import { SectionLabel } from "@/components/ukena";
import { CompassIcon, ThreadIcon, VesselIcon } from "./icons";
import type { ComponentType, SVGProps } from "react";

interface Step {
  n: string;
  title: string;
  copy: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const steps: Step[] = [
  {
    n: "I",
    title: "Discover a creator",
    copy: "Begin with a person, not a product. Browse the makers behind every Ukena piece.",
    Icon: CompassIcon,
  },
  {
    n: "II",
    title: "Connect with their story",
    copy: "Read their journal, their region, the techniques passed down through generations.",
    Icon: ThreadIcon,
  },
  {
    n: "III",
    title: "Own a piece of their craft",
    copy: "Commission an heirloom, shipped from workshop to your home in the UK.",
    Icon: VesselIcon,
  },
];

export function ProcessStrip() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 max-w-2xl md:mb-20">
          <SectionLabel tone="gold">How Ukena works</SectionLabel>
          <h2 className="mt-5 font-display text-[36px] leading-[1.1] tracking-tight text-charcoal md:text-5xl">
            From a maker's hands to your home — in three considered steps.
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-16">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className="relative md:border-l md:border-border md:pl-8 first:md:border-l-0 first:md:pl-0"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl text-terracotta">
                  {step.n}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <step.Icon className="mt-8 h-12 w-12 text-clay-deep" />

              <h3 className="mt-7 font-display text-2xl leading-snug text-charcoal md:text-[28px]">
                {step.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
                {step.copy}
              </p>

              {i < steps.length - 1 && (
                <div className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-ink-muted md:hidden">
                  <span>then</span>
                  <span className="h-px w-8 bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
