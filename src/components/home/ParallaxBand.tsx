import savanna from "@/assets/authentic-savanna.jpg";

/**
 * Mid-page parallax band. Background is fixed so foreground sections
 * scroll over the image — a "breath" moment between editorial blocks.
 */
export function ParallaxBand() {
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-charcoal">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center md:bg-fixed"
        style={{ backgroundImage: `url(${savanna})` }}
      />
      <img src={savanna} alt="A Maasai herder leading cattle through the Mara at dawn" className="sr-only" />

      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/25 to-charcoal/55" />

      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-warm-white/85">
          From the land they belong to
        </span>
        <p className="mt-7 font-display text-3xl italic leading-tight text-warm-white md:text-5xl lg:text-[56px]">
          “Every piece begins where the maker stands —{" "}
          <span className="text-[oklch(0.88_0.06_55)]">in the soil, the herd, the morning light.”</span>
        </p>
      </div>
    </section>
  );
}
