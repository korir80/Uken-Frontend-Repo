# Ukena — Project Progress & Architecture

_Last updated: 2026-04-24_

A living document describing what's been built, what's stubbed, and what's
likely next. Read this before picking up new work so you know where the
seams are.

---

## 0. What's new since the last update (P1 → P3)

- **Service layer is now the source of truth.** Every page reads through
  `src/services/*` + `src/lib/queries.ts` (TanStack Query hooks). The static
  seed data only appears in mock-API fallbacks when `VITE_USE_MOCK_API=true`.
- **Direct-to-Cloudinary uploads** (`src/lib/cloudinary.ts`,
  `CloudinaryImagePicker`). The backend never touches binaries; it receives
  URL strings only. See `BACKEND_SPEC.md` §10.
- **New routes:** `/search` (global), `/account/addresses`,
  `/creator/products` (CRUD), `/creator/orders`, `/creator/profile`,
  `/creator/analytics` (full Recharts dashboard), the admin suite (`/admin/*`).
- **Buyer persistence services:** `cartService` (`/cart` + `/cart/sync`),
  `savedService` (`/users/me/saved/...`), and address management on
  `profileService`.
- **Application submission wired** (`POST /applications`, public).
- **Checkout payment** keeps a mock card form with a clearly-marked **Demo**
  label — real Stripe wiring is intentionally still stubbed.
- **Order confirmation** now offers a print-friendly receipt (`@media print`).
- **`<LazyImage>`** auto-injects Cloudinary `f_auto,q_auto` and a responsive
  `srcset` for any `res.cloudinary.com` URL.

---

## 1. Product Summary

**Ukena** is a story-driven marketplace pairing **Kenyan artisans** with
**UK buyers**. The brand leads with the maker, not the product — every piece
links back to the person who crafted it.

- **Buyers** (`ROLE_BUYER`) — browse creators & pieces, save favourites,
  buy heirloom craft.
- **Creators** (`ROLE_CREATOR`) — apply to join, manage their profile,
  list pieces, fulfil orders.
- **Admins** (`ROLE_ADMIN`) — moderate applications & content (UI not built yet).

---

## 2. Tech Stack

| Layer            | Choice                                                |
| ---------------- | ----------------------------------------------------- |
| Framework        | TanStack Start v1 (file-based routing, SSR-ready)     |
| Build            | Vite 7                                                |
| UI               | React 19 + Tailwind v4 + shadcn/ui                    |
| Animation        | Framer Motion                                         |
| Data fetching    | TanStack Query (configured in `src/router.tsx`)       |
| HTTP client      | Axios (`src/services/api.ts`)                         |
| Backend          | **External Spring Boot API** (`VITE_API_BASE_URL`)    |
| Deployment       | Cloudflare Workers (`wrangler.jsonc`)                 |
| Lovable Cloud    | **Not enabled** — backend is owned externally         |

> ⚠️ The frontend assumes the Spring Boot envelope
> `{ success, data, message, errors }`. `unwrap()` in `services/api.ts`
> normalises it to just `data`.

---

## 3. Design System

- **Aesthetic:** Dark cinematic hero (deep brown/amber) + warm editorial
  body (warm-white, charcoal, clay/terracotta accents).
- **Typography:** Cormorant Garamond (display) + DM Sans (body/UI).
- **Tokens:** Defined in `src/styles.css` using `oklch`. Never hard-code
  colours in components — use semantic tokens (`bg-warm-white`,
  `text-charcoal`, `text-clay`, etc.).
- **Primitives:** `src/components/ukena/` — Button, Card, Badge, Avatar,
  Divider, SectionLabel. Layered on top of shadcn primitives in
  `src/components/ui/`.
- **Live styleguide:** [`/styleguide`](/styleguide).

**Recent design pass:** Compact header treatment applied to `/shop`,
`/explore`, `/story`, `/join` — headlines reduced to 42px desktop / 30px
mobile, padding tightened so primary content sits above the fold.

---

## 4. Routes / Pages

44 route files. Flat dot-separated naming convention (TanStack).

### 4.1 Marketing & Discovery

| Route                        | Purpose                                                                              | Status |
| ---------------------------- | ------------------------------------------------------------------------------------ | ------ |
| `/`                          | Home — dual mode: `Hero` (guests) vs `PersonalisedHome` (authed buyers)              | ✅     |
| `/shop`                      | Product-first gallery, craft chips + "More filters" sheet                            | ✅     |
| `/explore`                   | Creator-first directory with craft / region filters                                  | ✅     |
| `/story`                     | Brand narrative                                                                      | ✅     |
| `/search`                    | Global search (creators + products), tokenised AND scoring + field weighting         | ✅     |
| `/creators/$creatorId`       | Creator profile: header, story, process, cultural meaning, products, related makers  | ✅     |
| `/products/$productId`       | Product detail — gallery + persistent creator attribution + related pieces           | ✅     |

