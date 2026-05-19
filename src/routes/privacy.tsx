import { createFileRoute } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel } from "@/components/ukena";
import { routeSeo } from "@/lib/seo";

const LAST_UPDATED = "19 May 2026";

export const Route = createFileRoute("/privacy")({
  head: () =>
    routeSeo({
      path: "/privacy",
      title: "Privacy Policy — UKEN",
      description:
        "How UKEN collects, uses, and safeguards your personal data, in line with Kenya's Data Protection Act, 2019.",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Privacy", path: "/privacy" },
      ],
    }),
  component: PrivacyPage,
});

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 font-display text-[24px] leading-tight text-charcoal md:text-[30px]">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 font-display text-[18px] leading-tight text-charcoal md:text-[20px]">
      {children}
    </h3>
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

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <SectionLabel tone="terracotta">Legal</SectionLabel>
        <h1 className="mt-3 font-display text-[34px] leading-tight text-charcoal md:text-[48px]">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-ink-muted">
          Last updated: {LAST_UPDATED}
        </p>

        <H2>1. Who we are</H2>
        <P>
          UKEN ("UKEN", "we", "us", "our") is a marketplace connecting Kenyan
          artisans with buyers in the United Kingdom and beyond. We operate
          from Osmaston 10, NG7 1SD, Nottingham, United Kingdom, and from the
          8th Floor, Pinetree Plaza, Kaburu Drive, Off Ngong Road, Nairobi,
          Kenya. This Privacy Policy explains how we collect, use, share, and
          protect personal data when you use{" "}
          <a className="underline" href="https://ukena.co.uk">ukena.co.uk</a>{" "}
          and related services.
        </P>
        <P>
          For any privacy-related question, request, or complaint, contact our
          data team by phone on +44 7425 241649 (UK) or +254 720 848 695 (Kenya).
        </P>

        <H2>2. Personal data we collect</H2>
        <P>
          We only collect what we need to run the marketplace. The forms on
          this site collect the following data:
        </P>
        <H3>Account registration (Sign up / Sign in)</H3>
        <UL>
          <li>Full name</li>
          <li>Email address</li>
          <li>Password (stored hashed; never visible to us)</li>
        </UL>
        <H3>Checkout &amp; delivery</H3>
        <UL>
          <li>Full name, email, phone number</li>
          <li>Delivery address (lines, city, country, postal code)</li>
          <li>Order contents and order history</li>
          <li>
            Payment is processed by Stripe on Stripe-hosted pages — we do not
            see or store your card number, CVC, or full card details.
          </li>
        </UL>
        <H3>Contact form</H3>
        <UL>
          <li>Name, email, role (UK Buyer, Kenyan Producer, Press, Other) and message</li>
        </UL>
        <H3>Newsletter</H3>
        <UL>
          <li>Email address (only used to send the monthly letter)</li>
        </UL>
        <H3>Artisan / Creator application</H3>
        <UL>
          <li>Full name, email, craft details, and uploaded workshop photos</li>
        </UL>
        <H3>Creator profile (for approved makers)</H3>
        <UL>
          <li>Portrait and workshop images, biography, story, product listings, payout details</li>
        </UL>
        <H3>Automatic data</H3>
        <UL>
          <li>Device, browser, IP address, pages viewed, and referrer (via server logs and analytics)</li>
          <li>Cart contents stored locally in your browser so your bag survives a refresh</li>
        </UL>

        <H2>3. Why we collect it and the legal basis</H2>
        <UL>
          <li>
            <strong>To create and manage your account</strong> — performance
            of a contract with you.
          </li>
          <li>
            <strong>To process orders, payments, and delivery</strong> —
            performance of a contract; legal obligation (tax, accounting).
          </li>
          <li>
            <strong>To reply to enquiries through the contact form</strong> —
            legitimate interest in responding to messages addressed to us.
          </li>
          <li>
            <strong>To send the newsletter</strong> — your consent, which you
            can withdraw at any time using the unsubscribe link or by emailing
            us.
          </li>
          <li>
            <strong>To assess artisan applications and host creator profiles</strong>{" "}
            — performance of a contract and legitimate interest in maintaining
            a curated marketplace.
          </li>
          <li>
            <strong>To detect fraud, secure the platform, and meet legal duties</strong>{" "}
            — legitimate interest and legal obligation.
          </li>
          <li>
            <strong>To improve the site through aggregated analytics</strong> —
            legitimate interest, balanced against your right to object.
          </li>
        </UL>

        <H2>4. Who we share data with</H2>
        <P>
          We never sell your data. We share it only with the service providers
          we rely on to operate UKEN:
        </P>
        <UL>
          <li>
            <strong>Stripe</strong> — payment processing. Card data is
            collected directly by Stripe on their hosted checkout.
          </li>
          <li>
            <strong>Cloudinary</strong> — hosting and delivery of images
            uploaded by creators (portraits, workshop photos, product shots).
          </li>
          <li>
            <strong>Hosting and infrastructure providers</strong> — to serve
            the website and store the database.
          </li>
          <li>
            <strong>Couriers and logistics partners</strong> — to deliver your
            order; they receive your name, address, phone, and email.
          </li>
          <li>
            <strong>Approved creators</strong> — receive the first name and
            delivery town of buyers of their pieces for fulfilment context.
          </li>
          <li>
            <strong>Authorities</strong> — where required by Kenyan, UK, or
            other applicable law.
          </li>
        </UL>

        <H2>5. Cookies and similar technologies</H2>
        <P>We use the following categories of cookies and local storage:</P>
        <UL>
          <li>
            <strong>Strictly necessary</strong> — authentication token
            (<code>ukena_token</code>), CSRF protection, and the shopping cart.
            The site cannot work without these.
          </li>
          <li>
            <strong>Functional</strong> — remembering your delivery details
            between checkout steps, preferred currency, and recently viewed items.
          </li>
          <li>
            <strong>Analytics</strong> — anonymised page-view and performance
            data so we can see which pages help buyers find makers. Set only
            with your consent where required.
          </li>
          <li>
            <strong>Marketing</strong> — not currently used on this site. If we
            introduce them, we will update this policy and request consent first.
          </li>
        </UL>

        <H2>6. How long we keep data</H2>
        <UL>
          <li>Account data — for as long as your account is open, plus 12 months.</li>
          <li>Order, payment, and tax records — 7 years, to meet tax law.</li>
          <li>Contact form messages — up to 24 months after the last reply.</li>
          <li>Newsletter subscriptions — until you unsubscribe.</li>
          <li>Creator applications and profiles — for the lifetime of the relationship, plus 24 months.</li>
          <li>Server and security logs — up to 12 months.</li>
        </UL>

        <H2>7. Your rights under the Kenya Data Protection Act, 2019</H2>
        <P>As a data subject, you have the right to:</P>
        <UL>
          <li>Be informed of the use to which your personal data is being put;</li>
          <li>Access your personal data held by us;</li>
          <li>Object to the processing of all or part of your personal data;</li>
          <li>Correct false or misleading data;</li>
          <li>Have false or misleading data deleted;</li>
          <li>Request that your data be transferred to you or another controller (data portability).</li>
        </UL>
        <P>
          To exercise any of these rights, call Andrew Soi on +44 7425 241649
          (UK) or Edwin Agasa on +254 720 848 695 (Kenya) and quote "Data
          request". We will respond within 30 days. If you are not satisfied,
          you may lodge a complaint with the Office of the Data Protection
          Commissioner (ODPC), Kenya, at{" "}
          <a className="underline" href="https://www.odpc.go.ke">www.odpc.go.ke</a>.
        </P>

        <H2>8. Registration with the ODPC</H2>
        <P>
          UKEN is in the process of registering as a Data Controller and Data
          Processor with the Office of the Data Protection Commissioner of
          Kenya, in line with the Data Protection Act, 2019 and the Data
          Protection (Registration of Data Controllers and Data Processors)
          Regulations, 2021.
        </P>

        <H2>9. International transfers</H2>
        <P>
          Because UKEN operates between Kenya and the United Kingdom, your
          data may be transferred between the two jurisdictions and to the
          service providers listed above. We rely on adequacy decisions,
          standard contractual clauses, or your explicit consent for such
          transfers, as required by Kenyan law.
        </P>

        <H2>10. Security</H2>
        <P>
          We use HTTPS, hashed passwords, access controls, and reputable
          infrastructure providers to protect your data. No method is ever
          100% secure — if a breach affects your data, we will notify the
          ODPC and you in line with the law.
        </P>

        <H2>11. Changes to this policy</H2>
        <P>
          We may update this Privacy Policy from time to time. The "last
          updated" date above will always reflect the current version.
        </P>
      </main>
      <Footer />
    </div>
  );
}
