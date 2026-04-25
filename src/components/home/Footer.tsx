import { Link } from "@tanstack/react-router";
import { Divider } from "@/components/ukena";

const navColumns = [
  {
    heading: "Discover",
    links: [
      { label: "Explore Creators", href: "/creators" },
      { label: "The Journal", href: "/journal" },
      { label: "Collections", href: "/collections" },
      { label: "Gift a Story", href: "/gifts" },
    ],
  },
  {
    heading: "Uken",
    links: [
      { label: "Our Story", href: "/story" },
      { label: "For Artisans", href: "/artisans" },
      { label: "Traceability", href: "/transparency" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Press", href: "/press" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Substack", href: "https://substack.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-warm-white">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 md:px-10 md:pt-28">
        {/* Tagline */}
        <div className="mb-16 max-w-3xl md:mb-20">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[oklch(0.85_0.08_55)]">
            — Uken
          </p>
          <p className="mt-6 font-display text-[36px] leading-[1.1] tracking-tight text-warm-white md:text-5xl lg:text-[56px]">
            Connecting hands to hearts{" "}
            <em className="italic text-[oklch(0.88_0.06_55)]">
              across continents.
            </em>
          </p>
        </div>

        <Divider className="!bg-warm-white/15 !bg-none" />

        {/* Footer columns */}
        <div className="grid gap-12 py-14 lg:grid-cols-[1fr_0.95fr_1.15fr] lg:gap-14">
          {/* Nav links */}
          <div className="grid grid-cols-2 gap-10">
            {navColumns.map((col) => (
              <div key={col.heading}>
                <h4 className="text-[11px] uppercase tracking-[0.22em] text-warm-white/50">
                  {col.heading}
                </h4>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[15px] text-warm-white/85 transition-colors hover:text-[oklch(0.88_0.06_55)]"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social + contact */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-warm-white/50">
              Stay close
            </h4>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-warm-white/75">
              Letters from the workshops, once a month. No noise, no offers —
              just the makers.
            </p>

            <form
              className="mt-6 flex max-w-sm gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.co.uk"
                className="h-11 flex-1 rounded-md border border-warm-white/20 bg-transparent px-4 text-sm text-warm-white placeholder:text-warm-white/40 focus:border-[oklch(0.85_0.08_55)] focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 rounded-md bg-terracotta px-5 text-[13px] font-medium text-warm-white transition-colors hover:bg-[oklch(0.52_0.13_38)]"
              >
                Subscribe
              </button>
            </form>

            <div className="mt-10 flex flex-wrap gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] uppercase tracking-[0.22em] text-warm-white/70 transition-colors hover:text-[oklch(0.88_0.06_55)]"
                >
                  {s.label}
                </a>
              ))}
            </div>

            <p className="mt-6 text-[13px] text-warm-white/60 md:ml-auto">
              hello@ukena.co.uk
            </p>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-warm-white/50">
              Contact
            </h4>
            <div className="mt-5 space-y-4 text-[14px] leading-relaxed text-warm-white/72">
              <p>
                <span className="block font-medium text-warm-white/90">Head Office</span>
                Osmaston 10, NG7 1SD, Nottingham, UK | Andrew Soi: +44 7425 241649
              </p>
              <p>
                <span className="block font-medium text-warm-white/90">Nairobi Office</span>
                Nairobi Garage – Karen, Watermark Business Park, Ndege Rd. Off Langata Rd. | Edwin Agasa: +254 720 848 695
              </p>
              <p>Email: hello@ukena.co.uk</p>
            </div>
          </div>
        </div>

        <Divider className="!bg-warm-white/15 !bg-none" />

        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-[11px] uppercase tracking-[0.2em] text-warm-white/45 md:flex-row md:items-center">
          <span className="font-display text-2xl normal-case tracking-normal text-warm-white">
            Uken
          </span>
          <div className="flex flex-wrap gap-6">
            <a href="/privacy" className="hover:text-warm-white">Privacy</a>
            <a href="/terms" className="hover:text-warm-white">Terms</a>
            <Link to="/styleguide" className="hover:text-warm-white">Style Guide</Link>
          </div>
          <span>© {new Date().getFullYear()} Uken · Nottingham &amp; Nairobi</span>
        </div>
      </div>
    </footer>
  );
}
