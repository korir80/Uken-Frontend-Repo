import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/home/Hero";
import { StoryTrustStrip } from "@/components/home/StoryTrustStrip";
import { FeaturedShop } from "@/components/home/FeaturedShop";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { ProcessStrip } from "@/components/home/ProcessStrip";
import { TraceabilityStrip } from "@/components/home/TraceabilityStrip";
import { ParallaxBand } from "@/components/home/ParallaxBand";
import { QuotePullout } from "@/components/home/QuotePullout";
import { ArtisanCTA } from "@/components/home/ArtisanCTA";
import { Footer } from "@/components/home/Footer";
import { HomeArtPattern } from "@/components/home/HomeArtPattern";
import { PersonalisedHome } from "@/components/home/PersonalisedHome";
import { useAuth } from "@/lib/auth";

import { routeSeo } from "@/lib/seo";
import savanna from "@/assets/authentic-savanna.jpg";

export const Route = createFileRoute("/")({
  head: () => {
    const seo = routeSeo({
      path: "/",
      title: "UKEN — Authentic Kenyan Coffee, Crafts & Artisan Goods",
      description:
        "Shop direct from Kenyan farmers and artisans. Specialty coffee, tea, textiles, beadwork and craft — every piece traced from maker to your UK door.",
      image: savanna,
    });
    return {
      ...seo,
      links: [
        ...seo.links,
        { rel: "preload", as: "image", href: savanna, fetchpriority: "high" },
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const showPersonalised = !isLoading && isAuthenticated && user?.role === "ROLE_BUYER";

  return (
    <div className="relative min-h-screen overflow-hidden bg-warm-white text-charcoal">
      <HomeArtPattern />
      <main className="relative z-10">
        {showPersonalised && user ? <PersonalisedHome user={user} /> : <Hero />}
        <StoryTrustStrip />
        <FeaturedShop />
        <FeaturedCreators />
        <ParallaxBand />
        <ProcessStrip />
        <TraceabilityStrip />
        <QuotePullout />
        <ArtisanCTA />
      </main>
      <Footer />
    </div>
  );
}
