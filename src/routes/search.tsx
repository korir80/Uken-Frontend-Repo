import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ExploreNav } from "@/components/explore/ExploreNav";
import { Footer } from "@/components/home/Footer";
import { CreatorCard } from "@/components/explore/CreatorCard";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import type { Product } from "@/components/product/product-data";
import type { Creator, Craft } from "@/components/explore/creators-data";
import {
  useAllProducts,
  useCreators,
  productsQueryOptions,
  creatorsQueryOptions,
} from "@/lib/queries";
import type { CreatorSummary, ProductDto } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  type: fallback(z.enum(["all", "products", "makers"]), "all").default("all"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(productsQueryOptions());
    queryClient.ensureQueryData(creatorsQueryOptions());
  },
  head: () => ({
    meta: [
      { title: "Search — UKEN" },
      {
        name: "description",
        content:
          "Search UKEN: find Kenyan coffee, tea, foods, textiles, craft, and makers by name, region, or material.",
      },
      { property: "og:title", content: "Search — UKEN" },
      {
        property: "og:description",
        content:
          "Search the UKEN marketplace for products, materials, regions, and makers.",
      },
    ],
  }),
  component: SearchPage,
});

/* ───────── adapters ───────── */

function asProduct(dto: ProductDto): Product {
  return dto as unknown as Product;
}
function asCreator(c: CreatorSummary, idx: number): Creator {
  return {
    id: c.id,
    firstName: c.firstName,
    fullName: c.fullName,
    craft: c.craft as Craft,
    region: c.region,
    hook: c.hook,
    image: c.image,
    emphasis: idx % 4 === 0 ? "tall" : "standard",
  };
}

/* ───────── scoring ─────────
 *
 * Goals (in priority order):
 *   1. Multi-token queries must AND across the document (every token has
 *      to land somewhere) — otherwise "sisal lamu" surfaces every sisal
 *      basket plus every Lamu maker, drowning the actual match.
 *   2. Field weighting — name > craft/region > materials > story.
 *   3. Position boost — token at the start of a field beats token in
 *      the middle.
 *   4. Token coverage tiebreaker — a doc that matched 3 tokens beats one
 *      that matched 1, even if the 1-token hit is exact.
 */

interface FieldScore {
  /** Per-token best position score in this field (0 if token missing). */
  perToken: number[];
  /** Field-level weight. */
  weight: number;
}

