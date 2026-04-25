import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/home/NavBar";
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
import { PersonalisedHome } from "@/components/home/PersonalisedHome";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uken — Story-driven craft from Kenyan artisans" },
      {
        name: "description",
        content:
          "A marketplace where Kenyan farmers, artisans, and makers come first. Discover specialty foods, coffee, textiles, craft, and more for homes across the UK.",
      },
      {
        property: "og:title",
        content: "Uken — Story-driven craft from Kenyan artisans",
      },
      {
        property: "og:description",
        content:
          "Discover the people behind Kenyan coffee, tea, foods, textiles, beadwork, pottery, and more.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const showPersonalised = !isLoading && isAuthenticated && user?.role === "ROLE_BUYER";

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <NavBar />
      <main>
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
