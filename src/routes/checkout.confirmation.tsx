import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Download } from "lucide-react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Footer } from "@/components/home/Footer";
import { useCart, formatGBP } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { orderService, type OrderDto } from "@/services/orderService";
import { ApiError } from "@/services/api";
import { safeImg } from "@/lib/safeImage";
import { downloadOrderReceiptPdf } from "@/lib/exports";

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

type PageState =
  | { phase: "hydrating" }
  | { phase: "needs-email"; ref: string }
  | { phase: "polling"; ref: string; email: string }
  | { phase: "paid"; order: OrderDto }
  | { phase: "pending"; order: OrderDto }
  | { phase: "not-found" }
  | { phase: "error"; message: string };

function ConfirmationPage() {
  const { ref: refFromUrl, email: emailFromUrl } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { clearCart } = useCart();

  const [emailDraft, setEmailDraft] = useState("");
  const [state, setState] = useState<PageState>({ phase: "hydrating" });
  const clearedRef = useRef(false);

  // ── Step 1: Hydrate ref + email from URL or sessionStorage ──
  useEffect(() => {
    const ref = refFromUrl || "";
    const email = emailFromUrl || user?.email || "";

    if (ref && email) {
      setState({ phase: "polling", ref, email });
      return;
    }

    // Try sessionStorage
    try {
      const raw = sessionStorage.getItem("ukena.lastOrder");
      if (raw) {
        const last = JSON.parse(raw) as { displayId?: string; email?: string };
        const resolvedRef = ref || last.displayId || "";
        const resolvedEmail = email || last.email || "";
        if (resolvedRef && resolvedEmail) {
          setState({ phase: "polling", ref: resolvedRef, email: resolvedEmail });
          return;
        }
        if (resolvedRef) {
          setState({ phase: "needs-email", ref: resolvedRef });
          return;
        }
      }
    } catch {
      /* ignore */
    }

    if (ref) {
      setState({ phase: "needs-email", ref });
    } else {
      navigate({ to: "/checkout/delivery", replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Step 2: Poll for PAID status once we have ref + email ──
  useEffect(() => {
    if (state.phase !== "polling") return;
    const { ref, email } = state;

    let cancelled = false;
    let attempts = 0;
    const MAX = 8;
    const INTERVAL = 1500;

    async function poll() {
      while (attempts < MAX && !cancelled) {
        attempts++;
        try {
          const order = await orderService.trackOrder(ref, email);
          if (cancelled) return;
          if (order.status === "PAID") {
            if (!clearedRef.current) {
              clearCart();
              clearedRef.current = true;
            }
            setState({ phase: "paid", order });
            return;
          }
          if (attempts >= MAX) {
            setState({ phase: "pending", order });
            return;
          }
        } catch (err) {
          if (cancelled) return;
          if (err instanceof ApiError && err.status === 404) {
            setState({ phase: "not-found" });
            return;
          }
          setState({ phase: "error", message: err instanceof Error ? err.message : "Unknown error" });
          return;
        }
        await new Promise((r) => setTimeout(r, INTERVAL));
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase === "polling" ? state.ref + state.email : null]);

  // ── Render ──

  if (state.phase === "hydrating") {
    return (
      <Shell>
        <Spinner label="Loading…" />
      </Shell>
    );
  }

  if (state.phase === "needs-email") {
    const { ref } = state;
    const onSubmit = (e: FormEvent) => {
      e.preventDefault();
      const v = emailDraft.trim();
      if (!v) return;
      setState({ phase: "polling", ref, email: v });
    };
    return (
      <Shell>
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
      </Shell>
    );
  }

  if (state.phase === "polling") {
    return (
      <Shell>
        <Spinner label="Confirming your payment…" />
      </Shell>
    );
  }

  if (state.phase === "not-found") {
    return (
      <Shell>
        <h1 className="font-display text-3xl text-charcoal">Order not found</h1>
        <p className="mt-3 text-[14px] text-ink-muted">Check your order ID and email address.</p>
        <Link
          to="/orders/track"
          className="mt-6 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
        >
          Try the tracking page →
        </Link>
      </Shell>
    );
  }

  if (state.phase === "error") {
    return (
      <Shell>
        <h1 className="font-display text-3xl text-charcoal">Something went wrong</h1>
        <p className="mt-3 text-[14px] text-ink-muted">{state.message}</p>
        <Link
          to="/orders/track"
          className="mt-6 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
        >
          Track your order →
        </Link>
      </Shell>
    );
  }

  // ── pending: paid but webhook delayed ──
  if (state.phase === "pending") {
    const { order } = state;
    return (
      <Shell>
        <Spinner label="Payment processing…" />
        <p className="mt-4 text-[14px] text-ink-muted text-center">
          Your order <span className="font-mono">{order.displayId}</span> is being confirmed. Check your email or{" "}
          <Link
            to="/orders/track"
            search={{ displayId: order.displayId, email: order.buyer.email }}
            className="text-clay underline-offset-4 hover:underline"
          >
            track it here
          </Link>
          .
        </p>
      </Shell>
    );
  }

  // ── paid ──
  const { order } = state;
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
            Order <span className="font-mono">{order.displayId}</span> — confirmation sent to{" "}
            <span className="font-medium text-charcoal">{order.buyer.email}</span>
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
          <button
            type="button"
            onClick={() => downloadOrderReceiptPdf(order)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-clay/40 bg-warm-white px-6 py-3 font-sans text-[13px] font-medium uppercase tracking-[0.18em] text-clay hover:bg-clay/5"
          >
            <Download className="h-3.5 w-3.5" />
            Download receipt (PDF)
          </button>
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

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-white">
      <SlimHeader />
      <main className="mx-auto max-w-xl px-6 py-24 flex flex-col items-center justify-center">{children}</main>
      <Footer />
    </div>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <>
      <Loader2 className="h-6 w-6 animate-spin text-clay" />
      <p className="mt-4 text-[14px] text-ink-muted">{label}</p>
    </>
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
