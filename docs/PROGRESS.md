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

19 routes total. Flat dot-separated naming convention (TanStack).

### 4.1 Marketing & Discovery

| Route                        | Purpose                                                                              | Status |
| ---------------------------- | ------------------------------------------------------------------------------------ | ------ |
| `/`                          | Home — dual mode: `Hero` (guests) vs `PersonalisedHome` (authed buyers)              | ✅     |
| `/shop`                      | Product-first gallery, craft chips + "More filters" sheet                            | ✅     |
| `/explore`                   | Creator-first directory with craft / region filters                                  | ✅     |
| `/story`                     | Brand narrative                                                                      | ✅     |
| `/creators/$creatorId`       | Creator profile: header, story, process, cultural meaning, products, related makers  | ✅     |
| `/products/$productId`       | Product detail — gallery + persistent creator attribution + related pieces           | ✅     |

### 4.2 Commerce (Phase 4 complete — UI hardened, backend wiring pending)

| Route                      | Purpose                                                  | Status                               |
| -------------------------- | -------------------------------------------------------- | ------------------------------------ |
| `/bag`                     | Cart with quantity stepper, impact statement, empty state| ✅ local state only                  |
| `/checkout`                | Layout shell w/ `<Outlet />` and order summary sidebar   | ✅                                   |
| `/checkout/delivery`       | Address capture w/ blur validation, country dropdown     | ✅ UI only                           |
| `/checkout/payment`        | Stripe-ready card form, dynamic total in CTA             | ⚠️ UI only — **no real payments**    |
| `/checkout/confirmation`   | Human-toned thank you, per-creator acknowledgement       | ✅ clears cart on mount              |
| `/saved` & `/account/saved`| Saved creators / pieces                                  | ✅ UI                                |

### 4.3 Account & Onboarding

| Route             | Purpose                                                          | Status                |
| ----------------- | ---------------------------------------------------------------- | --------------------- |
| `/signin`         | Login form                                                       | ✅ wired to backend   |
| `/account`        | Profile hub (greeting, logout, links)                            | ✅ basic              |
| `/join`           | Artisan landing                                                  | ✅                    |
| `/join/apply`     | Multi-step artisan application (`JoinShell`, `JoinField`, photo) | ✅ UI only            |

### 4.4 Utility

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

All wired to the Spring Boot backend. Most UI does **not** consume them
yet — it still reads from static seed data (see §6). Each consumer route
has a `// TODO` annotation marking exactly where the swap will happen.

| Service           | Endpoints                                                              |
| ----------------- | ---------------------------------------------------------------------- |
| `authService`     | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`         |
| `creatorService`  | `GET /creators`, `GET /creators/:id`                                   |
| `productService`  | `GET /products/:id`, `GET /products?creatorId=`                        |
| `orderService`    | `POST /orders`, `GET /orders/buyer`, `GET /orders/creator`             |
| `profileService`  | `GET/PUT /creators/me`, `POST /media/upload`                           |

### 5.4 Static seed data

Most pages still render from these — swap to `useQuery` when wiring up live data:

- `src/components/explore/creators-data.ts`
- `src/components/creator/creator-profile-data.ts`
- `src/components/product/product-data.ts`

---

## 6. End-to-End Status Matrix

| Capability                                | Status |
| ----------------------------------------- | ------ |
| Browse creators & products (static)       | ✅     |
| Auth UI + context + interceptors          | ✅     |
| Product detail w/ persistent creator card | ✅     |
| Cart add / remove / quantity (local)      | ✅     |
| Cart summary + clearCart action           | ✅     |
| Checkout flow UI (delivery → payment → confirmation) | ✅ |
| Order confirmation (per-creator messaging)| ✅     |
| Saved items / personalised home (UI)      | ✅     |
| Artisan application form (UI)             | ✅     |
| Live data wiring (services → UI)          | ⚠️ partial — TODOs marked |
| Real payments (Stripe/Paddle)             | ❌     |
| Real order placement on checkout submit   | ❌     |
| Persistent cart / saved items             | ❌     |
| Image uploads from PhotoUploader          | ⚠️ service exists, not wired |
| Creator dashboard (products, orders)      | ❌     |
| Admin moderation tools                    | ❌     |
| Search (creators + products)              | ❌     |
| Reviews / ratings                         | ❌     |
| Email notifications                       | ❌     |

---

## 7. Spring Boot Integration Seams

TODO markers are already in place for the next wiring pass:

- `src/routes/products.$productId.tsx` — replace seed lookup with
  `productService.getProductById(params.productId)` via TanStack Query
  (`['product', productId]`).
- `src/routes/bag.tsx` — on login, hydrate from `GET /api/cart`; mirror
  every mutation with `POST /api/cart/sync`.
- `src/routes/checkout.payment.tsx` — wire Place Order to
  `orderService.createOrder(...)` + Stripe PaymentIntent confirmation.
  On success → `clearCart()` → navigate to `/checkout/confirmation`.
- `src/routes/checkout.confirmation.tsx` — read order from the
  `orderService` response rather than the (now-cleared) cart context.

---

## 8. Suggested Next Priorities

In rough order of value:

1. **Wire static UI to live services.** Replace seed data reads with
   `useQuery` against `creatorService` / `productService`. Use
   `queryClient.ensureQueryData` in route loaders for SSR. Start with
   the marked TODO in `/products/$productId`.
2. **Real checkout.** Wire `/checkout/payment` → `orderService.createOrder`
   and integrate Stripe (or Paddle) for the payment step. Then update
   `/checkout/confirmation` to read from the order response.
3. **Persist cart & saved items** via the documented `/api/cart` endpoints
   (will need Spring Boot work).
4. **Creator dashboard** at `/account/creator/*` — product CRUD, order
   list, profile editing. Services already exist (`profileService`,
   `orderService.getOrdersByCreator`).
5. **Search** for creators + products (filter UI exists, needs query
   params + backend support).
6. **Order history** in `/account` for buyers, plus the creator view
   in the dashboard.
7. **Artisan application submission** endpoint + admin review screen.
8. **Reviews & ratings** on products/creators once order data flows.

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
