import { Link } from "@tanstack/react-router";

export function TraceabilityStrip() {
  return (
    <section className="bg-warm-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-10 border-y border-border py-12 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-16">
          <p className="section-label">Traceability</p>
          <div>
            <h2 className="font-display text-4xl leading-tight text-charcoal md:text-5xl">
              Scan it. Trace it. Trust it.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
              Every product on Ukena carries a QR code. Scan it and see the GPS coordinates of the farm, the export stamp date, and container seal verification. No marketing speak — just proof.
            </p>
            <Link
              to="/transparency"
              className="mt-7 inline-flex items-center rounded-sm bg-charcoal px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-warm-white transition-colors hover:bg-clay-deep"
            >
              How traceability works →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}