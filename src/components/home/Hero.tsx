import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/**
 * Hero — dark cinematic, editorial.
 * Reduced height (min 520px desktop), wavy bottom divider,
 * tighter element balance, expanded product card with
 * creator + similar-pieces CTAs.
 */
export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#0D0805",
      }}
    >
      {/* 1 — Base warm gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, #2e1508 0%, #5a2e14 20%, #8a4820 45%, #6a3418 70%, #1e0e06 100%)",
        }}
      />

      {/* 2 — Woven crosshatch texture */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: 0.06,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,210,140,0.6) 0 1px, transparent 1px 7px), repeating-linear-gradient(-45deg, rgba(255,210,140,0.6) 0 1px, transparent 1px 7px)",
        }}
      />

      {/* 3 — Warm light bloom (top-right) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 78% 18%, rgba(190,130,55,0.16) 0%, rgba(190,130,55,0) 55%)",
        }}
      />

      {/* 4 — Directional vignette (anchors text to the left) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(13,8,5,0.97) 0%, rgba(13,8,5,0.72) 38%, rgba(13,8,5,0.22) 68%, rgba(13,8,5,0.5) 100%)",
        }}
      />

      {/* Content shell — snug, vertically centred */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-20 md:flex-row md:items-center md:justify-between md:px-10 md:py-24"
        style={{ minHeight: "520px" }}
      >
        {/* LEFT — copy block, tight grouping */}
        <div className="max-w-[560px] md:pl-[44px]">
          {/* Provenance line */}
          <div className="mb-7 flex items-center gap-3">
            <span
              aria-hidden
              className="block h-px"
              style={{ width: 28, backgroundColor: "#C4904A" }}
            />
            <span
              className="font-sans uppercase"
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "0.18em",
                color: "#C4904A",
              }}
            >
              Kenyan craft · World-class quality
            </span>
          </div>

          {/* Headline — three lines, italic accent */}
          <h1
            className="font-display"
            style={{
              fontWeight: 300,
              color: "#FAF7F2",
              margin: 0,
            }}
          >
            <span
              className="block text-[38px] md:text-[66px]"
              style={{ lineHeight: 1.02, letterSpacing: "-0.01em" }}
            >
              Crafted in
            </span>
            <span
              className="block italic text-[46px] md:text-[78px]"
              style={{
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#D4A96A",
                marginTop: -6,
              }}
            >
              Kenya.
            </span>
            <span
              className="block text-[38px] md:text-[66px]"
              style={{
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                marginTop: -4,
              }}
            >
              Made to last.
            </span>
          </h1>

          {/* Sub-copy */}
          <p
            className="mt-6 font-sans"
            style={{
              fontSize: 14,
              fontWeight: 300,
              lineHeight: 1.6,
              color: "rgba(250,247,242,0.5)",
              maxWidth: 460,
              marginBottom: 32,
            }}
          >
            Handmade by Kenya's finest — each piece built to the standard
            the world respects.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              to="/shop"
              className="group/cta inline-flex items-center justify-center font-sans uppercase transition-colors"
              style={{
                backgroundColor: "#D4A96A",
                color: "#0D0805",
                padding: "12px 28px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#C4904A")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#D4A96A")
              }
            >
              Shop collection
              <ArrowRight className="ml-2 h-3.5 w-3.5" strokeWidth={2} />
            </Link>

            <Link
              to="/explore"
              className="group/meet inline-flex items-center font-sans uppercase transition-colors"
              style={{
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: "0.07em",
                color: "rgba(250,247,242,0.45)",
                lineHeight: 1,
                paddingTop: 12,
                paddingBottom: 12,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(250,247,242,0.8)";
                const line = e.currentTarget.querySelector(
                  "[data-line]",
                ) as HTMLElement | null;
                if (line) line.style.width = "34px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(250,247,242,0.45)";
                const line = e.currentTarget.querySelector(
                  "[data-line]",
                ) as HTMLElement | null;
                if (line) line.style.width = "22px";
              }}
            >
              <span
                data-line
                aria-hidden
                className="mr-3 block h-px transition-all duration-300"
                style={{
                  width: 22,
                  backgroundColor: "rgba(250,247,242,0.25)",
                }}
              />
              Meet the makers
            </Link>
          </div>
        </div>

        {/* RIGHT — floating product card */}
        <div className="mt-10 md:mt-0 md:pr-[52px]">
          <FloatingProductCard />
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div
        aria-hidden
        className="absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span
          className="font-sans uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "rgba(250,247,242,0.2)",
          }}
        >
          Scroll
        </span>
        <span
          className="relative block overflow-hidden"
          style={{
            width: 1,
            height: 32,
            backgroundColor: "rgba(250,247,242,0.1)",
          }}
        >
          <span
            className="absolute left-0 top-0 block animate-[hero-scroll-cue_2s_ease-in-out_infinite]"
            style={{
              width: 1,
              height: 12,
              backgroundColor: "rgba(196,144,74,0.7)",
            }}
          />
        </span>
      </div>

      {/* Wavy bottom border — sits above bg, below text/card */}
      <svg
        aria-hidden
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 z-[5] block h-8 w-full md:h-12"
      >
        <path
          d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z"
          fill="#FAF7F2"
        />
      </svg>

      <style>{`
        @keyframes hero-scroll-cue {
          0%   { transform: translateY(-100%); }
          70%  { transform: translateY(220%); }
          100% { transform: translateY(220%); }
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * FloatingProductCard
 * ────────────────────────────────────────────────────────────────────── */
function FloatingProductCard() {
  return (
    <div
      className="group/card mx-auto block w-[calc(100%-32px)] transition-all duration-300 md:mx-0 md:w-[230px]"
      style={{
        backgroundColor: "rgba(18,10,5,0.78)",
        border: "1px solid rgba(212,169,106,0.2)",
        borderRadius: 14,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(212,169,106,0.38)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(212,169,106,0.2)")
      }
    >
      {/* Image / placeholder gradient */}
      <Link
        to="/shop"
        aria-label="Shop the collection"
        className="block"
        style={{
          height: 148,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          background:
            "linear-gradient(155deg, #C4904A 0%, #8B5020 55%, #4A2408 100%)",
        }}
      />

      {/* Body */}
      <div style={{ padding: "16px 18px 18px" }}>
        <p
          className="font-sans"
          style={{
            fontSize: 10,
            color: "rgba(212,169,106,0.65)",
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          by Wanjiru Kamau · Nairobi
        </p>
        <h3
          className="font-display"
          style={{
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.25,
            color: "#FAF7F2",
            margin: "6px 0 16px 0",
          }}
        >
          Maasai beaded collar necklace
        </h3>

        <div className="flex items-center justify-between">
          <span
            className="font-display"
            style={{ fontSize: 20, fontWeight: 400, color: "#FAF7F2" }}
          >
            £48
          </span>
          <Link
            to="/shop"
            className="font-sans uppercase transition-colors"
            style={{
              backgroundColor: "#D4A96A",
              color: "#0D0805",
              padding: "7px 14px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#C4904A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#D4A96A")
            }
          >
            Add to bag
          </Link>
        </div>

        {/* Divider + secondary card CTAs */}
        <div
          aria-hidden
          className="mt-4"
          style={{
            height: 1,
            backgroundColor: "rgba(212,169,106,0.15)",
          }}
        />
        <div className="flex flex-col gap-2 pt-3">
          <Link
            to="/creators/$creatorId"
            params={{ creatorId: "wanjiru-kamau" }}
            className="group/talent inline-flex items-center justify-between font-sans transition-colors"
            style={{
              fontSize: 11,
              letterSpacing: "0.03em",
              color: "rgba(212,169,106,0.75)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#D4A96A")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(212,169,106,0.75)")
            }
          >
            <span>Meet the talent behind this</span>
            <ArrowRight className="ml-2 h-3 w-3" strokeWidth={2} />
          </Link>
          <Link
            to="/shop"
            search={{ craft: "Beadwork", region: "All", sort: "newest", minPrice: undefined, maxPrice: undefined }}
            className="group/similar inline-flex items-center justify-between font-sans transition-colors"
            style={{
              fontSize: 11,
              letterSpacing: "0.03em",
              color: "rgba(250,247,242,0.4)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(250,247,242,0.75)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(250,247,242,0.4)")
            }
          >
            <span>See similar pieces</span>
            <ArrowRight className="ml-2 h-3 w-3" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