### 4.2 Commerce

| Route                      | Purpose                                                                | Status                            |
| -------------------------- | ---------------------------------------------------------------------- | --------------------------------- |
| `/bag`                     | Cart with quantity stepper, impact statement, empty state              | ✅                                |
| `/checkout`                | Layout shell w/ `<Outlet />` and order summary sidebar                 | ✅                                |
| `/checkout/delivery`       | Address capture w/ blur validation, country dropdown                   | ✅                                |
| `/checkout/payment`        | Mock card form, dynamic total in CTA, **Demo** label                   | ⚠️ Demo only — no real payments   |
| `/checkout/confirmation`   | Per-creator thank-you + printable receipt (`@media print`)             | ✅                                |
| `/saved` & `/account/saved`| Saved creators / pieces (server-backed via `useSaved*` hooks)          | ✅                                |

### 4.3 Account & Onboarding (buyer)

| Route                          | Purpose                                                | Status |
| ------------------------------ | ------------------------------------------------------ | ------ |
| `/signin` / `/signup`          | Auth forms (wired to backend)                          | ✅     |
| `/account`                     | Profile hub (greeting, logout, links)                  | ✅     |
| `/account/profile`             | Buyer profile edit                                     | ✅     |
| `/account/orders`              | Order history list                                     | ✅     |
| `/account/orders/$orderId`     | Order detail                                           | ✅     |
| `/account/addresses`           | Address book CRUD + default                            | ✅     |
| `/account/activity`            | Recent activity timeline                               | ✅     |
| `/join` / `/join/apply`        | Artisan landing + multi-step application (submits live)| ✅     |

### 4.4 Creator dashboard (`/creator/*`)

| Route                  | Purpose                                              | Status |
| ---------------------- | ---------------------------------------------------- | ------ |
| `/creator`             | Dashboard index w/ KPIs                              | ✅     |
| `/creator/products`    | Product CRUD (Cloudinary-backed images)              | ✅     |
| `/creator/orders`      | Orders for this creator + status transitions         | ✅     |
| `/creator/profile`     | Profile editor (story, portrait, header)             | ✅     |
| `/creator/earnings`    | Payout summary                                       | ✅     |
| `/creator/analytics`   | Recharts dashboard (revenue, products, funnel, etc.) | ✅     |
| `/creator/application` | Application status (post-submit)                     | ✅     |

### 4.5 Admin (`/admin/*`)

`/admin`, `/admin/applications`, `/admin/buyers`, `/admin/content`,
`/admin/creators`, `/admin/featured`, `/admin/orders`, `/admin/payouts`,
`/admin/products` — all wired to `adminService` + React Query.

### 4.6 Utility

- `/styleguide` — design reference.

---

## 5. State & Data Layer

### 5.1 Auth (`src/lib/auth.tsx`)

- React context with `localStorage` hydration (key: `ukena.auth`).
- Bearer token attached via Axios request interceptor.
- 401 interceptor → clears auth, redirects to `/signin`.
- Roles: `ROLE_BUYER` | `ROLE_CREATOR` | `ROLE_ADMIN`.
- `defaultPathForRole()` decides post-login landing.

### 5.2 Cart (`src/lib/cart.tsx`) — hardened in Phase 4

- Local `useReducer` — items, delivery, lastOrder.
- Items carry **full creator attribution inline**:
  `{ id, name, price, quantity, image, craftType, creatorId, creatorName, creatorRegion }`
  so we never refetch to render "made by …".
- Exposes a derived `cartSummary` from `useCart()`:
  `{ itemCount, subtotalPence, shippingPence, totalPence, uniqueCreatorIds, uniqueCreatorNames }`.
  Components must read these — never derive manually.
- `clearCart()` action available; called from `/checkout/confirmation` on mount.
- File header documents the **Spring Boot integration points**
  (`POST /api/cart/sync`, `GET /api/cart`, `POST /api/orders`).
- ⚠️ **Not yet persisted server-side or in localStorage** — by design,
  waiting on the backend cart sync endpoint.

### 5.3 Service layer (`src/services/`)

All wired to the Spring Boot backend through `src/services/api.ts`. Every
service ships with a **mock branch** (`USE_MOCK_API=true`) that resolves from
seed data so the UI is fully testable without a backend running. Components
consume them via React Query hooks in `src/lib/queries.ts` — never call a
service directly from a component.

