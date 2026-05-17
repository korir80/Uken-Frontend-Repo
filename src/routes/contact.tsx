import { routeSeo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Button, Card, SectionLabel } from "@/components/ukena";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => {
    const seo = routeSeo({
      path: "/contact",
      title: "Contact UKEN — Nottingham and Nairobi",
      description:
        "Find UKEN in Nottingham and Nairobi, or contact the team for buyer, producer, press, and general enquiries.",
      breadcrumbs: [
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ],
    });
    return {
      ...seo,
      scripts: [
        ...seo.scripts,
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "UKEN",
            url: "https://ukena.co.uk",
            email: "hello@ukena.co.uk",
            location: [
              {
                "@type": "Place",
                name: "UKEN — UK Head Office",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Osmaston 10",
                  postalCode: "NG7 1SD",
                  addressLocality: "Nottingham",
                  addressCountry: "GB",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  name: "Andrew Soi",
                  telephone: "+44 7425 241649",
                },
              },
              {
                "@type": "Place",
                name: "UKEN — Nairobi Office",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "8th Floor, Pinetree Plaza, Kaburu Drive, Off Ngong Road",
                  addressLocality: "Nairobi",
                  addressCountry: "KE",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer service",
                  name: "Edwin Agasa",
                  telephone: "+254 720 848 695",
                },
              },
            ],
          }),
        },
      ],
    };
  },
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email must be less than 255 characters"),
  role: z.enum(["UK Buyer", "Kenyan Producer", "Press", "Other"]),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

type ContactFormState = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactFormState, string>>;

const initialForm: ContactFormState = {
  name: "",
  email: "",
  role: "UK Buyer",
  message: "",
};

function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: ContactErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof ContactFormState;
        nextErrors[field] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <section className="max-w-3xl">
          <SectionLabel tone="terracotta">Contact</SectionLabel>
          <h1 className="mt-3 font-display text-[32px] leading-tight text-charcoal md:text-[46px]">
            Find Us
          </h1>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <Card tone="cream" elevation="soft" className="p-5 md:p-6">
              <h2 className="font-display text-[26px] leading-tight text-charcoal md:text-[30px]">Head Office (UK)</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                Osmaston 10, NG7 1SD<br />
                Nottingham, United Kingdom<br />
                Andrew Soi: +44 7425 241649
              </p>
            </Card>

            <Card tone="cream" elevation="soft" className="p-5 md:p-6">
              <h2 className="font-display text-[26px] leading-tight text-charcoal md:text-[30px]">Nairobi Office</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                8th Floor, Pinetree Plaza<br />
                Kaburu Drive, Off Ngong Road<br />
                Nairobi, Kenya<br />
                Edwin Agasa: +254 720 848 695
              </p>
            </Card>

            <p className="text-base leading-relaxed text-ink-muted">
              <span className="font-medium text-charcoal">General enquiries:</span> hello@ukena.co.uk
            </p>
          </div>

          <Card tone="warm-white" elevation="lift" className="p-5 md:p-7">
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className="h-11 bg-cream/30"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className="h-11 bg-cream/30"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a:</Label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(event) => updateField("role", event.target.value as ContactFormState["role"])}
                  className="flex h-11 w-full rounded-md border border-input bg-cream/30 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option>UK Buyer</option>
                  <option>Kenyan Producer</option>
                  <option>Press</option>
                  <option>Other</option>
                </select>
                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  className="min-h-[120px] bg-cream/30"
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>

              {submitted && (
                <p className="rounded-xl bg-cream px-4 py-3 text-sm leading-relaxed text-ink-muted">
                  Thank you. Your message is ready for the UKEN team.
                </p>
              )}

              <Button type="submit" className="w-full sm:w-auto">
                Send message
              </Button>
            </form>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
