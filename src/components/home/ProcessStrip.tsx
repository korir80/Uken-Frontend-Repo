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
    title: "Discover the source",
    copy: "Begin with a person and a place. Browse makers, farmers, regions, and the methods behind each product.",
    Icon: CompassIcon,
  },
  {
    n: "II",
    title: "Feel their story",
    copy: "Read the notes, see the workshop or farm. Understand the hands before the piece, harvest, or cup.",
    Icon: ThreadIcon,
  },
  {
    n: "III",
    title: "Bring East Africa home",
    copy: "Choose coffee, tea, foods, textiles, or craft, shipped from across East Africa to your home in the UK.",
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
    title: "Earn 60% of every sale",
    copy: "Transparent split: 60% goes directly to you, 40% covers shipping, customs, payments and the platform. Paid via M-Pesa, monthly above €100.",
    Icon: LeafIcon,
  },
];

export function ProcessStrip() {
  return (
    <section className="bg-cream py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-5 max-w-2xl md:mb-6">
          <SectionLabel tone="gold">How UKEN works</SectionLabel>
          <h2 className="mt-2 font-display text-[28px] leading-[1.06] tracking-tight text-charcoal md:text-[34px]">
            Two journeys.{" "}
            <em className="italic text-terracotta">One thread between them.</em>
          </h2>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-muted md:text-[14px]">
            UKEN exists for the buyer who wants to know, and the East African farmer,
            artisan, and maker who deserves to be known.
          </p>
        </div>

        <ProcessTrack
          eyebrow="If you're here to buy"
          steps={buyerSteps}
        />

        {/* Editorial separator */}
        <div className="my-5 flex items-center gap-4 md:my-6">
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
      <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-ink-muted md:mb-5">
        — {eyebrow}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:gap-8">
        {steps.map((step, i) => (
          <div
            key={step.n}
            className="relative min-w-0 rounded-2xl bg-cream/65 p-4 ring-1 ring-border/55 sm:bg-transparent sm:p-0 sm:ring-0 md:border-l md:border-border md:pl-8 first:md:border-l-0 first:md:pl-0"
          >
            <div className="flex items-baseline gap-4">
              <span className={`font-display text-3xl ${numeralColor}`}>
                {step.n}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <step.Icon className="mt-3 h-8 w-8 text-clay-deep" />

            <h3 className="mt-3 font-display text-[22px] leading-snug text-charcoal md:text-[24px]">
              {step.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted md:text-[14px]">
              {step.copy}
            </p>

            {i < steps.length - 1 && (
              <div className="mt-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-ink-muted md:hidden">
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
