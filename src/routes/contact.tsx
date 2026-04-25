import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { Button, Card, SectionLabel } from "@/components/ukena";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ukena" },
      {
        name: "description",
        content:
          "Find Ukena in Nottingham and Nairobi, or contact the team for buyer, producer, press, and general enquiries.",
      },
      { property: "og:title", content: "Contact — Ukena" },
      {
        property: "og:description",
        content:
          "Find Ukena in Nottingham and Nairobi, or contact the team for buyer, producer, press, and general enquiries.",
      },
    ],
  }),
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <section className="max-w-3xl">
          <SectionLabel tone="terracotta">Contact</SectionLabel>
          <h1 className="mt-4 font-display text-4xl leading-tight text-charcoal md:text-6xl">
            Find Us
          </h1>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <Card tone="cream" elevation="soft" className="p-7 md:p-8">
              <h2 className="font-display text-3xl leading-tight text-charcoal">Head Office (UK)</h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                Osmaston 10, NG7 1SD<br />
                Nottingham, United Kingdom<br />
                Andrew Soi: +44 7425 241649
              </p>
            </Card>

            <Card tone="cream" elevation="soft" className="p-7 md:p-8">
              <h2 className="font-display text-3xl leading-tight text-charcoal">Nairobi Office</h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                Nairobi Garage – Karen<br />
                Cove Court, Watermark Business Park<br />
                Ndege Rd. Off Langata Rd., Nairobi<br />
                Edwin Agasa: +254 720 848 695
              </p>
            </Card>

            <p className="text-base leading-relaxed text-ink-muted">
              <span className="font-medium text-charcoal">General enquiries:</span> hello@ukena.co.uk
            </p>
          </div>

          <Card tone="warm-white" elevation="lift" className="p-7 md:p-9">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 md:grid-cols-2">
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
                  className="min-h-[160px] bg-cream/30"
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>

              {submitted && (
                <p className="rounded-xl bg-cream px-4 py-3 text-sm leading-relaxed text-ink-muted">
                  Thank you. Your message is ready for the Ukena team.
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
