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

export const Route = createFileRoute("/")({
  head: () => routeSeo({
    path: "/",
    title: "UKEN — Kenya, brought home",
    description:
      "Shop authentic Kenyan coffee, food, crafts, and artisan goods. Every product traced from maker to your UK door.",
  }),
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const showPersonalised = !isLoading && isAuthenticated && user?.role === "ROLE_BUYER";

  return (
    <div className="relative min-h-screen overflow-hidden bg-warm-white text-charcoal">
      <HomeArtPattern />
      <NavBar />
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
