import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth, defaultPathForRole } from "@/lib/auth";
import { handleApiError } from "@/lib/handleApiError";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — UKEN" },
      {
        name: "description",
        content:
          "Sign in to your UKEN account. While the backend is in development, mock emails route you to the right dashboard.",
      },
    ],
  }),
  component: SignInPage,
});

const ROLE_HINTS: { label: string; email: string; tagline: string }[] = [
  {
    label: "Buyer",
    email: "anya@buyer.ukena",
    tagline: "Saved makers, recently viewed pieces, your bag.",
  },
  {
    label: "Creator",
    email: "wanjiru@creator.ukena",
    tagline: "Manage your pieces, see new orders, edit your story.",
  },
  {
    label: "Admin",
    email: "review@admin.ukena",
    tagline: "Moderate applications, oversee orders, curate the home.",
  },
];

function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);
    if (!email.trim()) return setEmailError("Email is required");
    if (!password.trim()) return setPasswordError("Password is required");
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}`);
      navigate({ to: defaultPathForRole(user.role) });
    } catch (err) {
      handleApiError(err, {
        // Wrong credentials → inline under password, no toast, no redirect.
        overrides: {
          401: () => {
            setPasswordError("Invalid email or password");
            return true;
          },
        },
        onFieldErrors: ({ fields, general }) => {
          if (fields.email?.[0]) setEmailError(fields.email[0]);
          if (fields.password?.[0]) setPasswordError(fields.password[0]);
          if (general[0] && !fields.email && !fields.password) {
            setFormError(general[0]);
          }
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
          <p className="section-label mt-6">Sign in</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
            Welcome back.
          </h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">
            Enter any email below — your role is inferred from the address while
            our backend is in development.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <label className="block">
              <span className="block font-sans text-[13px] font-medium text-charcoal">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@buyer.ukena"
                className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                autoComplete="email"
                aria-invalid={!!emailError}
                required
              />
              {emailError && (
                <p className="mt-1.5 font-sans text-[12px] text-destructive">{emailError}</p>
              )}
            </label>
            <label className="block">
              <span className="block font-sans text-[13px] font-medium text-charcoal">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="any non-empty value"
                className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                autoComplete="current-password"
                aria-invalid={!!passwordError}
                required
              />
              {passwordError && (
                <p className="mt-1.5 font-sans text-[12px] text-destructive">{passwordError}</p>
              )}
            </label>

            {formError && (
              <p className="font-sans text-[13px] text-destructive">{formError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 font-sans text-sm font-medium text-warm-white transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-[13px] text-charcoal/70">
            New to UKEN?{" "}
            <Link
              to="/signup"
              className="font-medium text-clay underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
          <p className="mt-3 text-center font-sans text-[12px] text-charcoal/50">
            Real accounts arrive when the Spring Boot backend is connected.
          </p>
        </section>

        {/* Role hints */}
        <section>
          <p className="section-label">Demo accounts</p>
          <h2 className="mt-3 font-display text-2xl text-charcoal">
            Try each side of UKEN.
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">
            Click any card below to fill the form. The email's domain determines
            the role and the dashboard you land on.
          </p>

          <div className="mt-6 space-y-4">
            {ROLE_HINTS.map((hint) => (
              <button
                key={hint.label}
                type="button"
                onClick={() => {
                  setEmail(hint.email);
                  setPassword("demo");
                }}
                className="block w-full rounded-2xl border border-border bg-warm-white p-5 text-left transition hover:border-clay hover:shadow-soft"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-lg text-charcoal">
                    {hint.label}
                  </span>
                  <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-clay">
                    {hint.email.split("@")[1]}
                  </span>
                </div>
                <p className="mt-1 font-sans text-[13px] text-charcoal/70">
                  {hint.tagline}
                </p>
                <code className="mt-3 inline-block font-sans text-[12px] text-charcoal/60">
                  {hint.email}
                </code>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
