import { SectionLabel } from "@/components/ukena";
import {
  CompassIcon,
  ThreadIcon,
  VesselIcon,
  LeafIcon,
} from "./icons";
import type { ComponentType, SVGProps } from "react";

interface Step {
  n: string;
  title: string;
  copy: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const buyerSteps: Step[] = [
  {
    n: "I",
    title: "Discover a creator",
    copy: "Begin with a person. Browse the makers, their regions, the techniques they keep alive.",
    Icon: CompassIcon,
  },
  {
    n: "II",
    title: "Feel their story",
    copy: "Read the journal entries, see the workshop. Understand the hands before the heirloom.",
    Icon: ThreadIcon,
  },
  {
    n: "III",
    title: "Own their craft",
    copy: "Commission a piece, shipped from the workshop in Kenya to your home in the UK.",
    Icon: VesselIcon,
  },
];

const artisanSteps: Step[] = [
  {
    n: "I",
    title: "Share your story",
    copy: "Tell us about your craft, your region, the people who taught you. We help you tell it well.",
    Icon: ThreadIcon,
  },
  {
    n: "II",
    title: "Reach the world",
    copy: "Your work meets buyers in the UK who care about provenance, patience, and the maker's name.",
    Icon: CompassIcon,
  },
  {
    n: "III",
    title: "Earn fairly",
    copy: "You set the price of your craft. Transparent margins, paid in full, on time, every time.",
    Icon: LeafIcon,
  },
];

export function ProcessStrip() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-16 max-w-2xl md:mb-20">
          <SectionLabel tone="gold">How Ukena works</SectionLabel>
          <h2 className="mt-5 font-display text-[36px] leading-[1.1] tracking-tight text-charcoal md:text-5xl">
            Two journeys.{" "}
            <em className="italic text-terracotta">One thread between them.</em>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Ukena exists for the buyer who wants to know, and the maker who
            deserves to be known.
          </p>
        </div>

        <ProcessTrack
          eyebrow="If you're here to buy"
          steps={buyerSteps}
        />

        {/* Editorial separator */}
        <div className="my-20 flex items-center gap-6 md:my-28">
          <span className="h-px flex-1 bg-border" />
          <span className="font-display text-2xl italic text-terracotta">
            &amp;
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <ProcessTrack
          eyebrow="If you're here to make"
          steps={artisanSteps}
          accent="clay"
        />
      </div>
    </section>
  );
}

function ProcessTrack({
  eyebrow,
  steps,
  accent = "terracotta",
}: {
  eyebrow: string;
  steps: Step[];
  accent?: "terracotta" | "clay";
}) {
  const numeralColor =
    accent === "clay" ? "text-clay-deep" : "text-terracotta";

  return (
    <div>
      <p className="mb-10 text-[11px] uppercase tracking-[0.3em] text-ink-muted md:mb-14">
        — {eyebrow}
      </p>
      <div className="grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-16">
        {steps.map((step, i) => (
          <div
            key={step.n}
            className="relative md:border-l md:border-border md:pl-8 first:md:border-l-0 first:md:pl-0"
          >
            <div className="flex items-baseline gap-4">
              <span className={`font-display text-3xl ${numeralColor}`}>
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
  );
}
