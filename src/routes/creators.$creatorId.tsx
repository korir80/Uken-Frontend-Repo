import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { CreatorSocialFeed } from "@/components/creator/CreatorSocialFeed";
import {
  getCreatorProfile,
  type CreatorProfile,
} from "@/components/creator/creator-profile-data";
import { creatorQueryOptions, productsQueryOptions, useAllProducts } from "@/lib/queries";
import { isCreatorSuspended } from "@/lib/creatorStatus";
import { Leaf, ShieldCheck, Handshake, ArrowRight, Sparkles } from "lucide-react";
import { Button, Card, SectionLabel } from "@/components/ukena";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import type { Product } from "@/components/product/product-data";
import type { ProductSummaryDto, ProductDto } from "@/services/productService";

const UKEN_SENTINEL_ID = "ukena";

/**
 * Query key for the rich /creators/:id profile (story + process + meaning).
 *
 * The thin {@link creatorService.getCreatorById} returns the API-shaped
 * CreatorDetail which omits the seed-only `products` and `relatedCreators`
 * arrays the on-page components depend on. Until the backend exposes those
 * sub-resources we still source them from the local profile module — but
 * everything goes through React Query so the cache, error states, and
 * background refetches all flow through one place.
 */
const profileQueryOptions = (creatorId: string) => ({
  queryKey: ["creators", creatorId, "profile"] as const,
  queryFn: async (): Promise<CreatorProfile> => getCreatorProfile(creatorId),
});

