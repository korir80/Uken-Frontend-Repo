import { Link } from "@tanstack/react-router";
import { Divider, Logo } from "@/components/ukena";

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
    heading: "UKEN",
    links: [
      { label: "About UKEN", href: "/about" },
      { label: "Mission & Vision", href: "/story" },
      { label: "Core Values", href: "/sustainability" },
      { label: "For Artisans", href: "/artisans" },
      { label: "Traceability", href: "/transparency" },
      { label: "Contacts", href: "/contact" },
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
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 md:px-10 md:pt-16">
        {/* Tagline */}
        <div className="mb-9 max-w-3xl md:mb-12">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[oklch(0.85_0.08_55)]">
            — UKEN
          </p>
          <p className="mt-3 font-display text-[30px] leading-[1.1] tracking-tight text-warm-white md:text-[40px] lg:text-[46px]">
            Connecting hands to hearts{" "}
            <em className="italic text-[oklch(0.88_0.06_55)]">
              across continents.
            </em>
          </p>
        </div>

        <Divider className="!bg-warm-white/15 !bg-none" />

        {/* Footer columns */}
        <div className="grid gap-8 py-9 lg:grid-cols-[1fr_0.95fr_1.15fr] lg:gap-10">
          {/* Nav links */}
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {navColumns.map((col) => (
              <div key={col.heading}>
                <h4 className="text-[11px] uppercase tracking-[0.22em] text-warm-white/50">
                  {col.heading}
                </h4>
                <ul className="mt-4 space-y-2.5">
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
              className="mt-4 flex max-w-sm flex-col gap-2 min-[360px]:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const consent = (form.elements.namedItem("nl-consent") as HTMLInputElement | null)?.checked;
                if (!consent) {
                  alert("Please tick the consent box to subscribe.");
                  return;
                }
                form.reset();
              }}
            >
              <input
                type="email"
                placeholder="your@email.co.uk"
                required
                className="h-11 min-w-0 flex-1 rounded-md border border-warm-white/20 bg-transparent px-4 text-sm text-warm-white placeholder:text-warm-white/40 focus:border-[oklch(0.85_0.08_55)] focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 rounded-md bg-terracotta px-5 text-[13px] font-medium text-warm-white transition-colors hover:bg-[oklch(0.52_0.13_38)]"
              >
                Subscribe
              </button>
            </form>

            <label className="mt-3 flex max-w-sm cursor-pointer items-start gap-2 text-[11px] leading-relaxed text-warm-white/65">
              <input
                name="nl-consent"
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-terracotta"
              />
              <span>
                I'd like UKEN's monthly letter and agree my email may be kept
                for that purpose. I can unsubscribe anytime. (
                <Link to="/privacy" className="underline hover:text-warm-white">
                  Privacy
                </Link>
                )
              </span>
            </label>

            <div className="mt-6 flex flex-wrap gap-4">
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

          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.22em] text-warm-white/50">
              Contact
            </h4>
            <div className="mt-4 space-y-5 text-[13px] leading-relaxed text-warm-white/72 md:text-[14px]">
              <div>
                <span className="block font-medium text-warm-white/90">Head Office</span>
                <p className="mt-1.5">Osmaston 10, NG7 1SD, Nottingham, UK</p>
                <p className="mt-0.5">Andrew Soi</p>
                <p className="mt-1">+44 7425 241649</p>
              </div>
              <div>
                <span className="block font-medium text-warm-white/90">Nairobi Office</span>
                <p className="mt-1.5">8th Floor, Pinetree Plaza, Kaburu Drive, Off Ngong Road, Nairobi, Kenya</p>
                <p className="mt-0.5">Edwin Agasa</p>
                <p className="mt-1">+254 720 848 695</p>
              </div>
            </div>
          </div>
        </div>

        <Divider className="!bg-warm-white/15 !bg-none" />

        <div className="flex flex-col items-start justify-between gap-3 pt-6 text-[10px] uppercase tracking-[0.18em] text-warm-white/45 md:flex-row md:items-center">
          <Logo variant="light" className="h-[60px]" />

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-warm-white">Privacy</Link>
            <Link to="/terms" className="hover:text-warm-white">Terms</Link>
            <Link to="/refunds" className="hover:text-warm-white">Refunds</Link>
            <Link to="/styleguide" className="hover:text-warm-white">Style Guide</Link>
          </div>
          <span>© {new Date().getFullYear()} UKEN · Nottingham &amp; Nairobi</span>
        </div>
      </div>
    </footer>
  );
}
