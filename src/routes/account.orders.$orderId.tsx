import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Package, Truck, Home, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  StatusPill,
} from "@/components/dashboard/DashboardShell";
import { formatGBP, useCart } from "@/lib/cart";
import { useBuyerOrder, orderQueryOptions, queryKeys } from "@/lib/queries";
import { orderService, type OrderDto, type OrderStatus, type OrderItem } from "@/services";
import { ApiError } from "@/services/api";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/account/orders/$orderId")({
  loader: async ({ params, context: { queryClient } }) => {
    try {
      const order = await queryClient.ensureQueryData(
        orderQueryOptions(params.orderId),
      );
      return { order };
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      if (err instanceof Error && /not found/i.test(err.message))
        throw notFound();
      throw err;
    }
  },
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.orderId} — UKEN` },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: () => (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Not found"
        title="That order doesn't exist."
        description="The reference may be wrong, or the order has been removed."
      />
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1 font-sans text-[13px] text-clay hover:text-clay-deep"
      >
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Error"
        title="Couldn't load this order."
        description={error.message}
      />
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1 font-sans text-[13px] text-clay hover:text-clay-deep"
      >
        <ChevronLeft className="h-4 w-4" /> Back to orders
      </Link>
    </div>
  ),
  component: OrderDetailPage,
});

const STATUS_TONE: Record<
  OrderStatus,
  "neutral" | "good" | "warn" | "bad" | "info"
> = {
  PENDING: "warn",
  PREPARING: "info",
  SHIPPED: "info",
  DELIVERED: "good",
  CANCELLED: "bad",
};

// Index of each status in the tracking timeline.
const STATUS_INDEX: Record<OrderStatus, number> = {
  PENDING: 0,
  PREPARING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: -1,
};

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const initial = Route.useLoaderData().order as OrderDto;
  // Subscribe to the cache so any background refetch updates the UI.
  const { data: order = initial } = useBuyerOrder(orderId) as { data: OrderDto | undefined };
  const { addItem } = useCart();
  const qc = useQueryClient();
  const [cancelling, setCancelling] = useState(false);

  const placedAt = new Date(order.createdAt);
  const stepIdx = STATUS_INDEX[order.status];
  const cancelled = order.status === "CANCELLED";

  function reorder() {
    order.items.forEach((it: OrderItem) => {
      for (let i = 0; i < it.quantity; i++) {
        addItem({
          productId: it.productId,
          name: it.name,
          pricePence: it.pricePence,
          image: it.image,
          creator: it.creator,
        });
      }
    });
    toast.success("Pieces added to your bag");
  }

  async function cancelOrder() {
    // Order cancellation/refund is not yet supported by the backend.
    toast.error("Order cancellation is not available yet.");
  }
  void setCancelling;

  const subtotal = order.items.reduce(
    (s: number, i: OrderItem) => s + i.pricePence * i.quantity,
    0,
  );
  const shipping = Math.max(0, order.totalPence - subtotal);

  return (
    <div className="space-y-10">
      {/* Breadcrumb */}
      <Link
        to="/account/orders"
        className="-mb-4 inline-flex items-center gap-1 font-sans text-[12px] uppercase tracking-[0.2em] text-charcoal/55 hover:text-clay"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> All orders
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          eyebrow={`Order ${order.id}`}
          title={`Placed ${placedAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}`}
          description={`${order.items.length} ${
            order.items.length === 1 ? "piece" : "pieces"
          } · ${formatGBP(order.totalPence)}`}
        />
        <StatusPill
          label={order.status.toLowerCase()}
          tone={STATUS_TONE[order.status]}
        />
      </div>

      {/* Tracking timeline */}
      <section className="rounded-2xl border border-border/60 bg-warm-white p-6 md:p-8">
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
          Journey
        </p>

        {cancelled ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-destructive/5 p-4 text-destructive">
            <X className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-sans text-[14px] font-medium">
                This order was cancelled.
              </p>
              <p className="mt-1 font-sans text-[12px] text-destructive/80">
                If a refund is owed, it will appear on your card within 5–10
                working days.
              </p>
            </div>
          </div>
        ) : (
          <ol className="mt-6 grid gap-6 sm:grid-cols-4">
            <Step
              n={0}
              icon={<Sparkles className="h-4 w-4" />}
              label="Order placed"
              hint={placedAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
              currentIdx={stepIdx}
            />
            <Step
              n={1}
              icon={<Package className="h-4 w-4" />}
              label="In the workshop"
              hint="Your maker is preparing it"
              currentIdx={stepIdx}
            />
            <Step
              n={2}
              icon={<Truck className="h-4 w-4" />}
              label="On its way"
              hint="Shipped to the UK"
              currentIdx={stepIdx}
            />
            <Step
              n={3}
              icon={<Home className="h-4 w-4" />}
              label="Delivered"
              hint="At your door"
              currentIdx={stepIdx}
            />
          </ol>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Items */}
        <section className="space-y-3">
          <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
            Pieces in this order
          </p>
          <ul className="space-y-3">
            {order.items.map((it: OrderItem) => (
              <li
                key={it.productId}
                className="flex items-center gap-4 rounded-2xl border border-border/60 bg-warm-white p-4"
              >
                <img
                  src={it.image}
                  alt=""
                  className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to="/products/$productId"
                    params={{ productId: it.productId }}
                    className="block truncate font-display text-lg text-charcoal hover:text-clay"
                  >
                    {it.name}
                  </Link>
                  <Link
                    to="/creators/$creatorId"
                    params={{ creatorId: it.creator.id }}
                    className="mt-0.5 block font-sans text-[12px] text-charcoal/60 hover:text-clay"
                  >
                    {it.creator.fullName} · {it.creator.region}
                  </Link>
                  <p className="mt-1 font-sans text-[12px] text-charcoal/70">
                    Qty {it.quantity} · {formatGBP(it.pricePence)} each
                  </p>
                </div>
                <span className="shrink-0 font-display text-base text-charcoal">
                  {formatGBP(it.pricePence * it.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Sidebar: delivery + totals + actions */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-cream/60 p-5">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
              Delivery
            </p>
            <div className="mt-3 font-sans text-[13px] leading-relaxed text-charcoal/85">
              <p className="font-medium text-charcoal">
                {order.delivery.fullName}
              </p>
              <p>{order.delivery.addressLine1}</p>
              {order.delivery.addressLine2 && (
                <p>{order.delivery.addressLine2}</p>
              )}
              <p>
                {order.delivery.city}, {order.delivery.postcode}
              </p>
              <p>{order.delivery.country}</p>
            </div>
            <p className="mt-4 font-sans text-[12px] text-charcoal/55">
              {order.delivery.email}
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-cream/60 p-5">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-charcoal/55">
              Totals
            </p>
            <dl className="mt-3 space-y-2 font-sans text-[13px]">
              <Row label="Subtotal" value={formatGBP(subtotal)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatGBP(shipping)}
              />
            </dl>
            <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-3">
              <span className="font-sans text-[12px] uppercase tracking-[0.22em] text-charcoal/60">
                Total
              </span>
              <span className="font-display text-xl text-charcoal">
                {formatGBP(order.totalPence)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={reorder}
              className="w-full rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
            >
              Reorder pieces
            </button>
            {!cancelled && stepIdx < 2 && (
              <button
                type="button"
                onClick={cancelOrder}
                disabled={cancelling}
                className="w-full rounded-full border border-border bg-warm-white px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-charcoal/70 transition hover:border-destructive/60 hover:text-destructive disabled:opacity-50"
              >
                {cancelling ? "Cancelling…" : "Cancel order"}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Step({
  n,
  icon,
  label,
  hint,
  currentIdx,
}: {
  n: number;
  icon: React.ReactNode;
  label: string;
  hint: string;
  currentIdx: number;
}) {
  const done = n < currentIdx;
  const active = n === currentIdx;
  const upcoming = n > currentIdx;
  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition-colors",
            done && "bg-clay text-warm-white",
            active && "bg-clay/15 text-clay ring-4 ring-clay/15",
            upcoming && "bg-cream text-charcoal/40",
          )}
        >
          {icon}
        </span>
        <div>
          <p
            className={cn(
              "font-sans text-[13px] font-medium",
              upcoming ? "text-charcoal/40" : "text-charcoal",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "font-sans text-[11px]",
              upcoming ? "text-charcoal/30" : "text-charcoal/55",
            )}
          >
            {hint}
          </p>
        </div>
      </div>
    </li>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-charcoal/70">{label}</dt>
      <dd className="text-charcoal">{value}</dd>
    </div>
  );
}
