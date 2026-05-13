import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Footer } from "@/components/home/Footer";
import { orderService } from "@/services/orderService";
import { ApiError } from "@/services/api";
import { formatGBP } from "@/lib/cart";
import { safeImg } from "@/lib/safeImage";
import { useAuth } from "@/lib/auth";

const trackSearchSchema = z.object({
  displayId: fallback(z.string(), "").default(""),
  email: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/orders/track")({
  validateSearch: zodValidator(trackSearchSchema),
  head: () => ({
    meta: [
      { title: "Track your order — UKEN" },
      { name: "description", content: "Look up an UKEN order with your reference and email." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const { displayId: paramId, email: paramEmail } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { isAuthenticated } = useAuth();

  const [displayId, setDisplayId] = useState(paramId);
  const [email, setEmail] = useState(paramEmail);

  // Hydrate from sessionStorage on first mount when query params are absent
  // (the gateway return URL may strip them).
  useEffect(() => {
    if (paramId && paramEmail) return;
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem("ukena.lastOrder");
      if (!raw) return;
      const last = JSON.parse(raw) as { displayId?: string; email?: string };
      if (last.displayId && last.email) {
        setDisplayId((v) => v || last.displayId!);
        setEmail((v) => v || last.email!);
        navigate({
          search: { displayId: last.displayId, email: last.email },
          replace: true,
        });
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enabled = Boolean(paramId && paramEmail);

  const query = useQuery({
    queryKey: ["orders", "track", paramId, paramEmail],
    queryFn: () => orderService.trackOrder(paramId, paramEmail),
    enabled,
    retry: false,
  });

  const notFound = useMemo(
    () =>
      query.isError &&
      query.error instanceof ApiError &&
      query.error.status === 404,
    [query.isError, query.error],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!displayId.trim() || !email.trim()) return;
    navigate({
      search: { displayId: displayId.trim(), email: email.trim() },
    });
  }

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <header className="border-b border-border/60 bg-warm-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link to="/" className="font-display text-2xl tracking-tight text-charcoal">
            UKEN
          </Link>
          <Link
            to="/explore"
            className="text-[12px] uppercase tracking-[0.22em] text-ink-muted hover:text-clay"
          >
            Explore makers
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Order tracking
        </p>
        <h1 className="mt-3 font-display text-[32px] leading-[1.1] tracking-tight text-charcoal md:text-[40px]">
          Look up your order
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-charcoal/65">
          Enter your order reference and the email you used at checkout.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 grid gap-4 rounded-2xl border border-border/60 bg-cream p-6 md:grid-cols-[1fr_1fr_auto] md:items-end"
        >
          <label className="block">
            <span className="text-[12px] font-medium text-charcoal">
              Order reference
            </span>
            <input
              value={displayId}
              onChange={(e) => setDisplayId(e.target.value)}
              placeholder="UKN-202501-1234"
              required
              className="mt-1.5 h-11 w-full rounded-md border border-border bg-warm-white px-4 text-[14px] text-charcoal focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-medium text-charcoal">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1.5 h-11 w-full rounded-md border border-border bg-warm-white px-4 text-[14px] text-charcoal focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-terracotta px-6 text-[14px] font-medium text-warm-white transition-all hover:bg-[oklch(0.52_0.13_38)]"
          >
            Track
          </button>
        </form>

        {enabled && query.isLoading && (
          <p className="mt-10 text-[13px] text-ink-muted">Looking up your order…</p>
        )}

        {notFound && (
          <p className="mt-10 rounded-xl border border-border/60 bg-warm-white p-6 text-[14px] text-charcoal/80">
            No order found. Check your order ID and email.
          </p>
        )}

        {query.isError && !notFound && (
          <div className="mt-10 rounded-xl border border-border/60 bg-warm-white p-6 text-[14px] text-charcoal/80">
            <p>Couldn't load this order.</p>
            <button
              type="button"
              onClick={() => query.refetch()}
              className="mt-3 text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
            >
              Retry
            </button>
          </div>
        )}

        {query.data && (
          <section className="mt-10 space-y-8">
            <div className="rounded-2xl border border-border/60 bg-cream p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
                    Order
                  </p>
                  <p className="mt-1 font-mono text-[14px] text-charcoal">
                    {query.data.displayId}
                  </p>
                </div>
                <span className="rounded-full border border-clay/30 bg-clay/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-clay">
                  {query.data.status.toLowerCase()}
                </span>
              </div>
              <p className="mt-3 text-[13px] text-charcoal/70">
                {query.data.buyer.fullName} · {query.data.buyer.email}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-warm-white p-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
                Items
              </p>
              <ul className="mt-4 space-y-4">
                {query.data.items.map((it) => (
                  <li key={it.productId} className="flex items-center gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-cream">
                      <img
                        src={safeImg(it.image)}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] text-charcoal">{it.name}</p>
                      <p className="text-[12px] text-charcoal/60">
                        Qty {it.quantity} · {it.creator.fullName}
                      </p>
                    </div>
                    <span className="shrink-0 text-[13px] tabular-nums text-charcoal/85">
                      {formatGBP(it.pricePence * it.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-baseline justify-between border-t border-border/60 pt-4 text-[14px]">
                <span className="text-charcoal/70">Total</span>
                <span className="font-display text-xl text-charcoal">
                  {formatGBP(query.data.totalPence)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-warm-white p-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
                Delivery to
              </p>
              <address className="mt-3 not-italic text-[13px] leading-relaxed text-charcoal">
                <div className="font-medium">{query.data.delivery.fullName}</div>
                <div>{query.data.delivery.addressLine1}</div>
                {query.data.delivery.addressLine2 && (
                  <div>{query.data.delivery.addressLine2}</div>
                )}
                <div>
                  {query.data.delivery.city}, {query.data.delivery.postcode}
                </div>
                <div>{query.data.delivery.country}</div>
              </address>
            </div>

            {!isAuthenticated && (
              <div className="rounded-2xl border border-clay/30 bg-clay/5 p-6">
                <p className="text-[14px] text-charcoal">
                  Want to see all your orders in one place?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-clay underline-offset-4 hover:underline"
                  >
                    Create an account with the same email
                  </Link>{" "}
                  and your history will appear automatically.
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
