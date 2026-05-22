import { createFileRoute } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import { routeSeo } from "@/lib/seo";

const LAST_UPDATED = "22 May 2026";

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

function TermsPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <SectionLabel tone="terracotta">Legal</SectionLabel>
        <h1 className="mt-3 font-display text-[34px] leading-tight text-charcoal md:text-[48px]">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-ink-muted">
          Last updated: {LAST_UPDATED}
        </p>

        <H2>1. Acceptance</H2>
        <P>
          By browsing, registering on, or buying through ukena.co.uk you agree
          to these Terms &amp; Conditions and to our Privacy Policy. If you do
          not agree, please do not use the site.
        </P>

        <H2>2. About UKEN</H2>
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

        <H2>3. Accounts and user responsibilities</H2>
        <UL>
          <li>You must be 18 or over (or have parental consent) to create an account.</li>
          <li>Provide accurate name, email, delivery address and contact details.</li>
          <li>Keep your password confidential — you are responsible for activity on your account.</li>
          <li>Tell us promptly (UK: +44 7425 241649 / Kenya: +254 720 848 695) if you suspect unauthorised use.</li>
          <li>Guest checkout is available for one-off purchases; an account is required for order history and saved items.</li>
        </UL>

        <H2>4. Ordering, pricing and payment</H2>
        <UL>
          <li>Placing an order is an offer to buy; the contract forms when we confirm acceptance by email.</li>
          <li>Prices are shown in the currency displayed at checkout and include any applicable UK VAT where indicated. International duties and taxes at the destination are the buyer's responsibility unless stated.</li>
          <li>Payment is processed by Stripe on Stripe-hosted pages. We accept the cards and wallets supported by Stripe in your region.</li>
          <li>If a price or stock level is shown in error we may cancel the order before dispatch and refund in full.</li>
          <li>The published creator/UKEN split is 60% to the maker, 40% to UKEN to cover international shipping, customs, payments, the platform and operations.</li>
        </UL>

        <H2>5. Delivery</H2>
        <UL>
          <li>We ship from our Nairobi office to the destinations listed at checkout. Available zones and shipping fees are shown before payment.</li>
          <li>Typical delivery is 7–21 working days from dispatch for international orders, and 2–7 working days within Kenya, subject to customs.</li>
          <li>Risk in the goods passes on delivery to the address you provide. Please make sure the address and phone number are correct — couriers will use them.</li>
          <li>If a parcel is delayed beyond the stated window we will work with the courier to trace it and keep you updated.</li>
        </UL>

        <H2>6. Returns and refunds</H2>
        <P>
          Returns, refunds, exchanges and store credit are governed by our{" "}
          <a className="underline" href="/refunds">Refund &amp; Returns Policy</a>,
          which forms part of these Terms.
        </P>

        <H2>7. For artisans / creators</H2>
        <UL>
          <li>By submitting an application you confirm the work is your own or your workshop's, and that you have the right to sell it.</li>
          <li>Approved creators grant UKEN a non-exclusive licence to display their portrait, story, and product imagery on the site and in marketing of the UKEN platform.</li>
          <li>Payouts follow the published split and the schedule shared on acceptance.</li>
        </UL>

        <H2>8. Intellectual property</H2>
        <P>
          The UKEN name, logo, site design, written content, photography and
          curation are owned by UKEN or its licensors and are protected by
          copyright and trade-mark law. Product designs and creator stories
          remain the property of the individual makers. You may not copy,
          reproduce, or republish any of this material without written
          permission, except for personal, non-commercial browsing.
        </P>

        <H2>9. Prohibited uses</H2>
        <UL>
          <li>No fraudulent orders, chargeback abuse, or use of stolen payment instruments.</li>
          <li>No scraping, reselling our listings, or copying creator imagery for commercial use.</li>
          <li>No attempts to break, probe, or overload the site or its security.</li>
          <li>No harassment of creators, staff, or other users through any UKEN channel.</li>
          <li>No use of the platform for any unlawful purpose under Kenyan or UK law.</li>
        </UL>

        <H2>10. Limitation of liability</H2>
        <P>
          To the fullest extent permitted by law, UKEN's total liability for
          any claim arising from your use of the site or from an order is
          limited to the amount you paid for the order in question. We do not
          exclude liability for death, personal injury caused by our
          negligence, fraud, or any other liability that cannot be excluded
          by law. Nothing in these Terms affects your statutory consumer
          rights.
        </P>

        <H2>11. Governing law and disputes</H2>
        <P>
          These Terms are governed by the laws of Kenya. Disputes will be
          handled in good faith; unresolved disputes are subject to the
          non-exclusive jurisdiction of the courts of Nairobi, Kenya.
          UK-based buyers retain any non-waivable consumer rights under UK law.
        </P>

        <H2>12. Contact for disputes</H2>
        <P>
          Please raise any dispute first with us so we can try to resolve it
          quickly:
        </P>
        <UL>
          
          <li>UK Head Office: Osmaston 10, NG7 1SD, Nottingham — Andrew Soi, +44 7425 241649</li>
          <li>Nairobi Office: 8th Floor, Pinetree Plaza, Kaburu Drive, Off Ngong Road — Edwin Agasa, +254 720 848 695</li>
        </UL>

        <H2>13. Changes</H2>
        <P>
          We may update these Terms. The "last updated" date above always
          reflects the current version; continued use of the site after a
          change means you accept the new Terms.
        </P>
      </main>
      <Footer />
    </div>
  );
}
