import { useEffect, useState } from "react";
import { QuoteGlyph } from "./icons";
import backdrop from "@/assets/authentic-craft-market.jpg";

interface Quote {
  text: string;
  name: string;
  role: string;
}

const QUOTES: Quote[] = [
  {
    text: "We do not make objects. We make the hours that hold them — and the hands that remember the making.",
    name: "Wanjiru Kamau",
    role: "Basket Weaver · Maragua, Kenya",
  },
  {
    text: "Each colour is a word. When I bead, I am writing the things my elders never had time to put down.",
    name: "Naserian Lekishon",
    role: "Maa Beadwork Artist · Kajiado",
  },
  {
    text: "The clay knows the shape before my hands do. I only listen, and try not to interrupt.",
    name: "Akinyi Otieno",
    role: "Potter · Kisumu",
  },
  {
    text: "A good bag should remember the shape of its owner. That is why I refuse the machine.",
    name: "Aluoch Ondieki",
    role: "Leatherworker · Nairobi",
  },
  {
    text: "I carve against the grain so the wood opens slowly. Patience is the only tool that never dulls.",
    name: "Otieno Ouma",
    role: "Woodcarver · Lamu Old Town",
  },
  {
    text: "The bees taught me that sweetness is a long, quiet kind of work — never hurried, never wasted.",
    name: "Kibet Cheruiyot",
    role: "Beekeeper · Mwingi, Kitui",
  },
];

/**
 * Picks a quote that rotates each visit. We persist the last index in
 * sessionStorage so a hard refresh during one session doesn't re-pick
 * the same one, but a new tab/visit cycles forward.
 */
function pickQuote(): Quote {
  if (typeof window === "undefined") return QUOTES[0];
  try {
    const last = Number(window.sessionStorage.getItem("ukena:quote-idx") ?? "-1");
    let next = Math.floor(Math.random() * QUOTES.length);
    if (QUOTES.length > 1 && next === last) {
      next = (next + 1) % QUOTES.length;
    }
    window.sessionStorage.setItem("ukena:quote-idx", String(next));
    return QUOTES[next];
  } catch {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
  }
}

export function QuotePullout() {
  // Start with index 0 for SSR-stable markup, then swap in the rotating
  // quote on the client after mount to avoid hydration mismatch.
  const [quote, setQuote] = useState<Quote>(QUOTES[0]);

  useEffect(() => {
    setQuote(pickQuote());
  }, []);

  return (
    <section className="relative overflow-hidden bg-clay-deep py-28 md:py-36">
      {/* Parallax photographic backdrop — fixed on desktop so foreground sections scroll over */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{ backgroundImage: `url(${backdrop})` }}
      />
      {/* Heavy warm wash so the quote stays the focus */}
      <div className="absolute inset-0 bg-clay-deep/80" />

      {/* Subtle warm noise / texture via radial gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.55 0.13 47 / 0.6), transparent 60%), radial-gradient(ellipse at 75% 80%, oklch(0.42 0.1 38 / 0.5), transparent 55%)",
        }}
      />
      {/* Faint grain via dotted texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <QuoteGlyph className="mx-auto h-10 w-14 text-[oklch(0.85_0.08_55)] opacity-80 md:h-12 md:w-16" />

        <blockquote
          key={quote.name}
          className="mt-10 animate-in fade-in duration-700"
        >
          <p className="font-display text-[30px] italic leading-[1.2] text-warm-white sm:text-4xl md:text-5xl lg:text-[56px]">
            &ldquo;{quote.text}&rdquo;
          </p>
        </blockquote>

        <div className="mt-12 flex flex-col items-center gap-3">
          <span className="h-px w-12 bg-[oklch(0.85_0.08_55)]/60" />
          <p className="font-display text-xl text-warm-white">{quote.name}</p>
          <p className="text-[11px] uppercase tracking-[0.28em] text-warm-white/60">
            {quote.role}
          </p>
        </div>
      </div>
    </section>
  );
}
