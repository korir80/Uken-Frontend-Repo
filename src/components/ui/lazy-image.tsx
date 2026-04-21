import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Aspect ratio wrapper (e.g. "4/5"). Optional — omit to let parent control sizing. */
  ratio?: string;
  /** Disable IntersectionObserver and load immediately (for above-the-fold). */
  eager?: boolean;
  /** Class applied to the outer wrapper (controls layout/size). */
  wrapperClassName?: string;
}

/**
 * LazyImage — defers network fetch until the image scrolls near the viewport
 * and reveals it with a soft fade + shimmer placeholder.
 *
 * On-brand: warm cream skeleton, terracotta sweep, no spinners.
 */
export function LazyImage({
  src,
  alt,
  ratio,
  eager = false,
  className,
  wrapperClassName,
  loading,
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

      {inView && (
        <img
          src={src}
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
