import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/**
 * Hero — dark cinematic, editorial. Two CTAs only:
 *   PRIMARY  → /shop  (Shop collection)
 *   SECONDARY → /explore (Meet the makers)
 *
 * The site nav is rendered globally by <NavBar /> and overlays the hero
 * transparently. This component owns only the hero canvas + content.
 */
export function Hero() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#0D0805",
        minHeight: "100vh",
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

      {/* Content shell — vertically centred, full viewport on desktop */}
      <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center px-6 pb-16 pt-32 md:px-10 md:pt-28">
        <div className="grid gap-12 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
          {/* LEFT — copy block */}
          <div className="max-w-[560px] md:p-[44px] md:pl-0">
            {/* Provenance line */}
            <div className="mb-8 flex items-center gap-3">
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
                className="block text-[42px] md:text-[66px]"
                style={{ lineHeight: 1.02, letterSpacing: "-0.01em" }}
              >
                Crafted in
              </span>
              <span
                className="block italic text-[50px] md:text-[78px]"
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
                className="block text-[42px] md:text-[66px]"
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
              className="mt-7 font-sans"
              style={{
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.75,
                color: "rgba(250,247,242,0.5)",
                maxWidth: 360,
                marginBottom: 40,
              }}
            >
              Handmade by Kenya's finest — each piece built to the standard
              the world respects.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <Link
                to="/shop"
                className="group/cta inline-flex items-center justify-center font-sans uppercase transition-colors"
                style={{
                  backgroundColor: "#D4A96A",
                  color: "#0D0805",
                  padding: "14px 34px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
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

          {/* RIGHT — floating product card.
              On mobile it flows below the headline (full width minus 48px).
              On desktop it floats absolutely right-centred. */}
          <FloatingProductCard />
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
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
 * Desktop: absolute, right 52px, vertically centred.
 * Mobile : flows in document order, full width minus margin.
 * ────────────────────────────────────────────────────────────────────── */
function FloatingProductCard() {
  return (
    <Link
      to="/shop"
      className="group/card mx-auto block w-full max-w-[calc(100%-48px)] transition-all duration-300 md:absolute md:right-[52px] md:top-1/2 md:mx-0 md:w-[214px] md:max-w-none md:-translate-y-[52%] md:hover:-translate-y-[54%]"
      style={{
        backgroundColor: "rgba(18,10,5,0.78)",
        border: "1px solid rgba(212,169,106,0.18)",
        borderRadius: 14,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(212,169,106,0.35)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(212,169,106,0.18)")
      }
    >
      {/* Image / placeholder gradient */}
      <div
        aria-hidden
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
          <span
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
          </span>
        </div>
      </div>
    </Link>
  );
}
