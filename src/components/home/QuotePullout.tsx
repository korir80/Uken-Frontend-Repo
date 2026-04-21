import { QuoteGlyph } from "./icons";

export function QuotePullout() {
  return (
    <section className="relative overflow-hidden bg-clay-deep py-28 md:py-36">
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

        <blockquote className="mt-10">
          <p className="font-display text-[30px] italic leading-[1.2] text-warm-white sm:text-4xl md:text-5xl lg:text-[56px]">
            "We do not make objects. We make the hours that hold them — and the
            hands that remember the making."
          </p>
        </blockquote>

        <div className="mt-12 flex flex-col items-center gap-3">
          <span className="h-px w-12 bg-[oklch(0.85_0.08_55)]/60" />
          <p className="font-display text-xl text-warm-white">
            Wanjiru Kamau
          </p>
          <p className="text-[11px] uppercase tracking-[0.28em] text-warm-white/60">
            Basket Weaver · Maragua, Kenya
          </p>
        </div>
      </div>
    </section>
  );
}
