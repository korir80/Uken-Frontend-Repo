import { SectionLabel } from "@/components/ukena";
import { ArrowRight } from "lucide-react";
import wanjiru from "@/assets/creator-wanjiru.jpg";
import mumo from "@/assets/creator-mumo.jpg";
import naserian from "@/assets/creator-naserian.jpg";

// Shape mirrors the future API response — swap `creators` for a fetch later.
export interface Creator {
  id: string;
  name: string;
  craft: string;
  region: string;
  hook: string;
  image: string;
}

const creators: Creator[] = [
  {
    id: "wanjiru",
    name: "Wanjiru Kamau",
    craft: "Sisal Basket Weaver",
    region: "Maragua, Murang'a",
    hook: "She learned the patterns from her grandmother — knots that once carried grain.",
    image: wanjiru,
  },
  {
    id: "mumo",
    name: "Mumo Mwangi",
    craft: "Ceramic Potter",
    region: "Kiambu Highlands",
    hook: "Trained as an architect, he came home to clay after his father's last vessels went unsold.",
    image: mumo,
  },
  {
    id: "naserian",
    name: "Naserian Lekishon",
    craft: "Maa Beadwork Artist",
    region: "Kajiado County",
    hook: "Each colour means something. She beads the conversations her elders never had time to write down.",
    image: naserian,
  },
];

export function FeaturedCreators() {
  return (
    <section id="creators" className="bg-warm-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <SectionLabel>Meet the makers</SectionLabel>
            <h2 className="mt-5 font-display text-[40px] leading-[1.05] tracking-tight text-charcoal md:text-6xl">
              Begin with a person.{" "}
              <em className="italic text-terracotta">Not a product.</em>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-muted">
              Three of the makers shaping this season's collection. Each has a
              workshop, a region, and a reason for the craft they keep alive.
            </p>
          </div>
          <a
            href="/creators"
            className="group inline-flex items-center gap-2 self-start text-[13px] font-medium uppercase tracking-[0.18em] text-clay md:self-end"
          >
            All creators
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* Cards: horizontal scroll on mobile, grid on md+ */}
        <div className="-mx-6 overflow-x-auto pb-6 md:mx-0 md:overflow-visible md:pb-0">
          <ul className="flex w-max gap-6 px-6 md:grid md:w-full md:grid-cols-3 md:gap-8 md:px-0">
            {creators.map((c, i) => (
              <li
                key={c.id}
                className="w-[300px] shrink-0 sm:w-[340px] md:w-auto"
              >
                <CreatorCard creator={c} index={i} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CreatorCard({ creator, index }: { creator: Creator; index: number }) {
  return (
    <article className="group h-full">
      <div className="relative overflow-hidden rounded-2xl bg-cream">
        <div className="aspect-[4/5] w-full">
          <img
            src={creator.image}
            alt={`Portrait of ${creator.name}, ${creator.craft}`}
            width={1024}
            height={1280}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />

        {/* Index numeral — editorial mark */}
        <span className="absolute left-5 top-5 font-display text-2xl text-warm-white/90">
          0{index + 1}
        </span>

        {/* Region tag */}
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-warm-white/90">
          <span className="h-px w-5 bg-warm-white/70" />
          {creator.region}
        </span>
      </div>

      <div className="px-1 pt-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
          {creator.craft}
        </p>
        <h3 className="mt-3 font-display text-[28px] leading-tight text-charcoal">
          {creator.name}
        </h3>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
          {creator.hook}
        </p>
        <a
          href={`/creators/${creator.id}`}
          className="group/link mt-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] text-clay"
        >
          Read their story
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>
    </article>
  );
}
