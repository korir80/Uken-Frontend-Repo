import { createFileRoute, Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { SectionLabel, Button } from "@/components/ukena";
import { useAuth } from "@/lib/auth";
import { LogOut, User as UserIcon, ShoppingBag, Bookmark } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Ukena" },
      { name: "description", content: "Your Ukena account." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main className="pb-24 md:pb-32">
        <section className="border-b border-border/60">
          <div className="mx-auto max-w-3xl px-5 pb-12 pt-12 md:px-10 md:pb-16 md:pt-20">
            <SectionLabel>Account</SectionLabel>
            {isAuthenticated && user ? (
              <>
                <h1 className="mt-5 font-display text-4xl tracking-tight text-charcoal md:text-6xl">
                  Hello, <em className="italic text-clay">{user.fullName.split(" ")[0]}</em>.
                </h1>
                <p className="mt-4 text-base text-ink-muted md:text-[17px]">
                  {user.email}
                </p>
              </>
            ) : (
              <>
                <h1 className="mt-5 font-display text-4xl tracking-tight text-charcoal md:text-6xl">
                  Sign in to your <em className="italic text-clay">account</em>.
                </h1>
                <p className="mt-4 max-w-md text-base text-ink-muted md:text-[17px]">
                  Save makers, track orders, and pick up where you left off
                  across devices.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="primary" size="md">
                    <Link to="/signin">Sign in</Link>
                  </Button>
                  <Button asChild variant="secondary" size="md">
                    <Link to="/explore">Keep browsing</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>

        {isAuthenticated && (
          <section className="py-10 md:py-16">
            <div className="mx-auto grid max-w-3xl gap-3 px-5 md:px-10">
              <AccountLink to="/saved" icon={<Bookmark className="h-5 w-5" />} label="Saved makers & pieces" />
              <AccountLink to="/bag" icon={<ShoppingBag className="h-5 w-5" />} label="Your bag" />
              <AccountLink to="/explore" icon={<UserIcon className="h-5 w-5" />} label="Discover more makers" />
              <button
                type="button"
                onClick={logout}
                className="mt-4 inline-flex min-h-[48px] items-center justify-between rounded-2xl border border-border/70 px-5 py-4 text-left text-charcoal transition-colors hover:border-clay hover:text-clay"
              >
                <span className="flex items-center gap-3 text-base font-medium">
                  <LogOut className="h-5 w-5" />
                  Sign out
                </span>
              </button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function AccountLink({
  to,
  icon,
  label,
}: {
  to: "/saved" | "/bag" | "/explore";
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-[48px] items-center justify-between rounded-2xl border border-border/70 px-5 py-4 text-charcoal transition-colors hover:border-clay hover:bg-cream/40"
    >
      <span className="flex items-center gap-3 text-base font-medium">
        {icon}
        {label}
      </span>
      <span aria-hidden className="text-clay">→</span>
    </Link>
  );
}