function tokenScoreInField(field: string, token: string): number {
  if (!field) return 0;
  const f = field.toLowerCase();
  // Word-boundary prefix is the strongest non-exact signal.
  if (f === token) return 100;
  if (f.startsWith(token)) return 75;
  // Match at the start of any whitespace-separated word.
  const wordStart = new RegExp(`(^|\\s)${escapeRegex(token)}`);
  if (wordStart.test(f)) return 55;
  if (f.includes(token)) return 30;
  return 0;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenize(q: string): string[] {
  return q
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function aggregate(scores: FieldScore[], tokens: string[]): number {
  if (tokens.length === 0) return 0;
  // For each token, take the best score across fields (weighted).
  let total = 0;
  let matchedTokens = 0;
  for (let i = 0; i < tokens.length; i++) {
    let bestForToken = 0;
    for (const fs of scores) {
      const raw = fs.perToken[i] ?? 0;
      const weighted = raw * fs.weight;
      if (weighted > bestForToken) bestForToken = weighted;
    }
    if (bestForToken > 0) matchedTokens++;
    total += bestForToken;
  }
  // AND-across-tokens: every token must appear somewhere. If even one is
  // missing, treat the whole document as no-match. This is the single
  // biggest precision win for multi-word queries.
  if (matchedTokens < tokens.length) return 0;
  // Coverage bonus rewards documents that hit more tokens directly.
  return total * (1 + 0.1 * matchedTokens);
}

function buildFieldScore(field: string | undefined, tokens: string[], weight: number): FieldScore {
  return {
    weight,
    perToken: tokens.map((t) => tokenScoreInField(field ?? "", t)),
  };
}

function scoreProduct(p: ProductDto, tokens: string[]): number {
  const fields: FieldScore[] = [
    buildFieldScore(p.name, tokens, 1.0),
    buildFieldScore(p.creator.fullName, tokens, 0.9),
    buildFieldScore(p.creator.craft, tokens, 0.85),
    buildFieldScore(p.creator.region, tokens, 0.8),
    buildFieldScore(p.materials.join(" "), tokens, 0.7),
    buildFieldScore(p.pieceStory, tokens, 0.4),
  ];
  return aggregate(fields, tokens);
}

function scoreCreator(c: CreatorSummary, tokens: string[]): number {
  const fields: FieldScore[] = [
    buildFieldScore(c.fullName, tokens, 1.0),
    buildFieldScore(c.firstName, tokens, 0.95),
    buildFieldScore(c.craft, tokens, 0.85),
    buildFieldScore(c.region, tokens, 0.8),
    buildFieldScore(c.hook, tokens, 0.4),
  ];
  return aggregate(fields, tokens);
}

/* ───────── page ───────── */

function SearchPage() {
  const navigate = Route.useNavigate();
  const { q, type } = Route.useSearch();
  const [draft, setDraft] = useState(q);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: rawProducts = [], isLoading: loadingProducts } =
    useAllProducts();
  const { data: rawCreators = [], isLoading: loadingCreators } = useCreators();

  // Keep input in sync with URL when navigating back/forward.
  useEffect(() => setDraft(q), [q]);

  // Auto-focus on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce URL updates so typing doesn't spam history.
  useEffect(() => {
    if (draft === q) return;
    const t = window.setTimeout(() => {
      navigate({
        search: (prev: { q: string; type: "all" | "products" | "makers" }) => ({
          ...prev,
          q: draft,
        }),
        replace: true,
      });
    }, 220);
    return () => window.clearTimeout(t);
  }, [draft, q, navigate]);

  const tokens = useMemo(() => tokenize(q), [q]);
  const isLoading = loadingProducts || loadingCreators;

  const productHits = useMemo(() => {
    if (tokens.length === 0) return [];
    return rawProducts
      .map((p) => ({ p, s: scoreProduct(p, tokens) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.p);
  }, [rawProducts, tokens]);

  const creatorHits = useMemo(() => {
    if (tokens.length === 0) return [];
    return rawCreators
      .map((c) => ({ c, s: scoreCreator(c, tokens) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  }, [rawCreators, tokens]);

  const showProducts = type === "all" || type === "products";
  const showMakers = type === "all" || type === "makers";

  const totalHits = productHits.length + creatorHits.length;

  // Quick suggestion chips when the search is empty — sourced from data.
  const suggestionChips = useMemo(() => {
    const crafts = Array.from(new Set(rawCreators.map((c) => c.craft))).slice(
      0,
      6,
    );
    return crafts;
  }, [rawCreators]);

  return (
    <div className="min-h-screen bg-warm-white">
      <ExploreNav />

      {/* Search header */}
      <section className="border-b border-border/60 bg-cream/40">
        <div className="mx-auto max-w-5xl px-5 py-12 md:px-10 md:py-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-terracotta">
            Search
          </p>
          <h1 className="mt-3 font-display text-[34px] leading-[1.05] tracking-tight text-charcoal md:text-[48px]">
            What are you looking for?
          </h1>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border/70 bg-warm-white px-4 py-3 shadow-soft focus-within:border-clay focus-within:ring-2 focus-within:ring-clay/15">
            <SearchIcon className="h-5 w-5 text-charcoal/50" />
            <input
              ref={inputRef}
              type="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Try ‘sisal basket’, ‘Lamu’, or ‘Wanjiru’"
              className="flex-1 bg-transparent font-sans text-[16px] text-charcoal placeholder:text-charcoal/40 focus:outline-none md:text-[18px]"
              aria-label="Search UKEN"
            />
            {draft && (
              <button
                type="button"
                onClick={() => setDraft("")}
                aria-label="Clear search"
                className="rounded-full p-1 text-charcoal/50 hover:bg-cream hover:text-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Type tabs */}
          {tokens.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {(
                [
                  { key: "all", label: `All · ${totalHits}` },
                  { key: "products", label: `Pieces · ${productHits.length}` },
                  { key: "makers", label: `Makers · ${creatorHits.length}` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() =>
                    navigate({
                      search: (prev: {
                        q: string;
                        type: "all" | "products" | "makers";
                      }) => ({ ...prev, type: tab.key }),
                    })
                  }
                  className={`rounded-full px-4 py-1.5 font-sans text-[12px] font-medium tracking-wide transition ${
                    type === tab.key
                      ? "bg-clay text-warm-white"
                      : "bg-warm-white text-charcoal/70 ring-1 ring-border/60 hover:bg-cream"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions when empty */}
          {tokens.length === 0 && suggestionChips.length > 0 && (
            <div className="mt-7">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                Try a craft
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setDraft(chip)}
                    className="rounded-full bg-warm-white px-4 py-1.5 font-sans text-[12px] text-charcoal/80 ring-1 ring-border/60 transition hover:bg-cream hover:text-charcoal"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
        {tokens.length === 0 ? (
          <EmptyHint />
        ) : isLoading ? (
          <ResultsSkeleton />
        ) : totalHits === 0 ? (
          <NoMatches query={q} />
        ) : (
          <div className="space-y-16">
            {showMakers && creatorHits.length > 0 && (
              <div>
                <header className="mb-6 flex items-baseline justify-between">
                  <h2 className="font-display text-2xl text-charcoal md:text-3xl">
                    Makers
                  </h2>
                  <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-ink-muted">
                    {creatorHits.length} found
                  </p>
                </header>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {creatorHits.map((c, i) => (
                    <CreatorCard
                      key={c.id}
                      creator={asCreator(c, i)}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {showProducts && productHits.length > 0 && (
              <div>
                <header className="mb-6 flex items-baseline justify-between">
                  <h2 className="font-display text-2xl text-charcoal md:text-3xl">
                    Pieces
                  </h2>
                  <p className="font-sans text-[12px] uppercase tracking-[0.22em] text-ink-muted">
                    {productHits.length} found
                  </p>
                </header>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {productHits.map((p, i) => (
                    <ShopProductCard
                      key={p.id}
                      product={asProduct(p)}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

/* ───────── states ───────── */

function EmptyHint() {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <p className="font-display text-2xl text-charcoal/80">
        Start typing to search.
      </p>
      <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-muted">
        Search across the catalogue and every maker in the index — by name,
        craft, region, or material.
      </p>
      <Link
        to="/explore"
        className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
      >
        Or browse all makers →
      </Link>
    </div>
  );
}

function NoMatches({ query }: { query: string }) {
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <p className="font-display text-2xl text-charcoal/80">
        No matches for “{query}”.
      </p>
      <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-muted">
        Try a broader term — a craft (basketry, beadwork) or a region (Lamu,
        Maragua) often surfaces more.
      </p>
      <Link
        to="/explore"
        className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-clay hover:text-clay-deep"
      >
        Browse all makers →
      </Link>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
