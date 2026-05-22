import { createFileRoute } from "@tanstack/react-router";
import { LegalShell, Section, P, UL } from "@/components/legal/LegalShell";
import { routeSeo } from "@/lib/seo";

const LAST_UPDATED = "22 May 2026";

const TOC = [
  { id: "acceptance", label: "1. Acceptance" },
  { id: "about", label: "2. About UKEN" },
  { id: "accounts", label: "3. Accounts" },
  { id: "ordering", label: "4. Ordering & payment" },
  { id: "delivery", label: "5. Delivery" },
  { id: "returns", label: "6. Returns & refunds" },
  { id: "artisans", label: "7. For artisans" },
  { id: "ip", label: "8. Intellectual property" },
  { id: "prohibited", label: "9. Prohibited uses" },
  { id: "liability", label: "10. Liability" },
  { id: "law", label: "11. Governing law" },
  { id: "contact", label: "12. Contact for disputes" },
  { id: "changes", label: "13. Changes" },
];

export const Route = createFileRoute("/terms")({
  head: () =>
    routeSeo({
      path: "/terms",
      title: "Terms & Conditions — UKEN",
      description:
        "The terms that govern your use of the UKEN marketplace, including orders, payment, delivery, and dispute resolution.",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Terms", path: "/terms" },
      ],
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalShell
      title="Terms & Conditions"
      lastUpdated={LAST_UPDATED}
      toc={TOC}
      intro="The everyday rules that keep UKEN fair for buyers, makers, and the team in between."
    >
      <Section id="acceptance" title="1. Acceptance">
        <P>
          By browsing, registering on, or buying through ukena.co.uk you agree
          to these Terms &amp; Conditions and to our Privacy Policy. If you do
          not agree, please do not use the site.
        </P>
      </Section>

      <Section id="about" title="2. About UKEN">
        <P>
          UKEN is a curated marketplace that connects Kenyan artisans —
          weavers, beadwork makers, woodcarvers, leather workers and other
          craftspeople — with buyers in the United Kingdom and internationally.
          We list handmade pieces (baskets, jewellery, textiles, accessories,
          home objects and similar items) on behalf of the makers and handle
          ordering, payment, and international shipping.
        </P>
        <P>
          Each piece is made by hand. Small variations in colour, weave, and
          finish are inherent to the work and are not defects.
        </P>
      </Section>

      <Section id="accounts" title="3. Accounts and user responsibilities">
        <UL>
          <li>You must be 18 or over (or have parental consent) to create an account.</li>
          <li>Provide accurate name, email, delivery address and contact details.</li>
          <li>Keep your password confidential — you are responsible for activity on your account.</li>
          <li>Tell us promptly (UK: +44 7425 241649 / Kenya: +254 720 848 695) if you suspect unauthorised use.</li>
          <li>Guest checkout is available for one-off purchases; an account is required for order history and saved items.</li>
        </UL>
      </Section>

      <Section id="ordering" title="4. Ordering, pricing and payment">
        <UL>
          <li>Placing an order is an offer to buy; the contract forms when we confirm acceptance by email.</li>
          <li>Prices are shown in the currency displayed at checkout and include any applicable UK VAT where indicated. International duties and taxes at the destination are the buyer's responsibility unless stated.</li>
          <li>Payment is processed by Stripe on Stripe-hosted pages. We accept the cards and wallets supported by Stripe in your region.</li>
          <li>If a price or stock level is shown in error we may cancel the order before dispatch and refund in full.</li>
          <li>The published creator/UKEN split is 60% to the maker, 40% to UKEN to cover international shipping, customs, payments, the platform and operations.</li>
        </UL>
      </Section>

      <Section id="delivery" title="5. Delivery">
        <UL>
          <li>We ship from our Nairobi office to the destinations listed at checkout. Available zones and shipping fees are shown before payment.</li>
          <li>Typical delivery is 7–21 working days from dispatch for international orders, and 2–7 working days within Kenya, subject to customs.</li>
          <li>Risk in the goods passes on delivery to the address you provide. Please make sure the address and phone number are correct — couriers will use them.</li>
          <li>If a parcel is delayed beyond the stated window we will work with the courier to trace it and keep you updated.</li>
        </UL>
      </Section>

      <Section id="returns" title="6. Returns and refunds">
        <P>
          Returns, refunds, exchanges and store credit are governed by our{" "}
          <a className="underline" href="/refunds">Refund &amp; Returns Policy</a>,
          which forms part of these Terms.
        </P>
      </Section>

      <Section id="artisans" title="7. For artisans / creators">
        <UL>
          <li>By submitting an application you confirm the work is your own or your workshop's, and that you have the right to sell it.</li>
          <li>Approved creators grant UKEN a non-exclusive licence to display their portrait, story, and product imagery on the site and in marketing of the UKEN platform.</li>
          <li>Payouts follow the published split and the schedule shared on acceptance.</li>
        </UL>
      </Section>

      <Section id="ip" title="8. Intellectual property">
        <P>
          The UKEN name, logo, site design, written content, photography and
          curation are owned by UKEN or its licensors and are protected by
          copyright and trade-mark law. Product designs and creator stories
          remain the property of the individual makers. You may not copy,
          reproduce, or republish any of this material without written
          permission, except for personal, non-commercial browsing.
        </P>
      </Section>

      <Section id="prohibited" title="9. Prohibited uses">
        <UL>
          <li>No fraudulent orders, chargeback abuse, or use of stolen payment instruments.</li>
          <li>No scraping, reselling our listings, or copying creator imagery for commercial use.</li>
          <li>No attempts to break, probe, or overload the site or its security.</li>
          <li>No harassment of creators, staff, or other users through any UKEN channel.</li>
          <li>No use of the platform for any unlawful purpose under Kenyan or UK law.</li>
        </UL>
      </Section>

      <Section id="liability" title="10. Limitation of liability">
        <P>
          To the fullest extent permitted by law, UKEN's total liability for
          any claim arising from your use of the site or from an order is
          limited to the amount you paid for the order in question. We do not
          exclude liability for death, personal injury caused by our
          negligence, fraud, or any other liability that cannot be excluded
          by law. Nothing in these Terms affects your statutory consumer
          rights.
        </P>
      </Section>

      <Section id="law" title="11. Governing law and disputes">
        <P>
          These Terms are governed by the laws of Kenya. Disputes will be
          handled in good faith; unresolved disputes are subject to the
          non-exclusive jurisdiction of the courts of Nairobi, Kenya.
          UK-based buyers retain any non-waivable consumer rights under UK law.
        </P>
      </Section>

      <Section id="contact" title="12. Contact for disputes">
        <P>Please raise any dispute first with us so we can try to resolve it quickly:</P>
        <UL>
          <li>UK Head Office: Osmaston 10, NG7 1SD, Nottingham — Andrew Soi, +44 7425 241649</li>
          <li>Nairobi Office: Nairobi Garage, Karen — Watermark Business Park, Ndege Rd, Off Langata Rd — Edwin Agasa, +254 720 848 695</li>
        </UL>
      </Section>

      <Section id="changes" title="13. Changes">
        <P>
          We may update these Terms. The "last updated" date above always
          reflects the current version; continued use of the site after a
          change means you accept the new Terms.
        </P>
      </Section>
    </LegalShell>
  );
}
