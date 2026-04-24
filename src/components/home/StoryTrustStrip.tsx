import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import potteryStory from "@/assets/story-pottery.jpg";
import kiondoStory from "@/assets/story-kiondo.jpg";
import textileStory from "@/assets/story-textiles.jpg";

const stories = [
  {
    title: "Clay shaped for the table",
    maker: "Mumo · Kiambu Highlands",
    image: potteryStory,
    alt: "Kenyan clay pots arranged outdoors near a rural homestead",
    text: "Mumo begins with local clay, tests the curve by hand, then fires each vessel until the surface carries that warm, lived-in Kenyan earth tone.",
    to: "/creators/mumo",
  },
  {
    title: "Baskets that remember the hands",
    maker: "Wanjiru · Murang'a",
    image: kiondoStory,
    alt: "Women in Kenya weaving colourful kiondo baskets from natural fibres",
    text: "Wanjiru chooses sisal by strength, dyes the strands in small batches, and builds each basket slowly so it keeps its shape in a modern UK home.",
    to: "/creators/wanjiru",
  },
  {
    title: "Colour for homes with a story",
    maker: "Achieng · Nairobi market",
    image: textileStory,
    alt: "Colourful Kenyan woven textiles displayed on a market table",
    text: "The textile pieces are selected for pattern, weight, and finish — the kind of colour visitors to Kenya often remember long after the journey.",
    to: "/creators/akinyi",
  },
];

export function StoryTrustStrip() {
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="max-w-3xl">
          <p className="section-label">From maker to home</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-charcoal md:text-4xl">
            Buy the piece. Know the making.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            Brief maker notes for UK homes that value Kenyan craft, honest materials, and the story behind each object.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <article key={story.title} className="group">
              <Link to={story.to} className="block">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-sand-soft">
                  <LazyImage
                    src={story.image}
                    alt={story.alt}
                    wrapperClassName="h-full w-full"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="pt-5">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-terracotta">{story.maker}</p>
                  <h3 className="mt-2 font-display text-2xl leading-tight text-charcoal">{story.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{story.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-clay">
                    See the story
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}