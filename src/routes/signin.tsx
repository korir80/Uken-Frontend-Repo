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
        content: "Sign in to your UKEN account.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignInPage,
});

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
    if (!password) return setPasswordError("Password is required");
    setSubmitting(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}`);
      navigate({ to: defaultPathForRole(user.role) });
    } catch (err) {
      handleApiError(err, {
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
      <section className="w-full max-w-md rounded-3xl bg-cream/60 p-8 shadow-soft md:p-10">
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
          Sign in to your account.
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
              placeholder="Email address"
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
              placeholder="Password"
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

        <p className="mt-4 text-center font-sans text-[13px]">
          <Link
            to="/forgot-password"
            className="text-charcoal/70 underline-offset-4 hover:text-clay hover:underline"
          >
            Forgot your password?
          </Link>
        </p>

        <p className="mt-6 text-center font-sans text-[13px] text-charcoal/70">
          New to UKEN?{" "}
          <Link
            to="/signup"
            className="font-medium text-clay underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
