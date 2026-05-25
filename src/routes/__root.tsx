import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { RouteProgress } from "@/components/ui/route-progress";
import { MobileNavFab } from "@/components/nav/MobileNavFab";
import { NavBar } from "@/components/home/NavBar";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/ukena";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://ukena.co.uk";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UKEN",
  legalName: "UKEN",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.jpg`,
  description:
    "UKEN connects UK buyers directly with traceable East African coffee, tea, foods, textiles, craft, and more — from Kenya, Uganda, Tanzania, Rwanda and beyond.",
  
  telephone: "+44 7425 241649",
  sameAs: [] as string[],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Osmaston 10",
      postalCode: "NG7 1SD",
      addressLocality: "Nottingham",
      addressCountry: "GB",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Nairobi Garage, Karen — Watermark Business Park, Ndege Rd, Off Langata Rd",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
  ],
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "UKEN",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/shop?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "UKEN" },
      {
        name: "description",
        content:
          "UKEN — a direct trade marketplace bridging Kenyan farmers, artisans, and makers with UK homes.",
      },
      { name: "author", content: "UKEN" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { name: "theme-color", content: "#1a1a1a" },
      { name: "application-name", content: "UKEN" },
      { httpEquiv: "Content-Language", content: "en-GB" },
      { property: "og:site_name", content: "UKEN" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:title", content: "UKEN" },
      {
        property: "og:description",
        content:
          "UKEN — a direct trade marketplace bridging Kenyan farmers, artisans, and makers with UK homes.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: "UKEN — traceable Kenyan goods, brought home to the UK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "UKEN — Kenya, brought home" },
      {
        name: "twitter:description",
        content:
          "Traceable Kenyan coffee, tea, foods, textiles, beadwork, and craft — straight from the maker to UK doors.",
      },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "preconnect", href: "https://res.cloudinary.com" },
      { rel: "dns-prefetch", href: "https://res.cloudinary.com" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ORGANIZATION_JSONLD),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(WEBSITE_JSONLD),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <RouteProgress />
          <GlobalNav />
          <Outlet />
          <MobileNavFab />
          <Toaster richColors position="top-center" />
          <CookieBanner />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

/**
 * Renders the marketing NavBar on every route except dashboard areas
 * (admin / creator / account) which provide their own DashboardShell chrome,
 * and the apply flow which uses JoinShell.
 */
function GlobalNav() {
  const { pathname } = useLocation();
  const hideOn = ["/admin", "/creator", "/account", "/join/apply"];
  if (hideOn.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }
  return <NavBar />;
}
