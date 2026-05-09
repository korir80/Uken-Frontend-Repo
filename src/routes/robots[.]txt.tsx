import { createFileRoute } from "@tanstack/react-router";

const SITE = "https://ukena.co.uk";

const BODY = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /account
Disallow: /account/
Disallow: /creator
Disallow: /creator/
Disallow: /checkout
Disallow: /checkout/
Disallow: /bag
Disallow: /signin
Disallow: /signup
Disallow: /join
Disallow: /join/
Disallow: /search
Disallow: /styleguide

Sitemap: ${SITE}/sitemap.xml
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(BODY, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
