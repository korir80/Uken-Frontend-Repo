/**
 * Small SEO helpers for per-route <head> metadata.
 *
 * Use {@link routeSeo} inside a TanStack `head: () => ({ meta, links })`
 * to add a canonical link, og:url, twitter card, and a JSON-LD breadcrumb
 * trail without re-typing the boilerplate on every page.
 */

export const SITE_URL = "https://ukena.co.uk";

export type RouteSeoInput = {
  /** Path on the site, e.g. "/story" or "/products/p-mara-01". */
  path: string;
  title: string;
  description: string;
  /** Optional absolute or root-relative URL of the share image. */
  image?: string;
  /** og:type, default "website". Use "article" for editorial content. */
  type?: "website" | "article" | "profile" | "product";
  /** Breadcrumb trail rendered as JSON-LD. Last item should be the page. */
  breadcrumbs?: Array<{ name: string; path: string }>;
};

export type RouteSeoOutput = {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
  scripts: Array<{ type: string; children: string }>;
};

export function routeSeo(input: RouteSeoInput): RouteSeoOutput {
  const url = `${SITE_URL}${input.path}`;
  const image = input.image
    ? input.image.startsWith("http")
      ? input.image
      : `${SITE_URL}${input.image}`
    : `${SITE_URL}/og-image.jpg`;

  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: url },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
  ];

  const links: Array<Record<string, string>> = [
    { rel: "canonical", href: url },
  ];

  const scripts: Array<{ type: string; children: string }> = [];
  if (input.breadcrumbs && input.breadcrumbs.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: input.breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${b.path}`,
        })),
      }),
    });
  }

  return { meta, links, scripts };
}
