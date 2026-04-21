import { createFileRoute, Link } from "@tanstack/react-router";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { CreatorHeader } from "@/components/creator/CreatorHeader";
import { CreatorStory } from "@/components/creator/CreatorStory";
import { CreatorProcess } from "@/components/creator/CreatorProcess";
import { CreatorMeaning } from "@/components/creator/CreatorMeaning";
import { CreatorProducts } from "@/components/creator/CreatorProducts";
import { RelatedCreators } from "@/components/creator/RelatedCreators";
import { getCreatorProfile } from "@/components/creator/creator-profile-data";

export const Route = createFileRoute("/creators/$creatorId")({
  loader: ({ params }) => {
    // Mock data lookup — Phase 6 will replace this with a typed fetch
    // from /api/creators/:id. The loader contract stays the same.
    const creator = getCreatorProfile(params.creatorId);
    return { creator };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.creator;
    if (!c) {
      return {
        meta: [{ title: "Creator — Ukena" }],
      };
    }
    const title = `${c.fullName} — ${c.craft} from ${c.region} · Ukena`;
    const description = `Meet ${c.firstName}, a ${c.craft.toLowerCase()} working from ${c.region}. ${c.pullQuote}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: c.headerImage },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: c.headerImage },
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
      <div className="absolute inset-x-0 top-0 z-50">
        <ExploreNav />
      </div>

      <main>
        <CreatorHeader creator={creator} />
        <CreatorStory creator={creator} />
        <CreatorProcess creator={creator} />
        <CreatorMeaning creator={creator} />
        <CreatorProducts creator={creator} />
        <RelatedCreators creator={creator} />
      </main>

      <Footer />
    </div>
  );
}
