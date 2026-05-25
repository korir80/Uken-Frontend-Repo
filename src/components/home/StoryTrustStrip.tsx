import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { LazyImage } from "@/components/ui/lazy-image";
import { useCreators } from "@/lib/queries";

export function StoryTrustStrip() {
  const { data: creators = [] } = useCreators();
  const stories = creators.slice(0, 3);

  return (
    <section className="bg-cream py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="max-w-3xl">
          <p className="section-label">From maker to home</p>
          <h2 className="mt-2 font-display text-[30px] leading-tight text-charcoal md:text-[36px]">
            Buy the piece. Know the making.
          </h2>
          <p className="mt-2.5 max-w-2xl text-[14px] leading-relaxed text-ink-muted md:text-[15px]">
            Brief maker and grower notes for UK homes that value East African craft, honest harvests, and the story behind each product.
          </p>
        </div>

        <div className="mt-7 grid gap-5 border-y border-border/70 py-5 text-[14px] leading-relaxed text-ink-muted sm:grid-cols-2 md:grid-cols-4 md:text-sm">
          <p><span className="block font-medium text-charcoal">Mission</span>To empower Kenyan farmers, artisans, and craftsmen by bridging the gap to the UK market through direct, transparent, and sustainable trade — ensuring exceptional skill and quality are rewarded with equitable value.</p>
          <p><span className="block font-medium text-charcoal">Vision</span>To be the premier gateway for Kenyan excellence in the United Kingdom, recognised for an unbroken chain of traceability connecting UK buyers directly to the farmers, artisans, and craftsmen behind the finest agricultural and hand-crafted goods.</p>
          <p><span className="block font-medium text-charcoal">Core Values</span>Transparency, fair value for makers, traceable Kenyan excellence, and long-term stewardship.</p>
          <p><span className="block font-medium text-charcoal">Contacts</span>Nottingham: Osmaston 10, NG7 1SD. Nairobi: Nairobi Garage – Karen, Watermark Business Park.</p>
        </div>

        {stories.length > 0 && (
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {stories.map((c) => (
              <article key={c.id} className="group h-full">
                <Link
                  to="/creators/$creatorId"
                  params={{ creatorId: c.id }}
                  className="block h-full rounded-2xl border border-border/60 bg-warm-white/85 p-3 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-sand-soft">
                    <LazyImage
                      src={c.image}
                      alt={`${c.fullName} — ${c.craft} from ${c.region}`}
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="px-1 pb-1 pt-3">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-terracotta">
                      {c.firstName} · {c.region}
                    </p>
                    <h3 className="mt-1.5 font-display text-[22px] leading-tight text-charcoal">
                      {c.craft}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{c.hook}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-clay">
                      See the story
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
