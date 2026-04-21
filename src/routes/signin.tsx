import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * Placeholder /signin route — exists primarily so the api 401 interceptor
 * has a real destination to send users to once the Spring Boot backend
 * starts rejecting tokens. The full sign-in form will be built in the
 * next phase; for now, this is an intentional human pause.
 */
export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Ukena" },
      {
        name: "description",
        content:
          "Sign in to your Ukena account to continue your conversation with the makers.",
      },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-white px-6">
      <div className="max-w-md text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-clay">
          Sign in
        </p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-charcoal md:text-5xl">
          Welcome back to Ukena.
        </h1>
        <p className="mt-5 font-sans text-base leading-relaxed text-charcoal/70">
          Sign-in opens shortly. In the meantime, keep exploring the makers —
          your bag and your saved stories will be waiting.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/explore"
            className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-3 font-sans text-sm font-medium text-warm-white transition-colors hover:bg-clay-deep"
          >
            Meet the makers
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center font-sans text-sm text-charcoal/70 underline-offset-4 hover:text-charcoal hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
