import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useAuth, defaultPathForRole } from "@/lib/auth";
import type { UserRole } from "@/services";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — Ukena" },
      {
        name: "description",
        content:
          "Join Ukena to save makers, track orders and discover handcrafted pieces from Kenyan artisans.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignUpPage,
});

const ROLE_OPTIONS: {
  value: UserRole;
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
  const [role, setRole] = useState<UserRole>("ROLE_BUYER");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) return setError("Your name is required");
    if (!email.trim()) return setError("Email is required");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirm)
      return setError("Passwords don't match");

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
      const user = await register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        role,
      });
      toast.success(`Welcome to Ukena, ${user.fullName.split(" ")[0]}`);
      navigate({ to: defaultPathForRole(user.role) });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-up failed";
      setError(msg);
      toast.error(msg);
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
            Ukena
          </Link>
          <p className="section-label mt-6">Create account</p>
          <h1 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
            Begin your Ukena.
          </h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-charcoal/70">
            One account to follow makers, track every piece on its journey, and
            keep a record of what you've collected.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                required
              />
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
                required
              />
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
                  required
                  minLength={6}
                />
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
                  required
                  minLength={6}
                />
              </label>
            </div>

            {error && (
              <p className="font-sans text-[13px] text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-clay px-6 py-3 font-sans text-sm font-medium text-warm-white transition-colors hover:bg-clay-deep disabled:opacity-50"
            >
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
                first to see new pieces from your favourite artisans.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
              <span>
                <strong className="text-charcoal">Track every piece.</strong>{" "}
                Watch your order travel from a Kenyan workshop to your door.
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
