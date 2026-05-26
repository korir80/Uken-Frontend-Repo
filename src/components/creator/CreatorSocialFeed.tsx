import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MapPin, Heart, MessageCircle, Share2, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { CreatorProfile } from "./creator-profile-data";
import { safeImg, hideBrokenImage } from "@/lib/safeImage";

/**
 * Social-media style creator profile (Instagram-tight: max-w-xl, ~600px).
 *
 * Image rules:
 *  - Cover banner: native aspect, height-bounded so very tall images don't
 *    eat the viewport. Background colour shows if the source is narrower
 *    than the column.
 *  - Avatar: round, never upscaled past 128px.
 *  - Workshop & product images: rendered at native aspect (`h-auto`), so a
 *    portrait phone shot stays portrait and a wide DSLR crop stays wide.
 *
 * No Follow button — the buyer actions are "Shop their work" and "Back to
 * makers". Set `isPreview` to disable navigation in the editor preview.
 */
export interface CreatorSocialFeedProps {
  creator: CreatorProfile;
  isPreview?: boolean;
}

export function CreatorSocialFeed({ creator, isPreview }: CreatorSocialFeedProps) {
  const cover = safeImg(creator.coverImage);
  const avatar = safeImg(creator.avatar);

  // Build a single gallery (cover + workshop + product images) for the lightbox.
  const gallery: { src: string; caption?: string }[] = [
    ...(cover ? [{ src: cover, caption: `${creator.fullName} — cover` }] : []),
    ...creator.processSteps.map((s) => ({ src: safeImg(s.image) || "", caption: s.caption })),
    ...creator.products.map((p) => ({ src: safeImg(p.image) || "", caption: p.name })),
  ].filter((g) => g.src);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = (src: string) => {
    const idx = gallery.findIndex((g) => g.src === src);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  return (
    <div className="bg-warm-white">
      {/* ── Cover banner — native aspect, max-height bounded ─────────── */}
      <div className="relative w-full overflow-hidden bg-sand-soft">
        {cover ? (
          <button
            type="button"
            onClick={() => openLightbox(cover)}
            className="block w-full cursor-zoom-in"
            aria-label="Open cover image"
          >
            <img
              src={cover}
              alt=""
              loading="eager"
              decoding="async"
              onError={hideBrokenImage}
              className="mx-auto block max-h-[38vh] w-full max-w-5xl object-cover"
            />
          </button>
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-cream via-sand-soft to-terracotta/20 sm:h-56" />
        )}
      </div>


      {/* ── Profile column ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        {/* Avatar + identity */}
        <header className="relative -mt-12 sm:-mt-14">
          <div className="flex items-end gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-warm-white bg-cream shadow-[var(--shadow-card)] sm:h-28 sm:w-28">
              {avatar ? (
                <img
                  src={avatar}
                  alt={creator.fullName}
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
            <h1 className="font-display text-[28px] leading-[1.05] tracking-tight text-charcoal sm:text-[36px]">
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
            <p className="mt-4 font-display text-[17px] italic leading-[1.45] text-charcoal/80 sm:text-[18px]">
              &ldquo;{creator.pullQuote}&rdquo;
            </p>
          )}

          {/* Quick actions — no Follow */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {creator.products.length > 0 &&
              (isPreview ? (
                <span className="inline-flex items-center rounded-full bg-charcoal px-5 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white opacity-70">
                  Shop their work
                </span>
              ) : (
                <a
                  href={`#products-${creator.id}`}
                  className="inline-flex items-center rounded-full bg-charcoal px-5 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-warm-white transition hover:bg-clay-deep"
                >
                  Shop their work
                </a>
              ))}
            {isPreview ? (
              <span className="inline-flex items-center rounded-full border border-border bg-warm-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-charcoal opacity-70">
                ← Makers
              </span>
            ) : (
              <Link
                to="/explore"
                className="inline-flex items-center rounded-full border border-border bg-warm-white px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] text-charcoal hover:bg-cream"
              >
                ← Makers
              </Link>
            )}
          </div>
        </header>

        <div className="my-6 h-px w-full bg-border/60" />

        {/* ── Feed ─────────────────────────────────────────────────── */}
        <div className="space-y-4 pb-16">
          {creator.storyParagraphs.length === 0 &&
            creator.processSteps.length === 0 &&
            creator.products.length === 0 && (
              <EmptyHint />
            )}

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

          {/* Workshop gallery — tight 2-col thumbnails, click to enlarge */}
          {creator.processSteps.length > 0 && (
            <Post author={creator} kind="In the workshop">
              <p className="mb-3 text-[14px] leading-relaxed text-charcoal/80">
                A few moments from how I work — tap any photo to view full size.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {creator.processSteps.map((step, i) => {
                  const src = safeImg(step.image) || "";
                  return (
                    <figure key={`${step.image}-${i}`} className="overflow-hidden rounded-lg bg-sand-soft">
                      <button
                        type="button"
                        onClick={() => src && openLightbox(src)}
                        className="block w-full cursor-zoom-in"
                        aria-label={step.caption || `Workshop photo ${i + 1}`}
                      >
                        <img
                          src={src}
                          alt={step.caption}
                          loading="lazy"
                          decoding="async"
                          onError={hideBrokenImage}
                          className="block aspect-square h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                        />
                      </button>
                      {step.caption && (
                        <figcaption className="px-2 py-1.5 text-[11px] leading-snug text-charcoal/75">
                          <span className="mr-1 font-display text-[11px] text-terracotta/80">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {step.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            </Post>
          )}


          {/* Cultural meaning */}
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

          {/* Products */}
          {creator.products.length > 0 && (
            <div id={`products-${creator.id}`} className="scroll-mt-24">
              <Post author={creator} kind="From the workshop">
                <p className="mb-3 text-[14px] leading-relaxed text-charcoal/80">
                  Pieces available now.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {creator.products.map((p) => {
                    const inner = (
                      <>
                        <div className="overflow-hidden rounded-xl bg-sand-soft">
                          <img
                            src={safeImg(p.image)}
                            alt={p.name}
                            loading="lazy"
                            decoding="async"
                            onError={hideBrokenImage}
                            className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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
                      </>
                    );
                    return isPreview ? (
                      <div key={p.id} className="group block">
                        {inner}
                      </div>
                    ) : (
                      <Link
                        key={p.id}
                        to="/products/$productId"
                        params={{ productId: p.id }}
                        className="group block"
                      >
                        {inner}
                      </Link>
                    );
                  })}
                </div>
              </Post>
            </div>
          )}

          {/* Related makers */}
          {creator.relatedCreators.length > 0 && (
            <Post author={creator} kind="Suggested makers">
              <ul className="space-y-3">
                {creator.relatedCreators.map((rel) => {
                  const row = (
                    <>
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
                    </>
                  );
                  return (
                    <li key={rel.id}>
                      {isPreview ? (
                        <div className="group flex items-center gap-3 rounded-xl p-2 -m-2">
                          {row}
                        </div>
                      ) : (
                        <Link
                          to="/creators/$creatorId"
                          params={{ creatorId: rel.id }}
                          className="group flex items-center gap-3 rounded-xl p-2 -m-2 transition hover:bg-cream"
                        >
                          {row}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Post>
          )}
        </div>
      </div>

      <Lightbox
        items={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndex={setLightboxIndex}
      />
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: { src: string; caption?: string }[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  useEffect(() => {
    if (index == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {index != null && items[index] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/92 p-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-warm-white/10 p-2 text-warm-white hover:bg-warm-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + items.length) % items.length); }}
                className="absolute left-4 rounded-full bg-warm-white/10 p-2 text-warm-white hover:bg-warm-white/20"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % items.length); }}
                className="absolute right-16 rounded-full bg-warm-white/10 p-2 text-warm-white hover:bg-warm-white/20"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <motion.figure
            key={items[index].src}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[92vh] max-w-[92vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={items[index].src}
              alt={items[index].caption ?? ""}
              className="max-h-[88vh] max-w-[92vw] object-contain"
            />
            {items[index].caption && (
              <figcaption className="mt-3 text-center text-[13px] text-warm-white/85">
                {items[index].caption}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function EmptyHint() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-cream/40 px-5 py-8 text-center">
      <p className="font-display text-[18px] text-charcoal">
        Your story is almost ready.
      </p>
      <p className="mt-2 text-[13px] text-charcoal/65">
        Add a paragraph or two, a few workshop photos, and your products will
        appear here automatically.
      </p>
    </div>
  );
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

      <div className="px-4 py-4 sm:px-5">{children}</div>

      <footer
        aria-hidden="true"
        className="pointer-events-none flex items-center gap-4 border-t border-border/40 px-4 py-2.5 text-charcoal/30 opacity-40 sm:px-5"
      >
        <span className="flex items-center gap-1.5 text-[12px]">
          <Heart className="h-4 w-4" /> Like
        </span>
        <span className="flex items-center gap-1.5 text-[12px]">
          <MessageCircle className="h-4 w-4" /> Reply
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[12px]">
          <Share2 className="h-4 w-4" /> Share
        </span>
      </footer>
    </motion.article>
  );
}
