## Scope

Six related changes across auth, creator dashboard, public marketing pages, and the Uken sentinel creator page.

---

### 1. Smarter 401 / token expiry handling

Today `registerUnauthorizedHandler` in `src/lib/auth.tsx` always toasts "Session expired" and redirects to `/signin` — even on public pages where the user isn't logged in (causing noisy redirects).

- Update the handler to branch on current route:
  - **Public routes** (`/`, `/shop`, `/products/*`, `/creators/*`, `/catalogue`, `/about`, etc.): clear token + show toast only. Do not redirect.
  - **Protected routes** (`/admin/*`, `/creator/*`, `/account/*`, `/checkout/*`): clear token, toast "Session expired — please sign in again", redirect to `/signin` with `?redirect=<current>` so they return after login.
- Detect route via `window.location.pathname` inside the handler (already runs client-side).

---

### 2. Creator dashboard: immediate refresh of newly created products

- In `src/routes/creator.products.tsx` (and the create-product mutation), invalidate `["products", "creator", "me"]` and `["products"]` on success so the list updates instantly without a manual refresh.
- Confirm `useCreateProduct` / `useUpdateProduct` hooks in `src/lib/queries.ts` invalidate the right keys.

### 3. Creator: prompt to add images

- On `src/routes/creator.index.tsx` and `src/routes/creator.products.tsx`, render a dismissible warning banner when:
  - The creator profile has no `image` / portrait → "Add a profile photo so buyers can connect with your story."
  - Any of their products has empty `images` / `heroImage` → "N products are missing photos — add them to start selling."
- Each banner links to the relevant edit screen.

### 4. Creator earnings: 60/40 split clarity

- In `src/routes/creator.earnings.tsx`:
  - Add an info card at top explaining: **"You earn 60% of every sale. UKEN keeps 40% to cover the marketplace, payment fees, marketing, and platform operations."**
  - Add a "How payouts work" panel: *Manual M-Pesa payouts for now. Automatic monthly payouts begin once your balance exceeds €100. Statements issued on the 1st of each month.*
  - Update the StatCards to show creator share = 60% of order subtotal (multiply the share calculation by 0.6 for display, label "Your share (60%)").
  - Same multiplier in the transactions table.

### 5. Public pages audit — clearer "how it works" + product visibility

- **Home (`src/routes/index.tsx` / `Hero` / `ProcessStrip`)**: add/strengthen a 3-step "How UKEN works" strip (Discover → Order → We pay the maker 60%) and tighten the hero CTA to "Shop the collection".
- **Shop (`src/routes/shop.tsx`)**: ensure the listing shows ALL products (creator + Uken catalogue) — verify the feed isn't filtering out `isUkenaOwned`. Every card already shows attribution; confirm the "✦ By Uken" badge renders for Uken products in the mixed feed.
- **Footer / NavBar**: ensure "Collection", "Artisans", "How it works", and "Sell on UKEN" are all reachable in one click.
- Small copy passes on `FeaturedShop`, `ArtisanCTA`, `StoryTrustStrip` so the value prop is consistent: *handmade by East African artisans, 60% goes to the maker.*

### 6. Uken sentinel creator page (`/creators/ukena`)

- In `src/routes/creators.$creatorId.tsx`, detect `creatorId === "ukena"` and render a simplified variant:
  - Hide the personal-story sections (process, meaning, social feed, related creators).
  - Show: short intro ("UKEN Collection — pieces curated and fulfilled directly by UKEN"), the about-page mission/values content (copied from `src/routes/about.tsx`), and the product grid filtered to `isUkenaOwned` items.
- Trim verbose about-page sections so the page is "less informative" — keep mission, sourcing, and a CTA to the full Collection.

---

## Technical details

- Auth handler: read `window.location.pathname` and match against a `PROTECTED_PREFIXES = ["/admin", "/creator", "/account", "/checkout"]` array.
- Earnings split lives only in display logic for now (backend still returns gross). Add a `CREATOR_SHARE = 0.6` constant in `src/lib/cart.tsx` or a new `src/lib/revenue.ts`.
- Missing-image detection uses existing product fields (`heroImage`, `images[]`) and creator `image`.
- About → Uken page: extract reusable sections from `about.tsx` into a small component (`src/components/about/UkenMission.tsx`) so both pages can render the same content without divergence.

## Out of scope

- No backend changes (split %, payout thresholds are display-only).
- No new routes; existing structure is sufficient.
- Email/M-Pesa integration not implemented — just messaging.
