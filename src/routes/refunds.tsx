import { createFileRoute } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import { routeSeo } from "@/lib/seo";

const LAST_UPDATED = "19 May 2026";

export const Route = createFileRoute("/refunds")({
  head: () =>
    routeSeo({
      path: "/refunds",
      title: "Refund & Returns Policy — UKEN",
      description:
        "How refunds, returns, exchanges, and store credit work for handmade pieces ordered through UKEN.",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Refunds", path: "/refunds" },
      ],
    }),
  component: RefundsPage,
});

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 font-display text-[24px] leading-tight text-charcoal md:text-[30px]">
      {children}
    </h2>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
      {children}
    </p>
  );
}
function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
      {children}
    </ul>
  );
}

function RefundsPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <SectionLabel tone="terracotta">Legal</SectionLabel>
        <h1 className="mt-3 font-display text-[34px] leading-tight text-charcoal md:text-[48px]">
          Refund &amp; Returns Policy
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-ink-muted">
          Last updated: {LAST_UPDATED}
        </p>

        <P>
          Every piece on UKEN is made by hand in a Kenyan workshop. We stand
          behind the makers' work and want you to be genuinely happy with what
          arrives. Refunds, exchanges, and store credit are available in the
          qualifying circumstances described below.
        </P>

        <H2>1. When you can ask for a refund</H2>
        <UL>
          <li>The piece arrives damaged or with a manufacturing fault.</li>
          <li>The piece is materially different from what was listed (wrong item, wrong size, wrong colour family).</li>
          <li>The order never arrives and a courier trace confirms the parcel is lost.</li>
          <li>You change your mind about a non-personalised piece, and you contact us within 14 days of delivery (UK consumer right; honoured globally).</li>
        </UL>

        <H2>2. How to start a refund request</H2>
        <P>
          All refund requests must be initiated by emailing the UKEN admin
          team:
        </P>
        <UL>
          <li>
            Email:{" "}
            <a className="underline" href="mailto:hello@ukena.co.uk">
              hello@ukena.co.uk
            </a>
          </li>
          <li>Subject line: "Refund request — [your order number]"</li>
        </UL>
        <P>Please include the following so we can review quickly:</P>
        <UL>
          <li>Your order number and the name the order was placed under</li>
          <li>The specific piece(s) you are asking about</li>
          <li>The reason for the request</li>
          <li>
            Supporting evidence where relevant — clear photographs of the
            damage, the packaging, or the difference from the listing; courier
            tracking screenshots for lost parcels
          </li>
          <li>Whether you would prefer a refund, an exchange, or store credit</li>
        </UL>

        <H2>3. Review and response timeframe</H2>
        <UL>
          <li>We acknowledge every refund email within 2 working days.</li>
          <li>We aim to make a decision within 7 working days of receiving all required information (and the returned item, where one is needed).</li>
          <li>Approved refunds are processed through Stripe back to the original payment method and typically appear within 5–10 working days, depending on your bank.</li>
        </UL>

        <H2>4. When refunds may be declined</H2>
        <UL>
          <li>Personalised, custom-commissioned, or made-to-order pieces, unless they arrive damaged or materially different from what was agreed.</li>
          <li>Pieces returned outside the 14-day change-of-mind window, used, washed, or without their original tags and packaging.</li>
          <li>Cosmetic variations that are inherent to handmade work — small differences in weave, stitch density, bead placement, grain, or natural-dye tone are part of the piece, not faults.</li>
          <li>Damage caused after delivery (drops, spills, improper care).</li>
          <li>Refusal of a parcel at customs after duties have been correctly invoiced to the buyer.</li>
        </UL>

        <H2>5. Return shipping</H2>
        <UL>
          <li>If the issue is our fault or the maker's (damaged, faulty, or wrong item), we cover return shipping.</li>
          <li>For change-of-mind returns, the buyer pays return shipping and is responsible for the parcel until it reaches our Nairobi office.</li>
          <li>Do not return anything before contacting us — unannounced returns may be lost in transit and cannot be refunded.</li>
        </UL>

        <H2>6. Exchanges and store credit</H2>
        <UL>
          <li>Exchanges are offered where the same maker has a comparable piece in stock; we will quote any difference in price or shipping before proceeding.</li>
          <li>Store credit is offered as an alternative to a cash refund and is valid for 12 months from issue, usable across the full UKEN catalogue.</li>
        </UL>

        <H2>7. Cancellations before dispatch</H2>
        <P>
          If your order has not yet shipped, email us and we will cancel and
          refund in full. Once a parcel has been handed to the courier the
          standard refund process above applies.
        </P>

        <H2>8. Questions</H2>
        <P>
          Anything unclear? Email{" "}
          <a className="underline" href="mailto:hello@ukena.co.uk">
            hello@ukena.co.uk
          </a>{" "}
          or call the relevant office: Andrew Soi on +44 7425 241649 (UK) or
          Edwin Agasa on +254 720 848 695 (Kenya). We would rather hear from
          you early than have you sit with a piece that isn't right.
        </P>
      </main>
      <Footer />
    </div>
  );
}
