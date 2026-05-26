import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { JoinShell } from "@/components/join/JoinShell";
import { JoinProgress } from "@/components/join/JoinProgress";
import {
  JoinInput,
  JoinTextarea,
  JoinPillSelect,
} from "@/components/join/JoinField";
import { PhotoUploader } from "@/components/join/PhotoUploader";
import { Button, SectionLabel, ConsentCheckbox } from "@/components/ukena";
import { CRAFTS } from "@/components/explore/creators-data";
import { EAC_COUNTRIES } from "@/lib/regions";
import { useSubmitApplication } from "@/lib/queries";

export const Route = createFileRoute("/join/apply")({
  head: () => ({
    meta: [
      { title: "Tell us about you — UKEN" },
      {
        name: "description",
        content:
          "Begin your UKEN application. Four short chapters, no accounts required.",
      },
    ],
  }),
  component: ApplyPage,
});

/* -------------------- Form state -------------------- */

interface ApplicationData {
  fullName: string;
  email: string;
  country: string;
  region: string;
  craft: string;
  intro: string;
  yearsPracticing: string;
  whoTaught: string;
  meaning: string;
  // Split image fields so makers know exactly what each photo is for.
  // `portrait` = one photo of the maker themselves (used as their avatar).
  // `workSamples` = 2-5 photos of finished pieces / work in progress.
  portrait: string[];
  workSamples: string[];
}

const STEP_LABELS = [
  "Tell us about you",
  "Tell us about your craft",
  "Show us your work",
  "Thank you",
] as const;

const initial: ApplicationData = {
  fullName: "",
  email: "",
  country: "",
  region: "",
  craft: "",
  intro: "",
  yearsPracticing: "",
  whoTaught: "",
  meaning: "",
  portrait: [],
  workSamples: [],
};

/** Pull the first integer out of free-text like "thirty-two years" or "12+ yrs". */
function parseYears(input: string): number {
  const m = input.match(/\d+/);
  return m ? Math.min(80, Math.max(0, parseInt(m[0], 10))) : 0;
}

function ApplyPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ApplicationData>(initial);
  const [consent, setConsent] = useState(false);
  const submit = useSubmitApplication();

  const update = <K extends keyof ApplicationData>(
    key: K,
    val: ApplicationData[K],
  ) => setData((d) => ({ ...d, [key]: val }));

  const handleSubmit = async () => {
    try {
      await submit.mutateAsync({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        region: [data.region.trim(), data.country.trim()].filter(Boolean).join(", "),
        craft: data.craft,
        yearsOfPractice: parseYears(data.yearsPracticing),
        story: [data.intro, data.whoTaught, data.meaning]
          .map((s) => s.trim())
          .filter(Boolean)
          .join("\n\n"),
        // Backend still accepts a flat `photos` array. We send portrait
        // first so reviewers immediately see the maker's face, then the
        // finished-work samples in upload order.
        photos: [...data.portrait, ...data.workSamples],
      });
      toast.success("Application received — we'll be in touch within 48 hours.");
      setStep(4);
      if (typeof window !== "undefined")
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "We couldn't send your application. Please try again.";
      toast.error(msg);
    }
  };

  const goNext = () => {
    if (step === 3) {
      void handleSubmit();
      return;
    }
    if (step < 4) setStep((s) => s + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  const canAdvanceStep1 =
    data.fullName.trim() &&
    emailValid &&
    data.country.trim() &&
    data.region.trim() &&
    data.craft &&
    data.intro.trim().length > 10;
  const canAdvanceStep2 =
    data.yearsPracticing.trim() && data.whoTaught.trim() && data.meaning.trim();
  const canAdvanceStep3 =
    data.portrait.length === 1 &&
    data.workSamples.length >= 2 &&
    consent &&
    !submit.isPending;

  return (
    <JoinShell>
      <section className="bg-warm-white">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
          {step < 4 && (
            <>
              <JoinProgress step={step} total={4} labels={STEP_LABELS} />
              <div className="mt-14 md:mt-20">
                {step === 1 && (
                  <Step1
                    data={data}
                    update={update}
                  />
                )}
                {step === 2 && <Step2 data={data} update={update} />}
                {step === 3 && (
                  <Step3
                    data={data}
                    update={update}
                    consent={consent}
                    setConsent={setConsent}
                  />
                )}
              </div>

              <div className="mt-16 flex items-center justify-between border-t border-border/70 pt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-charcoal"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                ) : (
                  <Link
                    to="/join"
                    className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] text-ink-muted transition-colors hover:text-charcoal"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Leave application
                  </Link>
                )}
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={goNext}
                  disabled={
                    (step === 1 && !canAdvanceStep1) ||
                    (step === 2 && !canAdvanceStep2) ||
                    (step === 3 && !canAdvanceStep3)
                  }
                  className="bg-terracotta hover:bg-[oklch(0.52_0.13_38)]"
                >
                  {step === 3 ? (
                    submit.isPending ? (
                      <>
                        Sending…
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Send application
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {step === 4 && <Step4 name={data.fullName} />}
        </div>
      </section>
    </JoinShell>
  );
}

/* -------------------- Step 1 -------------------- */

function Step1({
  data,
  update,
}: {
  data: ApplicationData;
  update: <K extends keyof ApplicationData>(k: K, v: ApplicationData[K]) => void;
}) {
  return (
    <div className="space-y-14">
      <header>
        <SectionLabel>Chapter one</SectionLabel>
        <h1 className="mt-6 font-display text-[40px] leading-[1.05] text-charcoal md:text-[56px]">
          Tell us about <em className="italic text-terracotta">you</em>.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
          Start with the simple things. We don't need a CV — just enough to
          know who's writing to us.
        </p>
      </header>

      <div className="space-y-12">
        <JoinInput
          id="fullName"
          label="What's your full name?"
          placeholder="e.g. Wanjiru Kamau"
          value={data.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          autoComplete="name"
        />
        <JoinInput
          id="email"
          type="email"
          label="What's the best email to reach you on?"
          helper="We'll only use this to reply about your application."
          placeholder="you@example.com"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          autoComplete="email"
        />
        <JoinPillSelect
          label="Which country are you based in?"
          helper="UKEN works across East Africa. Pick yours."
          options={EAC_COUNTRIES}
          value={data.country}
          onChange={(v) => update("country", v)}
        />
        <JoinInput
          id="region"
          label="And where exactly?"
          helper="Town, region, county — however you'd describe home."
          placeholder="e.g. Maragua, Murang'a · Jinja · Arusha"
          value={data.region}
          onChange={(e) => update("region", e.target.value)}
        />
        <JoinPillSelect
          label="What is your craft?"
          helper="Pick the one that feels closest. We'll talk about the rest later."
          options={CRAFTS}
          value={data.craft}
          onChange={(v) => update("craft", v)}
        />
        <JoinTextarea
          id="intro"
          label="Tell us your story in a few sentences."
          helper="Write the way you'd speak to a friend. There's no right answer."
          placeholder="My grandmother taught me to weave when I was seven…"
          rows={5}
          value={data.intro}
          onChange={(e) => update("intro", e.target.value)}
        />
      </div>
    </div>
  );
}

/* -------------------- Step 2 -------------------- */

function Step2({
  data,
  update,
}: {
  data: ApplicationData;
  update: <K extends keyof ApplicationData>(k: K, v: ApplicationData[K]) => void;
}) {
  return (
    <div className="space-y-14">
      <header>
        <SectionLabel>Chapter two</SectionLabel>
        <h1 className="mt-6 font-display text-[40px] leading-[1.05] text-charcoal md:text-[56px]">
          Tell us about your <em className="italic text-terracotta">craft</em>.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
          Three open questions. Take as long as you need with each — these
          become the words on your maker page.
        </p>
      </header>

      <div className="space-y-12">
        <JoinTextarea
          id="years"
          label="How long have you been doing this?"
          helper="Years, decades, since childhood — however you measure it."
          placeholder="I've been weaving for thirty-two years…"
          rows={3}
          value={data.yearsPracticing}
          onChange={(e) => update("yearsPracticing", e.target.value)}
        />
        <JoinTextarea
          id="taught"
          label="Who taught you, or how did you learn?"
          helper="A name, a relationship, a memory. Whatever feels true."
          placeholder="My grandmother sat me down beside her every afternoon…"
          rows={4}
          value={data.whoTaught}
          onChange={(e) => update("whoTaught", e.target.value)}
        />
        <JoinTextarea
          id="meaning"
          label="What does this craft mean to your community?"
          helper="The harder question. Take your time."
          placeholder="In our village, a basket is never just a basket…"
          rows={5}
          value={data.meaning}
          onChange={(e) => update("meaning", e.target.value)}
        />
      </div>
    </div>
  );
}

/* -------------------- Step 3 -------------------- */

function Step3({
  data,
  update,
  consent,
  setConsent,
}: {
  data: ApplicationData;
  update: <K extends keyof ApplicationData>(k: K, v: ApplicationData[K]) => void;
  consent: boolean;
  setConsent: (v: boolean) => void;
}) {
  return (
    <div className="space-y-14">
      <header>
        <SectionLabel>Chapter three</SectionLabel>
        <h1 className="mt-6 font-display text-[40px] leading-[1.05] text-charcoal md:text-[56px]">
          Show us your <em className="italic text-terracotta">work</em>.
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
          A photo of you working, and a few of finished pieces. Phone photos
          are perfectly fine — we'll come and shoot proper ones together once
          you're in.
        </p>
      </header>

      <PhotoUploader
        label="Workshop & work photographs"
        helper="Up to five images. At least one of you at work, the rest your favourite finished pieces. Previews appear instantly — they'll upload in the background."
        value={data.photos}
        onChange={(next) => update("photos", next)}
      />


      <ConsentCheckbox
        checked={consent}
        onChange={setConsent}
        label={
          <>
            I agree to UKEN holding the details and photos I've shared to
            review my application, and — if I'm approved — to feature my
            story and work on UKEN. Handled under our Privacy Notice and
            applicable East African and UK data protection law.
          </>
        }
      />
    </div>
  );
}

/* -------------------- Step 4: confirmation -------------------- */

function Step4({ name }: { name: string }) {
  const firstName = name.trim().split(" ")[0] || "friend";
  return (
    <div className="text-center">
      <span className="inline-grid h-16 w-16 place-items-center rounded-full bg-terracotta-soft/40 text-terracotta">
        <Check className="h-7 w-7" />
      </span>
      <SectionLabel className="mt-10">Application received</SectionLabel>
      <h1 className="mx-auto mt-6 max-w-2xl font-display text-[40px] leading-[1.05] text-charcoal md:text-[60px]">
        Thank you,{" "}
        <em className="italic text-terracotta">{firstName}</em>.
      </h1>
      <p className="mx-auto mt-8 max-w-xl text-[16px] leading-relaxed text-ink-muted md:text-[17px]">
        We'll read what you've written carefully and be in touch within{" "}
        <span className="text-charcoal">48 hours</span> — by phone or WhatsApp,
        whichever you prefer. If we sense a fit, we'll arrange to come and meet
        you in your workshop.
      </p>

      <div className="mx-auto mt-14 max-w-md border-t border-border/70 pt-10">
        <p className="font-display text-[22px] italic leading-snug text-charcoal/85">
          "We don't believe in form-letter rejections. Whatever we decide,
          you'll hear from a real person."
        </p>
        <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-ink-muted">
          Lillian — Maker relations, Nairobi
        </p>
      </div>

      <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.2em] text-clay transition-colors hover:text-clay-deep"
        >
          Meet the makers already in
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          to="/"
          className="text-[13px] font-medium uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-charcoal"
        >
          Back to UKEN
        </Link>
      </div>
    </div>
  );
}
