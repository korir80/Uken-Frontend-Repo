import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth, defaultPathForRole } from "@/lib/auth";
import { handleApiError } from "@/lib/handleApiError";
import { ConsentCheckbox } from "@/components/ukena";

type SignupRole = "ROLE_BUYER" | "ROLE_CREATOR";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — UKEN" },
      {
        name: "description",
        content:
          "Join UKEN to save makers, track orders, and discover traceable Kenyan coffee, tea, foods, textiles, craft, and more.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignUpPage,
});

const ROLE_OPTIONS: {
  value: SignupRole;
  label: string;
  hint: string;
}[] = [
  {
    value: "ROLE_BUYER",
    label: "I'm a buyer",
    hint: "Save makers, track orders, build a collection.",
  },
  {
    value: "ROLE_CREATOR",
    label: "I'm a maker",
    hint: "List your pieces and tell your story to the world.",
  },
];

function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<SignupRole>("ROLE_BUYER");
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);

  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmError(null);
    setConsentError(null);
    setFormError(null);

    if (!fullName.trim()) return setFullNameError("Your name is required");
    if (!email.trim()) return setEmailError("Email is required");
    if (password.length < 6)
      return setPasswordError("Password must be at least 6 characters");
    if (password !== confirm) return setConfirmError("Passwords don't match");
    if (!consent)
      return setConsentError("Please tick the box so we can create your account.");

    // Creator signup currently goes through the application flow; redirect them.
    if (role === "ROLE_CREATOR") {
      toast.message("Makers join through an application", {
        description: "We'll take you to the maker application now.",
      });
      navigate({ to: "/join/apply" });
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(email.trim(), password, fullName.trim());
      toast.success(`Welcome to UKEN, ${user.fullName.split(" ")[0]}`);
      navigate({ to: defaultPathForRole(user.role) });
    } catch (err) {
      handleApiError(err, {
        // Duplicate email → inline under email field.
        overrides: {
          409: () => {
            setEmailError("Email already registered");
            return true;
          },
        },
        onFieldErrors: ({ fields, general }) => {
          if (fields.fullName?.[0]) setFullNameError(fields.fullName[0]);
          if (fields.email?.[0]) setEmailError(fields.email[0]);
          if (fields.password?.[0]) setPasswordError(fields.password[0]);
          if (general[0]) setFormError(general[0]);
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-white px-6 py-16">
      <div className="grid w-full max-w-5xl gap-12 md:grid-cols-2 md:items-start">
        {/* Form */}
        <section className="rounded-3xl bg-cream/60 p-8 shadow-soft md:p-10">
          <Link
            to="/"
            className="font-display text-2xl tracking-tight text-charcoal"
          >
            UKEN
          </Link>
          <p className="section-label mt-6">Create account</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
            Begin your UKEN.
          </h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">
            One account to follow makers, track products on their journey, and
            keep a record of what you've brought home.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            {/* Role chooser */}
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((opt) => {
                const active = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={
                      "rounded-xl border px-4 py-3 text-left transition " +
                      (active
                        ? "border-clay bg-clay/5 text-charcoal"
                        : "border-border bg-warm-white text-charcoal/70 hover:border-clay/60")
                    }
                  >
                    <span className="block font-sans text-[13px] font-medium">
                      {opt.label}
                    </span>
                    <span className="mt-1 block font-sans text-[11px] leading-snug text-charcoal/60">
                      {opt.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="block">
              <span className="block font-sans text-[13px] font-medium text-charcoal">
                Full name
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Anya Patel"
                className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                autoComplete="name"
                aria-invalid={!!fullNameError}
                required
              />
              {fullNameError && (
                <p className="mt-1.5 font-sans text-[12px] text-destructive">{fullNameError}</p>
              )}
            </label>
            <label className="block">
              <span className="block font-sans text-[13px] font-medium text-charcoal">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.co.uk"
                className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                autoComplete="email"
                aria-invalid={!!emailError}
                required
              />
              {emailError && (
                <p className="mt-1.5 font-sans text-[12px] text-destructive">{emailError}</p>
              )}
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="block font-sans text-[13px] font-medium text-charcoal">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                  autoComplete="new-password"
                  aria-invalid={!!passwordError}
                  required
                  minLength={6}
                />
                {passwordError && (
                  <p className="mt-1.5 font-sans text-[12px] text-destructive">{passwordError}</p>
                )}
              </label>
              <label className="block">
                <span className="block font-sans text-[13px] font-medium text-charcoal">
                  Confirm
                </span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                  autoComplete="new-password"
                  aria-invalid={!!confirmError}
                  required
                  minLength={6}
                />
                {confirmError && (
                  <p className="mt-1.5 font-sans text-[12px] text-destructive">{confirmError}</p>
                )}
              </label>
            </div>

            <ConsentCheckbox
              checked={consent}
              onChange={setConsent}
              error={consentError}
              label={
                <>
                  I agree to UKEN keeping my name, email and account activity
                  to run my account, in line with the Kenya Data Protection
                  Act (2019) and our Privacy Notice.
                </>
              }
            />

            {formError && (
              <p className="font-sans text-[13px] text-destructive">{formError}</p>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 font-sans text-sm font-medium text-warm-white transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {submitting
                ? "Creating account…"
                : role === "ROLE_CREATOR"
                  ? "Continue to maker application"
                  : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-[13px] text-charcoal/70">
            Already with us?{" "}
            <Link
              to="/signin"
              className="font-medium text-clay underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </section>

        {/* Right column — value props */}
        <section className="md:pt-10">
          <p className="section-label">Why join</p>
          <h2 className="mt-3 font-display text-2xl text-charcoal">
            More than a checkout.
          </h2>
          <ul className="mt-6 space-y-5 font-sans text-[14px] leading-relaxed text-charcoal/75">
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
              <span>
                <strong className="text-charcoal">Follow makers.</strong> Be
                first to see new products from your favourite Kenyan sources.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
              <span>
                <strong className="text-charcoal">Track every product.</strong>{" "}
                Watch your order travel from Kenya to your door.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
              <span>
                <strong className="text-charcoal">Build a collection.</strong>{" "}
                Save pieces for later and revisit makers you love.
              </span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
