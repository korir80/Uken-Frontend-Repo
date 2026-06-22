import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { creatorQueryOptions } from "@/lib/queries";
import { LazyImage } from "@/components/ui/lazy-image";

interface Props {
  creatorId: string;
  summaryImage?: string;
  alt: string;
  className?: string;
  /** ms per slide */
  interval?: number;
}

function isUsable(u: unknown): u is string {
  if (!u || typeof u !== "string") return false;
  const s = u.trim();
  if (!s || s.startsWith("blob:")) return false;
  if (s.includes("placeholder") || s.includes("sample") || s.includes("/demo/")) return false;
  return true;
}

/**
 * Pulls every available image for a creator (portrait, header, cover, avatar,
 * process steps, product galleries) and cycles through them as a smooth
 * crossfading carousel. The illustrated fallback only ever appears if the
 * creator detail endpoint returns no usable imagery at all.
 */
export function CreatorImageCarousel({
  creatorId,
  summaryImage,
  alt,
  className,
  interval = 6000,
}: Props) {
  const { data: detail } = useQuery(creatorQueryOptions(creatorId));

  const images = useMemo(() => {
    const pool: (string | undefined)[] = [
      summaryImage,
      detail?.headerImage,
      detail?.portraitImage,
      (detail as { coverImage?: string } | undefined)?.coverImage,
      (detail as { avatar?: string } | undefined)?.avatar,
      detail?.image,
      ...((detail?.processSteps ?? []).map((s) => s.image)),
      ...((detail as { products?: { image?: string }[] } | undefined)?.products?.map(
        (p) => p?.image,
      ) ?? []),
      ...((detail as { gallery?: { src?: string }[] } | undefined)?.gallery?.map(
        (g) => g?.src,
      ) ?? []),
    ];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const u of pool) {
      if (!isUsable(u)) continue;
      if (seen.has(u)) continue;
      seen.add(u);
      out.push(u);
    }
    return out;
  }, [detail, summaryImage]);

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  // Single-image / empty case — let LazyImage handle fallback gracefully.
  if (images.length <= 1) {
    return (
      <LazyImage
        src={images[0]}
        alt={alt}
        wrapperClassName="h-full w-full"
        className={className}
      />
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: i === idx ? 1 : 0 }}
          aria-hidden={i === idx ? undefined : true}
        >
          <LazyImage
            src={src}
            alt={i === idx ? alt : ""}
            eager={i === 0}
            wrapperClassName="h-full w-full"
            className={`${className ?? ""} transition-transform ease-out`}
            style={{
              transform: i === idx ? "scale(1.06)" : "scale(1)",
              transitionDuration: `${interval + 1400}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
