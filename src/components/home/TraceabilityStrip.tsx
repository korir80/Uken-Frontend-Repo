import { Link } from "@tanstack/react-router";

export function TraceabilityStrip() {
  return (
    <section className="bg-warm-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-6 border-y border-border py-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-10">
          <p className="section-label">Traceability</p>
          <div>
            <h2 className="font-display text-[32px] leading-tight text-charcoal md:text-[42px]">
              Scan it. Trace it. Trust it.
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-ink-muted md:text-[15px]">
              Every product on UKEN carries a QR code. Scan it and see the GPS coordinates of the farm, the export stamp date, and container seal verification. No marketing speak — just proof.
            </p>
            <Link
              to="/transparency"
              className="mt-5 inline-flex items-center rounded-sm bg-charcoal px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-warm-white transition-colors hover:bg-clay-deep"
            >
              How traceability works →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}