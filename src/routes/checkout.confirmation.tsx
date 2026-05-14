import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Footer } from "@/components/home/Footer";
import { useCart, formatGBP } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { orderService, type OrderDto } from "@/services/orderService";
import { ApiError } from "@/services/api";
import { safeImg } from "@/lib/safeImage";

const confirmationSchema = z.object({
  ref: fallback(z.string(), "").default(""),
  email: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/checkout/confirmation")({
  validateSearch: zodValidator(confirmationSchema),
  head: () => ({
    meta: [{ title: "Thank you — UKEN" }, { name: "robots", content: "noindex" }],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { ref: refFromUrl, email: emailFromUrl } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { clearCart } = useCart();

  const [ref, setRef] = useState(refFromUrl);
  const [email, setEmail] = useState(emailFromUrl || user?.email || "");
  const [emailDraft, setEmailDraft] = useState("");
  const [polledOrder, setPolledOrder] = useState<OrderDto | null>(null);
  const [polling, setPolling] = useState(false);

  // Hydrate from sessionStorage if URL is missing email.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!ref || email) return;
    try {
      const raw = sessionStorage.getItem("ukena.lastOrder");
      if (!raw) return;
      const last = JSON.parse(raw) as { displayId?: string; email?: string };
      if (last.email && (!ref || last.displayId === ref)) {
        setEmail(last.email);
      }
    } catch {
      /* ignore */
    }
  }, [ref, email]);

  // Also hydrate ref+email from sessionStorage when both are missing from URL
  // (Stripe return URL may strip all query params).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (ref) return;
    try {
      const raw = sessionStorage.getItem("ukena.lastOrder");
      if (!raw) return;
      const last = JSON.parse(raw) as { displayId?: string; email?: string };
      if (last.displayId && last.email) {
        setRef(last.displayId);
        setEmail(last.email);
        navigate({ search: { ref: last.displayId, email: last.email }, replace: true });
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enabled = Boolean(ref && email);

  const query = useQuery({
    queryKey: ["orders", "confirmation", ref, email],
    queryFn: () => orderService.trackOrder(ref, email),
    enabled,
    retry: false,
  });

  // Clear cart once order is confirmed.
  useEffect(() => {
    if (query.data) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.displayId]);

  // Poll for PAID status — Stripe webhook may arrive a second or two after redirect.
  useEffect(() => {
    if (!query.data) return;
    if (query.data.status === "PAID") {
      setPolledOrder(query.data);
      return;
    }
    setPolling(true);
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const fresh = await orderService.trackOrder(ref, email);
        if (fresh.status === "PAID" || attempts >= 6) {
          setPolledOrder(fresh);
          setPolling(false);
          clearInterval(interval);
        }
      } catch {
        setPolledOrder(query.data);
        setPolling(false);
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.displayId]);

  const order = polledOrder ?? query.data ?? null;
  const notFound = query.isError && query.error instanceof ApiError && query.error.status === 404;

  // ── No ref in URL ──
  if (!ref) {
    return (
      <div className="min-h-screen bg-warm-white">
        <SlimHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">Nothing to confirm</p>
          <h1 className="mt-4 font-display text-3xl text-charcoal">No order reference</h1>
          <p className="mt-3 text-[14px] text-ink-muted">If you've just paid, you can look up your order anytime.</p>
          <Link
            to="/orders/track"
            className="mt-6 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
          >
            Track an order →
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Have ref but missing email ──
  if (ref && !email) {
    const onSubmit = (e: FormEvent) => {
      e.preventDefault();
      const v = emailDraft.trim();
      if (!v) return;
      setEmail(v);
      navigate({ search: { ref, email: v }, replace: true });
    };
    return (
      <div className="min-h-screen bg-warm-white">
        <SlimHeader />
        <main className="mx-auto max-w-xl px-6 py-24">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">Almost there</p>
          <h1 className="mt-4 font-display text-3xl text-charcoal">Confirm your email</h1>
          <p className="mt-3 text-[14px] text-ink-muted">
            Enter the email you used at checkout so we can show order <span className="font-mono">{ref}</span>.
          </p>
          <form onSubmit={onSubmit} className="mt-6 flex gap-3">
            <input
              type="email"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-11 flex-1 rounded-md border border-border bg-warm-white px-4 text-[14px] focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
            />
            <button
              type="submit"
              className="h-11 rounded-md bg-terracotta px-6 text-[14px] font-medium text-warm-white hover:bg-[oklch(0.52_0.13_38)]"
            >
              Show order
            </button>
          </form>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Loading initial fetch ──
  if (query.isLoading) {
    return (
      <div className="min-h-screen bg-warm-white">
        <SlimHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-clay" />
          <p className="mt-4 text-[14px] text-ink-muted">Looking up your order…</p>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Not found ──
  if (notFound) {
    return (
      <div className="min-h-screen bg-warm-white">
        <SlimHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-charcoal">Order not found</h1>
          <p className="mt-3 text-[14px] text-ink-muted">Check your order ID and email address.</p>
          <Link
            to="/orders/track"
            className="mt-6 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
          >
            Try the tracking page →
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Other error ──
  if (query.isError || (!order && !polling)) {
    return (
      <div className="min-h-screen bg-warm-white">
        <SlimHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-charcoal">Something went wrong</h1>
          <p className="mt-3 text-[14px] text-ink-muted">{query.error?.message ?? "Please try again."}</p>
          <button
            onClick={() => query.refetch()}
            className="mt-6 text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
          >
            Retry
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Polling — order found but not yet PAID ──
  if (polling || (order && order.status !== "PAID")) {
    return (
      <div className="min-h-screen bg-warm-white">
        <SlimHeader />
        <main className="mx-auto max-w-xl px-6 py-24 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-clay" />
          <h1 className="mt-6 font-display text-3xl text-charcoal">Confirming your payment…</h1>
          <p className="mt-3 text-[14px] text-ink-muted">
            This usually takes a few seconds.
            {order && (
              <>
                {" "}
                Your order reference is <span className="font-mono">{order.displayId}</span>.
              </>
            )}
          </p>
          {order && (
            <Link
              to="/orders/track"
              search={{ displayId: order.displayId, email: order.buyer.email }}
              className="mt-6 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
            >
              Check order status →
            </Link>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // ── Confirmed ──
  if (!order) return null;
  const buyerFirstName = order.buyer.fullName.split(" ")[0] ?? order.buyer.fullName;

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <SlimHeader />
      <main className="mx-auto max-w-[640px] px-6 py-16 md:py-24">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-clay/10 text-clay"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12.5L10 17.5L19 7.5" />
          </svg>
        </motion.div>

        <div className="mt-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-clay">Payment confirmed</p>
          <h1 className="mt-3 font-display text-[36px] italic leading-[1.1] text-charcoal">
            Thank you, {buyerFirstName}.
          </h1>
          <p className="mt-3 text-[13px] text-ink-muted">
            Order reference <span className="font-mono">{order.displayId}</span>
          </p>
        </div>

        <section className="mt-8 rounded-xl bg-cream/80 p-5">
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-warm-white">
                  <img
                    src={safeImg(item.image)}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-charcoal">
                    {item.name} <span className="text-ink-muted">× {item.quantity}</span>
                  </p>
                  <p className="text-[11px] text-charcoal/55">by {item.creator.fullName}</p>
                </div>
                <span className="shrink-0 text-[13px] tabular-nums text-charcoal/85">
                  {formatGBP(item.pricePence * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-border/60 pt-3 text-[13px]">
            <Row label="Subtotal" value={formatGBP(order.productsTotalPence)} />
            <Row label="Shipping" value={order.shippingPence === 0 ? "Free" : formatGBP(order.shippingPence)} />
            <Row label="Total paid" value={formatGBP(order.totalPence)} bold />
          </dl>
          <p className="mt-3 text-[12px] text-ink-muted">Estimated delivery 7–21 working days</p>
        </section>

        <section className="mt-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-charcoal/55">Delivery to</p>
          <address className="mt-2 not-italic text-[13px] leading-relaxed text-charcoal">
            <div>{order.delivery.fullName}</div>
            <div>{order.delivery.addressLine1}</div>
            {order.delivery.addressLine2 && <div>{order.delivery.addressLine2}</div>}
            <div>
              {order.delivery.city}, {order.delivery.postcode}
            </div>
            <div>{order.delivery.country}</div>
          </address>
        </section>

        <section className="mt-10 space-y-3">
          <Link
            to="/orders/track"
            search={{ displayId: order.displayId, email: order.buyer.email }}
            className="flex w-full items-center justify-center rounded-full bg-clay px-6 py-3 font-sans text-[13px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
          >
            Track your order
          </Link>
          <div className="rounded-2xl border border-clay/30 bg-clay/5 p-6">
            {isAuthenticated ? (
              <p className="text-[14px] text-charcoal">
                <Link to="/account/orders" className="font-medium text-clay underline-offset-4 hover:underline">
                  View all your orders →
                </Link>
              </p>
            ) : (
              <p className="text-[14px] text-charcoal">
                Want to see all your orders in one place?{" "}
                <Link to="/signup" className="font-medium text-clay underline-offset-4 hover:underline">
                  Create a free account with the same email
                </Link>{" "}
                and your history will be there automatically.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-charcoal/70">{label}</dt>
      <dd className={bold ? "font-medium text-charcoal" : "text-charcoal/85"}>{value}</dd>
    </div>
  );
}

function SlimHeader() {
  return (
    <header className="border-b border-border/60 bg-warm-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link to="/" className="font-display text-2xl tracking-tight text-charcoal">
          UKEN
        </Link>
        <Link to="/orders/track" className="text-[12px] uppercase tracking-[0.22em] text-ink-muted hover:text-clay">
          Track an order
        </Link>
      </div>
    </header>
  );
}