| Service              | Endpoints                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `authService`        | `POST /auth/{login,register,logout}`, `GET /auth/me`                                                     |
| `creatorService`     | `GET /creators`, `GET /creators/{id}` (filter via `?craft=&region=`)                                     |
| `productService`     | `GET /products`, `GET /products/{id}`, `GET /products?creatorId=`, `POST/PUT/DELETE /creators/me/products`|
| `orderService`       | `POST /orders`, `GET /orders/me`, `GET /creators/me/orders`, `GET /admin/orders`, `PATCH .../status`, refund |
| `profileService`     | `GET/PUT /creators/me`, `uploadImage` (browser → Cloudinary, no backend hop), `/users/me/addresses/*`    |
| `applicationService` | `POST /applications` (public), `GET/GET-one/PATCH /admin/applications`                                   |
| `cartService`        | `GET/PUT /cart`, `POST /cart/sync`                                                                       |
| `savedService`       | `GET/POST/DELETE /users/me/saved/{products,creators}/...`, `POST /users/me/saved/sync`                   |
| `adminService`       | payouts, reviews, featured, buyers, product moderation, creator suspension                               |

### 5.4 Static seed data

Used only as the in-memory store for the mock API branch. Live UI consumes
the React Query hooks; the seed files no longer power any production code path.

- `src/components/explore/creators-data.ts`
- `src/components/creator/creator-profile-data.ts`
- `src/components/product/product-data.ts`
- `src/components/admin/admin-data.ts`

---

## 6. End-to-End Status Matrix

| Capability                                                  | Status                              |
| ----------------------------------------------------------- | ----------------------------------- |
| Browse creators & products                                  | ✅ via `useCreators` / `useProduct` |
| Auth UI + context + interceptors                            | ✅                                  |
| Product detail w/ persistent creator card                   | ✅                                  |
| Cart add / remove / quantity (local + sync hook ready)      | ✅                                  |
| Checkout flow UI (delivery → payment → confirmation)        | ✅                                  |
| Order confirmation w/ printable receipt                     | ✅                                  |
| Saved items (products + creators) w/ optimistic toggle      | ✅                                  |
| Personalised home (buy again, saved makers)                 | ✅                                  |
| Buyer addresses CRUD + default                              | ✅                                  |
| Artisan application submit (`POST /applications`)           | ✅                                  |
| Global search (`/search`)                                   | ✅                                  |
| Creator dashboard (products CRUD, orders, profile)          | ✅                                  |
| Creator analytics dashboard (Recharts)                      | ✅                                  |
| Admin suite (apps, buyers, creators, products, payouts, …)  | ✅                                  |
| Direct-to-Cloudinary image uploads                          | ✅                                  |
| Real payments (Stripe/Paddle)                               | ❌ checkout still shows **Demo**    |
| Real order placement on checkout submit                     | ⚠️ wired to `useCreateOrder` but gated on payment |
| Reviews / ratings                                           | ❌                                  |
| Email notifications                                         | ❌ (Spring backend's job)           |

---

## 7. Spring Boot Integration Seams

The frontend is feature-complete against the contract in `BACKEND_SPEC.md`.
What's left for the Spring side:

- Implement the new buyer-scoped resources: `/cart`, `/cart/sync`,
  `/users/me/saved/*`, `/users/me/addresses/*` (see spec §7.7–7.9 + §9 schema).
- Implement product moderation & creator suspension under `/admin/*`
  (spec §7.6).
- Validate image URL fields as `https://res.cloudinary.com/...` strings —
  no multipart endpoint to build.
- The frontend flips to live data the moment `VITE_USE_MOCK_API=false` and
  `VITE_API_BASE_URL` points at the deployed Spring service. No further
  frontend changes required to start the smoke test in spec §12.

---

## 8. Suggested Next Priorities

1. **Spring backend implementation** of the contract above so we can flip
   `VITE_USE_MOCK_API=false`.
2. **Real checkout.** Replace the Demo card form with Stripe Elements;
   wire to `useCreateOrder` on `paymentIntent.succeeded`.
3. **Reviews & ratings** once real orders flow (DTO already in spec §6.15).
4. **Creator messaging / notifications** for status transitions.
5. **SEO polish** — per-route `head()` for product / creator pages with
   real og:image from Cloudinary.

---

## 9. Conventions & Gotchas

- **Never edit `src/routeTree.gen.ts`** — auto-generated by the TanStack
  Router plugin.
- **Routes:** flat dot-separated (`checkout.payment.tsx`), no trailing
  slashes in `<Link to="...">`, type-safe params required.
- **Imports:** always from `@tanstack/react-router`, never
  `react-router-dom`.
- **Server runtime:** SSR runs on Cloudflare Workers — no native Node
  modules (sharp, child_process, puppeteer, etc.).
- **Design tokens only** — no raw hex/rgb in components.
- **Creator attribution is non-negotiable** — every cart item, line item,
  checkout summary and confirmation row must show the maker. The cart
  shape enforces this; don't shortcut it.
- **Backend envelope:** every request goes through `unwrap()`; if the
  Spring Boot team changes the shape, update it once in `services/api.ts`.
