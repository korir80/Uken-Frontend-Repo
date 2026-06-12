import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/services/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — UKEN" },
      { name: "description", content: "Reset your UKEN account password." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

type Step = "request" | "otp" | "reset";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) return setError("Email is required");
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      toast.success("If that email exists, we've sent an OTP.");
      setStep("otp");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send OTP");
    } finally {
      setSubmitting(false);
    }
  }

  function handleOtpContinue(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit code");
    setStep("reset");
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) return setError("Password must be at least 8 characters");
    if (newPassword.length > 72) return setError("Password must be 72 characters or fewer");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token: otp, newPassword });
      toast.success("Password updated successfully");
      navigate({ to: "/signin" });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message || "Invalid or expired OTP"
          : "Could not reset password";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-white px-6 py-16">
      <section className="w-full max-w-md rounded-3xl bg-cream/60 p-8 shadow-soft md:p-10">
        <Link to="/" className="font-display text-2xl tracking-tight text-charcoal">
          UKEN
        </Link>

        {step === "request" && (
          <>
            <p className="section-label mt-6">Reset password</p>
            <h1 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
              Forgot your password?
            </h1>
            <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">
              Enter your email and we'll send you a 6-digit code to reset it.
            </p>
            <form onSubmit={handleRequest} className="mt-8 space-y-5" noValidate>
              <label className="block">
                <span className="block font-sans text-[13px] font-medium text-charcoal">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                  autoComplete="email"
                  required
                />
              </label>
              {error && <p className="font-sans text-[13px] text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 font-sans text-sm font-medium text-warm-white transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {submitting ? "Sending…" : "Send code"}
              </button>
            </form>
            <p className="mt-6 text-center font-sans text-[13px] text-charcoal/70">
              Remembered it?{" "}
              <Link to="/signin" className="font-medium text-clay underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep("request");
              }}
              className="mt-6 inline-flex items-center gap-1 font-sans text-[12px] text-charcoal/60 hover:text-charcoal"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
            <p className="section-label mt-4">Step 2 of 3</p>
            <h1 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
              Enter the code
            </h1>
            <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">
              We sent a 6-digit code to <span className="font-medium text-charcoal">{email}</span>.
              It expires in 10 minutes.
            </p>
            <form onSubmit={handleOtpContinue} className="mt-8 space-y-5" noValidate>
              <label className="block">
                <span className="block font-sans text-[13px] font-medium text-charcoal">
                  6-digit code
                </span>
                <input
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                  className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 text-center font-mono text-xl tracking-[0.5em] text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                  autoComplete="one-time-code"
                  required
                />
              </label>
              {error && <p className="font-sans text-[13px] text-destructive">{error}</p>}
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 font-sans text-sm font-medium text-warm-white transition-colors hover:bg-clay-deep"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep("otp");
              }}
              className="mt-6 inline-flex items-center gap-1 font-sans text-[12px] text-charcoal/60 hover:text-charcoal"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>
            <p className="section-label mt-4">Step 3 of 3</p>
            <h1 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
              Set a new password
            </h1>
            <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">
              Must be at least 8 characters.
            </p>
            <form onSubmit={handleReset} className="mt-8 space-y-5" noValidate>
              <label className="block">
                <span className="block font-sans text-[13px] font-medium text-charcoal">
                  New password
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  required
                />
              </label>
              <label className="block">
                <span className="block font-sans text-[13px] font-medium text-charcoal">
                  Confirm new password
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-warm-white px-4 py-3 font-sans text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/15"
                  autoComplete="new-password"
                  required
                />
              </label>
              {error && <p className="font-sans text-[13px] text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-6 py-3 font-sans text-sm font-medium text-warm-white transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {submitting ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
