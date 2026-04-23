import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/home/NavBar";
import { Hero } from "@/components/home/Hero";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { ProcessStrip } from "@/components/home/ProcessStrip";
import { ParallaxBand } from "@/components/home/ParallaxBand";
import { QuotePullout } from "@/components/home/QuotePullout";
import { ArtisanCTA } from "@/components/home/ArtisanCTA";
import { Footer } from "@/components/home/Footer";
import { PersonalisedHome } from "@/components/home/PersonalisedHome";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ukena — Story-driven craft from Kenyan artisans" },
      {
        name: "description",
        content:
          "A marketplace where Kenyan makers come first. Discover the artisans, then the heirlooms they handcraft for homes across the UK.",
      },
      {
        property: "og:title",
        content: "Ukena — Story-driven craft from Kenyan artisans",
      },
      {
        property: "og:description",
        content:
          "Discover the makers behind every piece. Handcrafted in Kenya, made to last a lifetime.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Authed buyers bypass the marketing hero entirely and land on a
  // personalised surface (saved makers + recently viewed pieces). The
  // marketing sections beneath are kept so the brand still leads the page.
  const showPersonalised = !isLoading && isAuthenticated && user;

  return (
    <div className="min-h-screen bg-warm-white text-charcoal">
      <NavBar />
      <main>
        {showPersonalised ? <PersonalisedHome user={user} /> : <Hero />}
        <FeaturedCreators />
        <ParallaxBand />
        <ProcessStrip />
        <QuotePullout />
        <ArtisanCTA />
      </main>
      <Footer />
    </div>
  );
}
