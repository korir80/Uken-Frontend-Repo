import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { CreatorSocialFeed } from "@/components/creator/CreatorSocialFeed";
import {
  getCreatorProfile,
  type CreatorProfile,
} from "@/components/creator/creator-profile-data";
import { creatorQueryOptions, productsQueryOptions } from "@/lib/queries";
import { isCreatorSuspended } from "@/lib/creatorStatus";

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
    try {
      // Prime the thin DTO too — useful for any sibling consumers.
      queryClient.ensureQueryData(creatorQueryOptions(params.creatorId));
      // Prime the catalogue so cross-links to products are instant.
      queryClient.ensureQueryData(productsQueryOptions());
      const creator = await queryClient.ensureQueryData(
        profileQueryOptions(params.creatorId),
      );
      // Suspended makers must not be reachable from public URLs.
      if (isCreatorSuspended(creator as never)) throw notFound();
      return { creator };
    } catch (err) {
      if (err instanceof Error && /not in (the )?index/i.test(err.message))
        throw notFound();
      throw err;
    }
  },
    } catch (err) {
      if (err instanceof Error && /not in (the )?index/i.test(err.message))
        throw notFound();
      throw err;
    }
  },
  head: ({ loaderData, params }) => {
    const c = loaderData?.creator;
    const url = `https://ukena.co.uk/creators/${params.creatorId}`;
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
  const { creator } = Route.useLoaderData();

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
