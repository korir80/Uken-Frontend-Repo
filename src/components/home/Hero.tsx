import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, SectionLabel } from "@/components/ukena";
import { ArrowRight, Compass, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUkenaMode, type UkenaMode } from "@/lib/ukena-mode";
import heroImage from "@/assets/hero-artisan.jpg";

/**
 * Hero — two equal entry paths above the fold:
 *
 *   LEFT  (story mode) → Discover a creator → /explore
 *   RIGHT (shop  mode) → Browse the collection → /shop
 *
 * The user's last choice is persisted to localStorage as `ukena_mode`
 * (story | shop) and used to highlight their preferred path on return.
 * Both options remain visible and visually weighted; "preferred" is
 * communicated through a soft outline + label, never by hiding the other.
 */
export function Hero() {
  const { mode, setMode } = useUkenaMode();
  const [hovered, setHovered] = useState<UkenaMode | null>(null);

  // Track which side is "active" — hover wins, then persisted mode, else null.
  const active: UkenaMode | null = hovered ?? mode;

  // Defer first paint of the highlight until after hydration so SSR matches.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-charcoal md:h-[82vh] md:min-h-[560px]">
      {/* Fixed/parallax background — stays put as next section scrolls over */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <img
        src={heroImage}
        alt="A Kenyan artisan shaping a clay vessel at golden hour"
        className="sr-only"
      />

      {/* Vignettes — anchor content centre, keep image warmth */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/45 to-charcoal/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-charcoal/55" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-28 pt-24 md:min-h-0 md:px-10 md:pb-24 md:pt-32">
        <div className="max-w-3xl">
          <SectionLabel
            tone="terracotta"
            className="!text-[oklch(0.85_0.08_38)] before:!bg-[oklch(0.85_0.08_38)]"
          >
            Stories from Kenyan workshops
          </SectionLabel>

          <h1 className="mt-6 font-display text-[36px] leading-[1.06] tracking-tight text-warm-white sm:text-5xl md:mt-7 md:text-6xl lg:text-[76px]">
            Every piece carries{" "}
            <em className="italic text-[oklch(0.88_0.06_55)]">a story.</em>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-warm-white/80 md:mt-6 md:text-lg">
            Two ways in — meet the maker, or browse the collection. Either
            path leads to the same hands.
          </p>
        </div>

        {/* DUAL ENTRY PATHS — equal visual weight */}
        <div className="mt-10 grid w-full max-w-4xl gap-3 md:mt-12 md:grid-cols-2 md:gap-5">
          <PathCard
            mode="story"
            to="/explore"
            icon={<Compass className="h-5 w-5" />}
            eyebrow="Story mode"
            title="Discover a creator"
            sub="Begin with the maker. Their work follows."
            active={hydrated && active === "story"}
            onHover={() => setHovered("story")}
            onLeave={() => setHovered(null)}
            onChoose={() => setMode("story")}
          />
          <PathCard
            mode="shop"
            to="/shop"
            icon={<ShoppingBag className="h-5 w-5" />}
            eyebrow="Shop mode"
            title="Browse the collection"
            sub="Begin with the piece. The maker is one tap away."
            active={hydrated && active === "shop"}
            onHover={() => setHovered("shop")}
            onLeave={() => setHovered(null)}
            onChoose={() => setMode("shop")}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#creators"
        aria-label="Scroll to discover creators"
        className="group absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-3 text-warm-white/65 transition-colors hover:text-warm-white"
      >
        <span className="text-[10px] uppercase tracking-[0.32em]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-warm-white/25">
          <span className="absolute left-0 top-0 h-4 w-px animate-[scroll-cue_2.2s_ease-in-out_infinite] bg-warm-white" />
        </span>
      </a>

      <style>{`
        @keyframes scroll-cue {
          0% { transform: translateY(-100%); }
          60% { transform: translateY(200%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * PathCard — one of the two entry options. Equal visual weight; the
 * "active" state adds a soft amber outline + chip to mark the user's
 * preferred mode without diminishing the other choice.
 * ────────────────────────────────────────────────────────────────────── */
interface PathCardProps {
  mode: UkenaMode;
  to: "/explore" | "/shop";
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  sub: string;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
  onChoose: () => void;
}

function PathCard({
  to,
  icon,
  eyebrow,
  title,
  sub,
  active,
  onHover,
  onLeave,
  onChoose,
}: PathCardProps) {
  return (
    <Link
      to={to}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onChoose}
      className={cn(
        "group relative flex min-h-[44px] flex-col gap-3 rounded-2xl border p-5 backdrop-blur-md transition-all duration-300 md:p-6",
        "bg-charcoal/35 hover:bg-charcoal/45",
        active
          ? "border-[oklch(0.85_0.08_38)]/70 shadow-[0_0_0_1px_oklch(0.85_0.08_38/0.35),0_20px_40px_-20px_oklch(0.62_0.16_38/0.5)]"
          : "border-warm-white/15 hover:border-warm-white/35",
      )}
    >
      {/* "Your last choice" pip */}
      {active && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.85_0.08_38)]/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[oklch(0.92_0.06_55)] ring-1 ring-[oklch(0.85_0.08_38)]/40">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.85_0.08_38)]" />
          Your path
        </span>
      )}

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition-colors",
            active
              ? "bg-[oklch(0.85_0.08_38)]/20 text-[oklch(0.92_0.06_55)]"
              : "bg-warm-white/10 text-warm-white/85 group-hover:bg-warm-white/15",
          )}
        >
          {icon}
        </span>
        <span className="text-[10px] uppercase tracking-[0.32em] text-warm-white/65">
          {eyebrow}
        </span>
      </div>

      <h2 className="font-display text-2xl leading-tight text-warm-white md:text-3xl">
        {title}
      </h2>
      <p className="text-[13.5px] leading-relaxed text-warm-white/70 md:text-sm">
        {sub}
      </p>

      <span className="mt-2 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.22em] text-warm-white/85">
        Enter
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
