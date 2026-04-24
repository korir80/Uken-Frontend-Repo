import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/lib/auth";
import {
  useCreator,
  useCreatorOrders,
  useProductsByCreator,
} from "@/lib/queries";
import {
  PageHeader,
  StatCard,
  EmptyState,
} from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import type { OrderDto, OrderStatus } from "@/services";

export const Route = createFileRoute("/creator/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Maker Studio" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CreatorAnalytics,
});

/* ------------------------------------------------------------------ */

function CreatorAnalytics() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? "wanjiru";
  const { data: profile } = useCreator(creatorId);
  const { data: products = [], isLoading: loadingProducts } =
    useProductsByCreator(creatorId);
  const { data: allOrders = [], isLoading: loadingOrders } = useCreatorOrders();

  const myOrders = useMemo(
    () => allOrders.filter((o) => o.items.some((i) => i.creator.id === creatorId)),
    [allOrders, creatorId],
  );

  const stats = useMemo(() => computeStats(myOrders, creatorId), [
    myOrders,
    creatorId,
  ]);

  const isLoading = loadingProducts || loadingOrders;

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Analytics"
        title={`How your studio is performing, ${profile?.firstName ?? "maker"}.`}
        description="Real numbers from your orders. Where the demand is, what's selling, and which buyers come back."
        action={
          <Link
            to="/creator/orders"
            className="inline-flex items-center rounded-full border border-charcoal/20 px-4 py-2 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-charcoal hover:border-clay hover:bg-clay hover:text-warm-white"
          >
            View orders
          </Link>
        }
      />

      {isLoading ? (
        <p className="font-sans text-sm text-charcoal/60">Loading analytics…</p>
      ) : myOrders.length === 0 ? (
        <EmptyState
          title="No data to chart yet."
          body="Once your first piece sells, this dashboard fills in with revenue trends, top customers, and per-piece performance."
          action={
            <Link
              to="/creator/products"
              className="inline-flex items-center rounded-full bg-clay px-5 py-2.5 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white hover:bg-clay-deep"
            >
              Manage your pieces
            </Link>
          }
        />
      ) : (
        <>
          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Revenue (all time)"
              value={formatGBP(stats.totalRevenuePence)}
              hint={`${stats.unitsSold} units sold`}
            />
            <StatCard
              label="Average order value"
              value={formatGBP(stats.aovPence)}
              hint={`${myOrders.length} orders total`}
            />
            <StatCard
              label="Last 30 days"
              value={formatGBP(stats.last30RevenuePence)}
              hint={`${stats.last30Orders} orders`}
            />
            <StatCard
              label="Repeat customer rate"
              value={`${Math.round(stats.repeatRate * 100)}%`}
              hint={`${stats.repeatCustomers} of ${stats.uniqueCustomers} customers`}
            />
          </div>

          {/* Revenue trend */}
          <Card title="Revenue · last 30 days" subtitle="Daily revenue from your pieces.">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.dailyRevenue}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.13 38)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="oklch(0.55 0.13 38)" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.92 0.012 78)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="oklch(0.55 0.012 78)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="oklch(0.55 0.012 78)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `£${Math.round(v / 100)}`}
                  />
                  <Tooltip
                    formatter={(v: number) => [formatGBP(v), "Revenue"]}
                    cursor={{ stroke: "oklch(0.55 0.13 38)", strokeOpacity: 0.2 }}
                    contentStyle={tooltipStyle}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenuePence"
                    stroke="oklch(0.55 0.13 38)"
                    strokeWidth={2}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Two-up: per-product bar + status donut */}
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Card
                title="Units sold per piece"
                subtitle="Which pieces are pulling their weight."
              >
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.perProduct}
                      margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid stroke="oklch(0.92 0.012 78)" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="oklch(0.55 0.012 78)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        tickFormatter={(s: string) => (s.length > 14 ? s.slice(0, 12) + "…" : s)}
                      />
                      <YAxis
                        stroke="oklch(0.55 0.012 78)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        formatter={(v: number, _name, ctx) => {
                          const r = ctx?.payload as { revenuePence: number } | undefined;
                          return [
                            `${v} units · ${formatGBP(r?.revenuePence ?? 0)}`,
                            "Sold",
                          ];
                        }}
                        cursor={{ fill: "oklch(0.95 0.012 78)" }}
                        contentStyle={tooltipStyle}
                      />
                      <Bar dataKey="units" fill="oklch(0.55 0.13 38)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card title="Orders by status" subtitle="Where each order sits today.">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.statusBreakdown}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={78}
                        paddingAngle={2}
                      >
                        {stats.statusBreakdown.map((entry) => (
                          <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#999"} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number, _n, ctx) => {
                          const status = (ctx?.payload as { status: string } | undefined)?.status;
                          return [`${v} orders`, status?.toLowerCase() ?? ""];
                        }}
                        contentStyle={tooltipStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-4 grid grid-cols-2 gap-2">
                  {stats.statusBreakdown.map((s) => (
                    <li
                      key={s.status}
                      className="flex items-center gap-2 font-sans text-[12px] text-charcoal/70"
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: STATUS_COLORS[s.status] }}
                      />
                      <span className="lowercase">{s.status}</span>
                      <span className="ml-auto tabular-nums text-charcoal">{s.count}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Top customers */}
          <Card title="Top customers" subtitle="The buyers coming back for more.">
            {stats.topCustomers.length === 0 ? (
              <p className="font-sans text-sm text-charcoal/60">
                Not enough data yet.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/60">
                <table className="min-w-[520px] divide-y divide-border/60 sm:min-w-full">
                  <thead className="bg-cream/60 text-left">
                    <tr>
                      <Th>Buyer</Th>
                      <Th className="text-right">Orders</Th>
                      <Th className="text-right">Units</Th>
                      <Th className="text-right">Spent with you</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 bg-warm-white">
                    {stats.topCustomers.map((c) => (
                      <tr key={c.email}>
                        <Td>
                          <div className="text-charcoal">{c.fullName}</div>
                          <div className="text-[11px] text-charcoal/55">{c.email}</div>
                        </Td>
                        <Td className="text-right tabular-nums">{c.orders}</Td>
                        <Td className="text-right tabular-nums">{c.units}</Td>
                        <Td className="text-right tabular-nums">
                          {formatGBP(c.spentPence)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Conversion funnel */}
          <Card
            title="Conversion funnel"
            subtitle="From shelf to delivered. View tracking will land once the Spring backend is wired."
          >
            <FunnelStrip
              steps={[
                { label: "Pieces live", value: products.length, tone: "neutral" },
                { label: "Orders received", value: myOrders.length, tone: "info" },
                {
                  label: "Preparing",
                  value: myOrders.filter((o) => o.status === "PREPARING").length,
                  tone: "warn",
                },
                {
                  label: "Shipped",
                  value: myOrders.filter((o) => o.status === "SHIPPED").length,
                  tone: "info",
                },
                {
                  label: "Delivered",
                  value: myOrders.filter((o) => o.status === "DELIVERED").length,
                  tone: "good",
                },
              ]}
            />
          </Card>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Stats computation
 * ------------------------------------------------------------------ */

interface DailyPoint {
  date: string;
  label: string;
  revenuePence: number;
}
interface ProductRow {
  name: string;
  units: number;
  revenuePence: number;
}
interface StatusRow {
  status: OrderStatus;
  count: number;
}
interface CustomerRow {
  email: string;
  fullName: string;
  orders: number;
  units: number;
  spentPence: number;
}

function computeStats(orders: OrderDto[], creatorId: string) {
  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  // Per-day buckets for the last 30 days, prefilled with zero so chart
  // shows full window even when activity is sparse.
  const days = new Map<string, DailyPoint>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = isoDate(d);
    days.set(key, {
      date: key,
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      revenuePence: 0,
    });
  }

  let totalRevenuePence = 0;
  let unitsSold = 0;
  let last30RevenuePence = 0;
  let last30Orders = 0;

  const perProduct = new Map<string, ProductRow>();
  const statusCounts = new Map<OrderStatus, number>();
  const customers = new Map<string, CustomerRow>();

  for (const o of orders) {
    if (o.status === "CANCELLED") continue;

    const myItems = o.items.filter((i) => i.creator.id === creatorId);
    const orderRevenue = myItems.reduce(
      (s, i) => s + i.pricePence * i.quantity,
      0,
    );
    const orderUnits = myItems.reduce((s, i) => s + i.quantity, 0);

    totalRevenuePence += orderRevenue;
    unitsSold += orderUnits;

    // Daily revenue (last 30 days only).
    const created = new Date(o.createdAt);
    if (created >= since) {
      const key = isoDate(created);
      const bucket = days.get(key);
      if (bucket) bucket.revenuePence += orderRevenue;
      last30RevenuePence += orderRevenue;
      last30Orders += 1;
    }

    // Per-product totals.
    for (const item of myItems) {
      const row = perProduct.get(item.productId) ?? {
        name: item.name,
        units: 0,
        revenuePence: 0,
      };
      row.units += item.quantity;
      row.revenuePence += item.pricePence * item.quantity;
      perProduct.set(item.productId, row);
    }

    // Status breakdown (excludes cancelled, already filtered above).
    statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1);

    // Customer aggregation keyed on email so repeat purchases collapse.
    const email = o.buyer.email.toLowerCase();
    const existing = customers.get(email) ?? {
      email: o.buyer.email,
      fullName: o.buyer.fullName,
      orders: 0,
      units: 0,
      spentPence: 0,
    };
    existing.orders += 1;
    existing.units += orderUnits;
    existing.spentPence += orderRevenue;
    customers.set(email, existing);
  }

  const aovPence =
    orders.length > 0 ? Math.round(totalRevenuePence / Math.max(unitsSold, 1)) : 0;

  const allCustomers = Array.from(customers.values());
  const repeatCustomers = allCustomers.filter((c) => c.orders > 1).length;
  const uniqueCustomers = allCustomers.length;
  const repeatRate = uniqueCustomers > 0 ? repeatCustomers / uniqueCustomers : 0;

  const topCustomers = allCustomers
    .sort((a, b) => b.spentPence - a.spentPence)
    .slice(0, 5);

  const perProductSorted = Array.from(perProduct.values())
    .sort((a, b) => b.units - a.units)
    .slice(0, 8);

  // Order the status legend in pipeline order rather than alphabetic.
  const statusOrder: OrderStatus[] = [
    "PENDING",
    "PREPARING",
    "SHIPPED",
    "DELIVERED",
  ];
  const statusBreakdown: StatusRow[] = statusOrder
    .map((status) => ({ status, count: statusCounts.get(status) ?? 0 }))
    .filter((r) => r.count > 0);

  return {
    totalRevenuePence,
    unitsSold,
    aovPence,
    last30RevenuePence,
    last30Orders,
    dailyRevenue: Array.from(days.values()),
    perProduct: perProductSorted,
    statusBreakdown,
    topCustomers,
    repeatCustomers,
    uniqueCustomers,
    repeatRate,
  };
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/* ------------------------------------------------------------------ *
 * Presentation primitives (page-local)
 * ------------------------------------------------------------------ */

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "oklch(0.78 0.10 78)",
  PREPARING: "oklch(0.68 0.13 50)",
  SHIPPED: "oklch(0.55 0.13 38)",
  DELIVERED: "oklch(0.50 0.10 145)",
  CANCELLED: "oklch(0.55 0.02 0)",
};

const tooltipStyle: React.CSSProperties = {
  background: "oklch(0.99 0.005 78)",
  border: "1px solid oklch(0.90 0.012 78)",
  borderRadius: 8,
  fontSize: 12,
  padding: "8px 10px",
  color: "oklch(0.30 0.010 0)",
};

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-warm-white p-5 md:p-6">
      <header className="mb-4">
        <h2 className="font-display text-xl text-charcoal md:text-2xl">{title}</h2>
        {subtitle && (
          <p className="mt-1 font-sans text-[12px] text-charcoal/60">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60 ${className}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 font-sans text-[13px] text-charcoal ${className}`}>
      {children}
    </td>
  );
}

interface FunnelStep {
  label: string;
  value: number;
  tone: "neutral" | "good" | "warn" | "info";
}
function FunnelStrip({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(1, ...steps.map((s) => s.value));
  const toneClass: Record<FunnelStep["tone"], string> = {
    neutral: "bg-sand-soft/70 text-charcoal/70",
    info: "bg-clay/15 text-clay-deep",
    warn: "bg-terracotta-soft/60 text-charcoal",
    good: "bg-gold-soft/60 text-charcoal",
  };
  return (
    <ul className="space-y-3">
      {steps.map((s, i) => {
        const pct = Math.max(0.06, s.value / max);
        const fromPrev = i > 0 ? steps[i - 1].value : null;
        const conv =
          fromPrev !== null && fromPrev > 0
            ? `${Math.round((s.value / fromPrev) * 100)}% from previous`
            : null;
        return (
          <li key={s.label} className="flex items-center gap-4">
            <div className="w-32 shrink-0 font-sans text-[12px] text-charcoal/70">
              {s.label}
            </div>
            <div className="relative h-9 flex-1 overflow-hidden rounded-md bg-cream/60">
              <div
                className={`flex h-full items-center justify-end px-3 font-sans text-[12px] font-medium tabular-nums ${toneClass[s.tone]}`}
                style={{ width: `${pct * 100}%`, minWidth: 56 }}
              >
                {s.value}
              </div>
            </div>
            <div className="w-36 shrink-0 text-right font-sans text-[11px] text-charcoal/50">
              {conv ?? "—"}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
