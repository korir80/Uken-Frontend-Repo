import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Sparkles, Heart, MessageCircle, Share2 } from "lucide-react";
import type { CreatorProfile } from "./creator-profile-data";
import { safeImg, hideBrokenImage } from "@/lib/safeImage";
import { cn } from "@/lib/utils";

/**
 * Social-media style creator profile.
 *
 * Single tight column (max-w-xl ~ 600px), Instagram/Substack feel:
 *   [ cover banner 3:1 ]
 *   [ avatar overlapping · name · craft · region ]
 *   [ bio + pull quote ]
 *   [ feed of "posts": story · process steps · meaning · products · related ]
 *
 * Images are sized to their slot (no forced upscaling), use lazy loading,
 * and keep their natural aspect via aspect-ratio classes — fixing the
 * previous "wide cover crop-forced to portrait" quality issue.
 */
export function CreatorSocialFeed({ creator }: { creator: CreatorProfile }) {
  const cover = safeImg(creator.coverImage);
  const avatar = safeImg(creator.avatar);

  return (
    <div className="bg-warm-white">
      {/* ── Cover banner ───────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-sand-soft">
        <div className="aspect-[3/1] w-full sm:aspect-[4/1]">
          {cover ? (
            <img
              src={cover}
              alt=""
              loading="eager"
              decoding="async"
              onError={hideBrokenImage}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-cream via-sand-soft to-terracotta/20" />
          )}
        </div>
      </div>

      {/* ── Profile column ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-xl px-4 sm:px-5">
        {/* Avatar + identity */}
        <header className="relative -mt-14 sm:-mt-16">
          <div className="flex items-end gap-4">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-warm-white bg-cream shadow-[var(--shadow-card)] sm:h-32 sm:w-32">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${creator.fullName}`}
                  loading="eager"
                  decoding="async"
                  onError={hideBrokenImage}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center font-display text-3xl text-terracotta">
                  {creator.firstName.charAt(0)}
                </div>
              )}
            </div>
            <div className="mb-2 flex-1">
              <p className="text-[10px] uppercase tracking-[0.22em] text-terracotta">
                UKEN Maker
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="font-display text-[32px] leading-[1.05] tracking-tight text-charcoal sm:text-[40px]">
              {creator.fullName}
            </h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-charcoal/70">
              <span className="font-medium text-clay-deep">{creator.craft}</span>
              <span className="text-charcoal/30">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {creator.region}
              </span>
            </p>
          </div>

          {creator.pullQuote && (
            <p className="mt-4 font-display text-[18px] italic leading-[1.45] text-charcoal/80">
              &ldquo;{creator.pullQuote}&rdquo;
            </p>
          )}

          {/* Quick actions */}
          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-charcoal px-5 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white transition hover:bg-clay-deep"
            >
              <Sparkles className="h-3.5 w-3.5" /> Follow
            </button>
            <Link
              to="/explore"
              className="inline-flex items-center rounded-full border border-border bg-warm-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-charcoal hover:bg-cream"
            >
              ← Makers
            </Link>
          </div>
        </header>

        <Divider />

        {/* ── Feed ─────────────────────────────────────────────────── */}
        <div className="space-y-4 pb-20">
          {/* Story posts */}
          {creator.storyParagraphs.map((para, i) => (
            <Post
              key={`story-${i}`}
              author={creator}
              kind="Story"
              delay={i * 0.04}
            >
              <p className="text-[15px] leading-[1.65] text-charcoal/90">
                {para}
              </p>
            </Post>
          ))}

          {/* Process post — image carousel of steps */}
          {creator.processSteps?.length > 0 && (
            <Post author={creator} kind="In the workshop">
              <p className="mb-3 text-[14px] leading-relaxed text-charcoal/80">
                A few moments from how I work — start to finish.
              </p>
              <ProcessCarousel steps={creator.processSteps} />
            </Post>
          )}

          {/* Cultural meaning posts */}
          {creator.culturalMeaning?.map((para, i) => (
            <Post
              key={`meaning-${i}`}
              author={creator}
              kind="Why this matters"
              delay={i * 0.04}
            >
              <p className="text-[15px] leading-[1.65] text-charcoal/90">
                {para}
              </p>
            </Post>
          ))}

          {/* Products post */}
          {creator.products?.length > 0 && (
            <Post author={creator} kind="From the workshop">
              <p className="mb-3 text-[14px] leading-relaxed text-charcoal/80">
                Pieces available now.
              </p>
              <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-5 sm:px-5">
                {creator.products.map((p) => (
                  <Link
                    key={p.id}
                    to="/products/$productId"
                    params={{ productId: p.id }}
                    className="group block w-[55%] shrink-0 snap-start"
                  >
                    <div className="overflow-hidden rounded-xl bg-sand-soft">
                      <img
                        src={safeImg(p.image)}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        onError={hideBrokenImage}
                        className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <p className="truncate font-display text-[15px] text-charcoal">
                        {p.name}
                      </p>
                      <span className="shrink-0 text-[13px] text-clay-deep">
                        {p.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Post>
          )}

          {/* Related makers */}
          {creator.relatedCreators?.length > 0 && (
            <Post author={creator} kind="Suggested makers">
              <ul className="space-y-3">
                {creator.relatedCreators.map((rel) => (
                  <li key={rel.id}>
                    <Link
                      to="/creators/$creatorId"
                      params={{ creatorId: rel.id }}
                      className="group flex items-center gap-3 rounded-xl p-2 -m-2 transition hover:bg-cream"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-sand-soft">
                        <img
                          src={safeImg(rel.image)}
                          alt=""
                          loading="lazy"
                          onError={hideBrokenImage}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-charcoal">
                          {rel.firstName}
                        </p>
                        <p className="truncate text-[12px] text-charcoal/60">
                          {rel.craft} · {rel.region}
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-clay group-hover:text-clay-deep">
                        View →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Post>
          )}
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-6 h-px w-full bg-border/60" />;
}

function Post({
  author,
  kind,
  children,
  delay = 0,
}: {
  author: CreatorProfile;
  kind: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-border/60 bg-cream/40"
    >
      {/* post header */}
      <header className="flex items-center gap-3 px-4 pt-4 sm:px-5">
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-sand-soft">
          <img
            src={safeImg(author.avatar)}
            alt=""
            loading="lazy"
            onError={hideBrokenImage}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-charcoal">
            {author.firstName}
          </p>
          <p className="truncate text-[10px] uppercase tracking-[0.2em] text-terracotta">
            {kind}
          </p>
        </div>
      </header>

      {/* post body */}
      <div className="px-4 py-4 sm:px-5">{children}</div>

      {/* post actions */}
      <footer className="flex items-center gap-4 border-t border-border/40 px-4 py-2.5 text-charcoal/55 sm:px-5">
        <button type="button" className="flex items-center gap-1.5 text-[12px] hover:text-clay">
          <Heart className="h-4 w-4" /> Like
        </button>
        <button type="button" className="flex items-center gap-1.5 text-[12px] hover:text-clay">
          <MessageCircle className="h-4 w-4" /> Reply
        </button>
        <button type="button" className="ml-auto flex items-center gap-1.5 text-[12px] hover:text-clay">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </footer>
    </motion.article>
  );
}

function ProcessCarousel({
  steps,
}: {
  steps: { image: string; caption: string }[];
}) {
  return (
    <div className="-mx-4 sm:-mx-5">
      <ol className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:px-5">
        {steps.map((step, i) => (
          <li
            key={i}
            className={cn(
              "w-[78%] shrink-0 snap-start",
              steps.length === 1 && "w-full",
            )}
          >
            <figure className="overflow-hidden rounded-xl bg-sand-soft">
              <img
                src={safeImg(step.image)}
                alt=""
                loading="lazy"
                decoding="async"
                onError={hideBrokenImage}
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="bg-warm-white/95 px-3 py-2.5 text-[13px] leading-snug text-charcoal/85">
                <span className="mr-2 font-display text-[13px] text-terracotta/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step.caption || "Untitled moment"}
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </div>
  );
}
