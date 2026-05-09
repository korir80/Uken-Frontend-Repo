import { useEffect, useRef, useState, useMemo, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  /** Aspect ratio wrapper (e.g. "4/5"). Optional — omit to let parent control sizing. */
  ratio?: string;
  /** Disable IntersectionObserver and load immediately (for above-the-fold). */
  eager?: boolean;
  /** Class applied to the outer wrapper (controls layout/size). */
  wrapperClassName?: string;
  /**
   * Hint for the rendered display width (CSS px). Used to build a tighter
   * Cloudinary `w_…` value so we don't ship 2400px assets into a 240px card.
   * If omitted we emit a responsive srcset across common card/hero widths.
   */
  displayWidth?: number;
}

const CLOUDINARY_HOST = "res.cloudinary.com";

/**
 * Insert Cloudinary transformations after the `/upload/` segment of a delivery URL.
 * Returns the original URL untouched if it isn't a Cloudinary URL or if a
 * transformation segment is already present (we don't want to clobber explicit
 * crops / overlays the caller has set up).
 */
function withCloudinaryTransform(url: string, transform: string): string {
  if (!url || !url.includes(CLOUDINARY_HOST)) return url;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  const after = url.slice(idx + marker.length);
  // If the next segment starts with a known transform char, it's already transformed.
  // Cloudinary transforms always start with one of these letter prefixes followed by `_`.
  if (/^[a-z]{1,3}_[^/]+\//.test(after)) return url;
  return `${url.slice(0, idx + marker.length)}${transform}/${after}`;
}

const RESPONSIVE_WIDTHS = [320, 480, 640, 800, 1080, 1440, 1920];

interface CloudinarySources {
  src: string;
  srcSet?: string;
}

function buildCloudinarySources(
  url: string,
  displayWidth?: number,
): CloudinarySources {
  if (!url.includes(CLOUDINARY_HOST)) return { src: url };

  // Always-on optimisations: auto format (webp/avif when supported) + auto quality.
  const base = "f_auto,q_auto";

  if (displayWidth) {
    // Ship a 1x and 2x for retina, capped at 1920 to avoid absurd payloads.
    const w1 = Math.min(displayWidth, 1920);
    const w2 = Math.min(displayWidth * 2, 1920);
    const src = withCloudinaryTransform(url, `${base},w_${w1},c_limit,dpr_auto`);
    if (w2 === w1) return { src };
    const srcSet = [
      `${withCloudinaryTransform(url, `${base},w_${w1},c_limit`)} 1x`,
      `${withCloudinaryTransform(url, `${base},w_${w2},c_limit`)} 2x`,
    ].join(", ");
    return { src, srcSet };
  }

  // Generic responsive ladder when no explicit display width is known.
  const src = withCloudinaryTransform(url, `${base},w_1080,c_limit`);
  const srcSet = RESPONSIVE_WIDTHS.map(
    (w) => `${withCloudinaryTransform(url, `${base},w_${w},c_limit`)} ${w}w`,
  ).join(", ");
  return { src, srcSet };
}

/**
 * LazyImage — defers network fetch until the image scrolls near the viewport
 * and reveals it with a soft fade + shimmer placeholder.
 *
 * For Cloudinary-hosted assets it automatically applies `f_auto,q_auto` and
 * a responsive srcset so we never ship a 2400px master to a 240px card.
 * Non-Cloudinary URLs are passed through untouched.
 */
export function LazyImage({
  src,
  alt,
  ratio,
  eager = false,
  className,
  wrapperClassName,
  loading,
  displayWidth,
  sizes,
  ...rest
}: LazyImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (eager || inView) return;
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [eager, inView]);

  const isUsableSrc =
    !!src &&
    !src.includes("cloudinary.com/demo") &&
    !src.includes("/demo/") &&
    !src.includes("sample") &&
    !src.includes("placeholder");

  const cloud = useMemo(
    () => (isUsableSrc ? buildCloudinarySources(src as string, displayWidth) : { src: "" }),
    [isUsableSrc, src, displayWidth],
  );

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative overflow-hidden bg-cream",
        wrapperClassName,
      )}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {/* Shimmer placeholder — fades out once image is loaded */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(110deg,oklch(0.95_0.012_78)_8%,oklch(0.88_0.025_70)_18%,oklch(0.95_0.012_78)_33%)] bg-[length:200%_100%] animate-[ukena-shimmer_1.6s_ease-in-out_infinite]" />
      </div>

      {inView && isUsableSrc && (
        <img
          src={cloud.src}
          srcSet={cloud.srcSet}
          sizes={sizes ?? (cloud.srcSet ? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" : undefined)}
          alt={alt}
          loading={loading ?? (eager ? "eager" : "lazy")}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out",
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]",
            className,
          )}
          {...rest}
        />
      )}

      <style>{`
        @keyframes ukena-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
