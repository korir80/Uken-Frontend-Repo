import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useCreator, useCreatorOrders } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/productService";
import { PageHeader, StatCard, EmptyState } from "@/components/dashboard/DashboardShell";
import { formatGBP } from "@/lib/cart";
import { MissingImagesBanner } from "@/components/creator/MissingImagesBanner";

export const Route = createFileRoute("/creator/")({
  component: CreatorOverview,
});

function CreatorOverview() {
  const { user } = useAuth();
  const creatorId = user?.creatorId ?? null;

  const { data: profile } = useCreator(creatorId ?? "");
  const { data: rawProducts } = useQuery({
    queryKey: ["products", "creator", "me"],
    queryFn: () => productService.getMyProducts(),
    enabled: !!creatorId,
  });
  const products = Array.isArray(rawProducts) ? rawProducts : [];
  const { data: orders = [] } = useCreatorOrders();

  const myOrders = creatorId ? orders.filter((o) => o.items.some((i) => i.creator.id === creatorId)) : [];
  const pending = myOrders.filter((o) => o.status === "PENDING" || o.status === "PREPARING");
  const monthRevenuePence = myOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce(
      (sum, o) =>
        sum + o.items.filter((i) => i.creator.id === creatorId).reduce((s, i) => s + i.pricePence * i.quantity, 0),
      0,
    );

  if (!creatorId) {
    return (
      <div className="space-y-10">
        <PageHeader
          eyebrow="Welcome"
          title="Setting up your studio…"
          description="Your creator profile is being linked. Please refresh in a moment."
          refreshKeys={[]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Welcome back"
        title={`Karibu, ${profile?.firstName ?? user?.fullName ?? "maker"}.`}
        description="Your studio at a glance — what needs your attention today, and what's already in motion."
        refreshKeys={[]}
      />

      <MissingImagesBanner profileImage={profile?.image} products={products} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pieces live" value={String(products.length)} hint="In the shop" />
        <StatCard label="Orders awaiting" value={String(pending.length)} hint="Pending or preparing" />
        <StatCard label="Total orders" value={String(myOrders.length)} hint="All time" />
        <StatCard label="Estimated revenue" value={formatGBP(monthRevenuePence)} hint="Across all your orders" />
      </div>

      <section>
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-charcoal">Latest orders</h2>
          <Link to="/creator/orders" className="font-sans text-[13px] text-clay hover:underline">
            See all →
          </Link>
        </div>
        {myOrders.length === 0 ? (
          <EmptyState
            title="No orders yet."
            body="As soon as a buyer places an order with one of your pieces, it will appear here."
          />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border/60">
            <table className="min-w-[640px] divide-y divide-border/60 sm:min-w-full">
              <thead className="bg-cream/60 text-left">
                <tr>
                  <Th>Order</Th>
                  <Th>Buyer</Th>
                  <Th>Piece</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Subtotal</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 bg-warm-white">
                {myOrders.slice(0, 5).map((o) => {
                  const myItems = o.items.filter((i) => i.creator.id === creatorId);
                  const subtotal = myItems.reduce((s, i) => s + i.pricePence * i.quantity, 0);
                  return (
                    <tr key={o.id}>
                      <Td className="font-mono text-[12px]">{o.id}</Td>
                      <Td>{o.buyer.fullName}</Td>
                      <Td>
                        {myItems.map((i) => (
                          <div key={i.productId} className="text-charcoal/80">
                            {i.name} <span className="text-charcoal/50">× {i.quantity}</span>
                          </div>
                        ))}
                      </Td>
                      <Td className="text-charcoal/70">{o.status.toLowerCase()}</Td>
                      <Td className="text-right">{formatGBP(subtotal)}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 font-sans text-[11px] uppercase tracking-[0.18em] text-charcoal/60 ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 font-sans text-[13px] text-charcoal ${className}`}>{children}</td>;
}
