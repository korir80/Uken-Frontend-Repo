import { createFileRoute } from "@tanstack/react-router";
import { LegalShell, Section, P, UL } from "@/components/legal/LegalShell";
import { routeSeo } from "@/lib/seo";

const LAST_UPDATED = "22 May 2026";

const TOC = [
  { id: "when", label: "1. When refunds apply" },
  { id: "how", label: "2. How to request" },
  { id: "timing", label: "3. Timeframes" },
  { id: "declined", label: "4. When declined" },
  { id: "shipping", label: "5. Return shipping" },
  { id: "exchanges", label: "6. Exchanges & credit" },
  { id: "cancel", label: "7. Cancellations" },
  { id: "questions", label: "8. Questions" },
];

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

function RefundsPage() {
  return (
    <LegalShell
      title="Refund & Returns Policy"
      lastUpdated={LAST_UPDATED}
      toc={TOC}
      intro="Every piece is made by hand. If something isn't right, here is exactly how we'll make it right — clearly, and without small print."
    >
      <Section id="when" title="1. When you can ask for a refund">
        <UL>
          <li>The piece arrives damaged or with a manufacturing fault.</li>
          <li>The piece is materially different from what was listed (wrong item, wrong size, wrong colour family).</li>
          <li>The order never arrives and a courier trace confirms the parcel is lost.</li>
          <li>You change your mind about a non-personalised piece, and you contact us within 14 days of delivery (UK consumer right; honoured globally).</li>
        </UL>
      </Section>

      <Section id="how" title="2. How to start a refund request">
        <P>All refund requests must be initiated by calling the UKEN admin team:</P>
        <UL>
          <li>UK — Andrew Soi: +44 7425 241649</li>
          <li>Kenya — Edwin Agasa: +254 720 848 695</li>
          <li>Have your order number ready when you call.</li>
        </UL>
        <P>Please include the following so we can review quickly:</P>
        <UL>
          <li>Your order number and the name the order was placed under</li>
          <li>The specific piece(s) you are asking about</li>
          <li>The reason for the request</li>
          <li>Supporting evidence where relevant — clear photographs of the damage, the packaging, or the difference from the listing; courier tracking screenshots for lost parcels</li>
          <li>Whether you would prefer a refund, an exchange, or store credit</li>
        </UL>
      </Section>

      <Section id="timing" title="3. Review and response timeframe">
        <UL>
          <li>We acknowledge every refund request within 2 working days.</li>
          <li>We aim to make a decision within 7 working days of receiving all required information (and the returned item, where one is needed).</li>
          <li>Approved refunds are processed through Stripe back to the original payment method and typically appear within 5–10 working days, depending on your bank.</li>
        </UL>
      </Section>

      <Section id="declined" title="4. When refunds may be declined">
        <UL>
          <li>Personalised, custom-commissioned, or made-to-order pieces, unless they arrive damaged or materially different from what was agreed.</li>
          <li>Pieces returned outside the 14-day change-of-mind window, used, washed, or without their original tags and packaging.</li>
          <li>Cosmetic variations that are inherent to handmade work — small differences in weave, stitch density, bead placement, grain, or natural-dye tone are part of the piece, not faults.</li>
          <li>Damage caused after delivery (drops, spills, improper care).</li>
          <li>Refusal of a parcel at customs after duties have been correctly invoiced to the buyer.</li>
        </UL>
      </Section>

      <Section id="shipping" title="5. Return shipping">
        <UL>
          <li>If the issue is our fault or the maker's (damaged, faulty, or wrong item), we cover return shipping.</li>
          <li>For change-of-mind returns, the buyer pays return shipping and is responsible for the parcel until it reaches our Nairobi office.</li>
          <li>Do not return anything before contacting us — unannounced returns may be lost in transit and cannot be refunded.</li>
        </UL>
      </Section>

      <Section id="exchanges" title="6. Exchanges and store credit">
        <UL>
          <li>Exchanges are offered where the same maker has a comparable piece in stock; we will quote any difference in price or shipping before proceeding.</li>
          <li>Store credit is offered as an alternative to a cash refund and is valid for 12 months from issue, usable across the full UKEN catalogue.</li>
        </UL>
      </Section>

      <Section id="cancel" title="7. Cancellations before dispatch">
        <P>
          If your order has not yet shipped, call us and we will cancel and
          refund in full. Once a parcel has been handed to the courier the
          standard refund process above applies.
        </P>
      </Section>

      <Section id="questions" title="8. Questions">
        <P>
          Anything unclear? Call the relevant office: Andrew Soi on
          +44 7425 241649 (UK) or Edwin Agasa on +254 720 848 695 (Kenya).
          We would rather hear from you early than have you sit with a piece
          that isn't right.
        </P>
      </Section>
    </LegalShell>
  );
}