export const Route = createFileRoute("/creators/$creatorId")({
  loader: async ({ params, context: { queryClient } }) => {
    // The Uken sentinel creator gets a tailored "house brand" page —
    // skip the personal-profile loader (it expects story/process data
    // that the sentinel doesn't carry) and just prime the catalogue.
    if (params.creatorId === UKEN_SENTINEL_ID) {
      queryClient.ensureQueryData(productsQueryOptions());
      return { creator: null as CreatorProfile | null };
    }

    try {
      queryClient.ensureQueryData(creatorQueryOptions(params.creatorId));
      queryClient.ensureQueryData(productsQueryOptions());
      const creator = await queryClient.ensureQueryData(
        profileQueryOptions(params.creatorId),
      );
      if (isCreatorSuspended(creator as never)) throw notFound();
      return { creator };
    } catch (err) {
      if (err instanceof Error && /not in (the )?index/i.test(err.message))
        throw notFound();
      throw err;
    }
  },
  head: ({ loaderData, params }) => {
    const url = `https://ukena.co.uk/creators/${params.creatorId}`;
    if (params.creatorId === UKEN_SENTINEL_ID) {
      const title = "The UKEN Collection — Curated by UKEN";
      const description =
        "Pieces sourced, curated and fulfilled directly by UKEN — the trusted bridge between Kenyan makers and UK homes.";
      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
          { property: "og:url", content: url },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const c = loaderData?.creator;
    if (!c) {
      return {
        meta: [{ title: "Creator — UKEN" }],
        links: [{ rel: "canonical", href: url }],
      };
    }
    const title = `${c.fullName} — ${c.craft} from ${c.region} · UKEN`;
    const description = `Meet ${c.firstName}, a ${c.craft.toLowerCase()} working from ${c.region}. ${c.pullQuote}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: c.avatar },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: c.avatar },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: c.fullName,
            givenName: c.firstName,
            jobTitle: c.craft,
            address: {
              "@type": "PostalAddress",
              addressRegion: c.region,
            },
            image: c.avatar,
            url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://ukena.co.uk/" },
              { "@type": "ListItem", position: 2, name: "Explore", item: "https://ukena.co.uk/explore" },
              { "@type": "ListItem", position: 3, name: c.fullName, item: url },
            ],
          }),
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-warm-white">
      <ExploreNav />
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Something interrupted the story
        </p>
        <h1 className="mt-6 font-display text-5xl text-charcoal">
          We couldn't load this maker
        </h1>
        <p className="mt-6 text-ink-muted">{error.message}</p>
        <Link
          to="/explore"
          className="mt-10 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
        >
          ← Back to all makers
        </Link>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen bg-warm-white">
      <ExploreNav />
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Not in the index yet
        </p>
        <h1 className="mt-6 font-display text-5xl text-charcoal">
          We haven't met this maker
        </h1>
        <p className="mt-6 text-ink-muted">
          The index is still growing. Browse the makers we've already sat down with.
        </p>
        <Link
          to="/explore"
          className="mt-10 inline-block text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
        >
          ← Back to all makers
        </Link>
      </div>
    </div>
  ),
  component: CreatorProfilePage,
});

function CreatorProfilePage() {
  const { creatorId } = Route.useParams();
  const { creator } = Route.useLoaderData();

  if (creatorId === UKEN_SENTINEL_ID) {
    return (
      <div className="min-h-screen bg-warm-white text-charcoal">
        <ExploreNav />
        <UkenSentinelPage />
        <Footer />
      </div>
    );
  }

  if (!creator) {
    // Should be unreachable because the loader either returned a creator
    // or threw notFound — but TS needs the guard.
    return null;
  }

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <ExploreNav />
      <main>
        <CreatorSocialFeed creator={creator} />
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UKEN sentinel ("house brand") page                                  */
/* ------------------------------------------------------------------ */

function UkenSentinelPage() {
  const { data: products } = useAllProducts();
  const all = Array.isArray(products) ? products : [];
  const ukenProducts = all.filter(
    (p) => (p as ProductSummaryDto | ProductDto).isUkenaOwned || p.creatorId === UKEN_SENTINEL_ID,
  );

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-8 pt-10 md:px-10 md:pb-12 md:pt-14">
        <SectionLabel tone="gold">The UKEN Collection</SectionLabel>
        <h1 className="mt-3 font-display text-[32px] leading-[1.05] tracking-tight text-charcoal sm:text-[38px] md:mt-4 md:text-[52px]">
          Pieces sourced and{" "}
          <em className="italic text-clay">fulfilled directly by UKEN</em>.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-base">
          The UKEN Collection is our in-house catalogue — work we've curated,
          packaged and ship directly. It sits alongside our makers' independent
          listings; the same standards of provenance and care apply to every item.
        </p>
      </section>

      {/* Mission — three short promises */}
      <section className="bg-cream/40 py-10 md:py-14">
        <div className="mx-auto grid max-w-5xl gap-4 px-5 md:grid-cols-3 md:px-10">
          {[
            {
              title: "Authentic sourcing",
              body: "Every piece is verified in person by our Nairobi team. No mass-produced lookalikes, no resellers.",
              icon: ShieldCheck,
            },
            {
              title: "Fair to makers",
              body: "Creators are paid 60% of every sale on their own listings. UKEN Collection income funds the platform itself.",
              icon: Handshake,
            },
            {
              title: "Low-impact craft",
              body: "Natural fibres, plant dyes, traditional methods. We consolidate shipping and avoid wasteful packaging.",
              icon: Leaf,
            },
          ].map(({ title, body, icon: Icon }) => (
            <Card key={title} tone="cream" elevation="lift" className="p-5 md:p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-clay/10 text-clay">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-display text-[20px] leading-tight text-charcoal">
                {title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Catalogue grid */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <div>
            <SectionLabel tone="terracotta">Shop the collection</SectionLabel>
            <h2 className="mt-2 font-display text-[24px] leading-tight text-charcoal md:text-[32px]">
              {ukenProducts.length} {ukenProducts.length === 1 ? "piece" : "pieces"}{" "}
              fulfilled by UKEN
            </h2>
          </div>
        </div>

        {ukenProducts.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-cream/30 px-6 py-16 text-center">
            <Sparkles className="mx-auto h-7 w-7 text-clay" />
            <p className="mt-4 font-display text-xl italic text-charcoal">
              The collection is being curated.
            </p>
            <p className="mt-2 text-[14px] text-ink-muted">
              Check back soon, or browse pieces by our independent makers.
            </p>
            <div className="mt-6">
              <Button asChild variant="primary" size="md">
                <Link to="/shop">Browse the full shop</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 min-[380px]:grid-cols-2 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
            {ukenProducts.map((p, i) => (
              <ShopProductCard key={p.id} product={p as unknown as Product} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-20 md:px-10">
        <div className="rounded-2xl border border-border/60 bg-cream/40 p-6 md:p-9">
          <p className="font-display text-2xl italic leading-snug text-charcoal md:text-3xl">
            "Both the hands that make and the hands that hold must value the art between them."
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.28em] text-charcoal/55">
            The UKEN promise
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link to="/explore">
                Meet independent makers <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/about">Read our full story</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
