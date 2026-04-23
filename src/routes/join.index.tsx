import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button, SectionLabel } from "@/components/ukena";
import { JoinShell } from "@/components/join/JoinShell";
import joinHero from "@/assets/join-hero.jpg";

export const Route = createFileRoute("/join/")({
  head: () => ({
    meta: [
      { title: "Join Ukena — A home for Kenyan makers" },
      {
        name: "description",
        content:
          "Ukena is built for Kenyan artisans first. Fair margins, your name on every piece, your story told the way you'd tell it.",
      },
      { property: "og:title", content: "Join Ukena — A home for Kenyan makers" },
      {
        property: "og:description",
        content:
          "Tell us about your craft. We'll be in touch within 48 hours.",
      },
      { property: "og:image", content: joinHero },
    ],
  }),
  component: JoinLanding,
});

const promises = [
  {
    title: "You set your prices.",
    body: "Not us. You know what your work is worth — we add a transparent margin on top, never inside.",
  },
  {
    title: "Your name on every piece.",
    body: "Buyers meet you before they meet your work. No anonymous catalogues, no white-label.",
  },
  {
    title: "Paid in full, on time.",
    body: "Funds clear to your M-Pesa or bank within 7 days of dispatch. No 90-day waits.",
  },
  {
    title: "Your story, in your words.",
    body: "We sit down with you — in person or by phone — and write nothing without your blessing.",
  },
];

function JoinLanding() {
  return (
    <JoinShell>
      {/* Hero — compact, content visible above the fold */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-12">
          <div className="bg-warm-white px-5 pb-8 pt-6 md:col-span-7 md:px-10 md:pb-10 md:pt-10 lg:px-12">
            <SectionLabel tone="gold">A note for Kenyan artisans</SectionLabel>
            <h1 className="mt-3 font-display text-[30px] leading-[1.05] tracking-tight text-charcoal sm:text-[34px] md:mt-3 md:text-[42px]">
              Your craft deserves{" "}
              <em className="italic text-terracotta">a global stage.</em>
            </h1>
            <p className="mt-2.5 max-w-xl text-[13px] leading-relaxed text-ink-muted md:text-sm">
              Ukena was built for the makers first. We don't run a marketplace
              of products — we keep an index of people. If you make something
              with your hands in Kenya, we'd like to hear from you.
            </p>

            <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Button
                asChild
                variant="primary"
                size="md"
                className="bg-terracotta hover:bg-[oklch(0.52_0.13_38)]"
              >
                <Link to="/join/apply">
                  Begin your application <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="max-w-[260px] text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                Takes about 6 minutes. No accounts, no fees.
              </p>
            </div>
          </div>

          <div className="relative h-[200px] md:col-span-5 md:h-auto md:min-h-[260px]">
            <img
              src={joinHero}
              alt="An artisan's hands at work in a sunlit Kenyan workshop"
              className="absolute inset-0 h-full w-full object-cover"
              width={1600}
              height={1100}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-warm-white/40 via-transparent to-transparent md:from-warm-white/60" />
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="border-t border-border/60 bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionLabel>What we promise you</SectionLabel>
              <h2 className="mt-6 font-display text-[36px] leading-[1.05] text-charcoal md:text-[48px]">
                Four things, in writing.
              </h2>
              <p className="mt-6 text-[15px] leading-relaxed text-ink-muted">
                These are the terms before any contract. If we ever break one,
                you walk — and you keep what's yours.
              </p>
            </div>

            <ul className="md:col-span-8 md:pl-10">
              {promises.map((p, i) => (
                <li
                  key={p.title}
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-border/70 py-8 first:border-t-0 first:pt-0 md:gap-x-10"
                >
                  <span className="font-display text-2xl text-terracotta tabular-nums md:text-3xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[24px] leading-tight text-charcoal md:text-[28px]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-warm-white py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
          <span className="font-display text-5xl italic text-terracotta/40">
            ❋
          </span>
          <h2 className="mt-6 font-display text-[36px] leading-[1.05] text-charcoal md:text-[52px]">
            Ready when you are.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
            The application is four short conversations. Take your time —
            you can come back to it.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              variant="primary"
              size="lg"
              className="bg-terracotta hover:bg-[oklch(0.52_0.13_38)]"
            >
              <Link to="/join/apply">
                Begin your application <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </JoinShell>
  );
}
