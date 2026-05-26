Here is the complete `BACKEND_SPEC.md` content — copy everything between the triple-backtick fences and paste it into your file:

````markdown
# Ukena Backend — API Reference (Ground Truth)

> **This document reflects what is ACTUALLY implemented** in the running codebase.
> Last updated: 2026-05-26. Source of truth: controller + service source files.
> Do not edit speculatively — only update when backend code changes.

---

## Base URL & envelope

All routes are relative to the service root (no `/api` prefix — Railway serves from `/`).
Every response is wrapped:

```json
{ "success": true, "data": {}, "message": "optional", "errors": [] }
```
````

Auth: `Authorization: Bearer <jwt>` header.
Roles: `ROLE_BUYER`, `ROLE_CREATOR`, `ROLE_ADMIN`, `ROLE_SUPPORT`.

Error shape:

```json
{ "success": false, "data": null, "message": "reason", "errors": ["field: detail"] }
```

HTTP codes: `200` ok · `201` created · `204` no content · `400` bad request · `401` unauthenticated · `403` forbidden · `404` not found · `409` conflict · `500` server error.

---

## Auth — `/auth`

| Method | Path                    | Auth              | Description                         |
| ------ | ----------------------- | ----------------- | ----------------------------------- |
| POST   | `/auth/register`        | Public            | Register new buyer account          |
| POST   | `/auth/login`           | Public            | Login, returns JWT                  |
| POST   | `/auth/logout`          | Public            | No-op, returns 204                  |
| GET    | `/auth/me`              | Any authenticated | Returns current user profile        |
| POST   | `/auth/forgot-password` | Public            | Sends reset email if address exists |
| POST   | `/auth/reset-password`  | Public            | Resets password via token           |

**POST /auth/register body**

```json
{ "email": "string", "password": "string", "fullName": "string" }
```

**POST /auth/login body**

```json
{ "email": "string", "password": "string" }
```

**AuthResponse**

```json
{ "token": "string", "user": { "id": "uuid", "email": "string", "fullName": "string", "role": "ROLE_BUYER|ROLE_CREATOR|ROLE_ADMIN|ROLE_SUPPORT", "creatorId": "string|null" } }
```

---

## Creators — `/creators`

| Method | Path                 | Auth    | Description                                                                                  |
| ------ | -------------------- | ------- | -------------------------------------------------------------------------------------------- |
| GET    | `/creators`          | Public  | List **active** creators only (`deletedAt IS NULL`). Query: `?craft=&region=`                |
| GET    | `/creators/featured` | Public  | Featured slots that have a creator assigned                                                  |
| GET    | `/creators/{id}`     | Public  | Single creator by id (returns even if suspended — use admin endpoint for status-aware fetch) |
| GET    | `/creators/me`       | CREATOR | Own full profile                                                                             |
| PUT    | `/creators/me`       | CREATOR | Update own profile (partial — only provided fields updated)                                  |

**CreatorSummary** (returned by list + search)

```json
{ "id": "string", "firstName": "string", "fullName": "string", "craft": "string", "region": "string", "hook": "string", "image": "string" }
```

**CreatorDetail** (returned by getOne + me)

```json
{
  "id": "string",
  "firstName": "string",
  "fullName": "string",
  "craft": "string",
  "region": "string",
  "hook": "string",
  "image": "string",
  "portraitImage": "string",
  "headerImage": "string",
  "storyParagraphs": ["string"],
  "pullQuote": "string|null",
  "processSteps": [{ "image": "string", "caption": "string" }],
  "culturalMeaning": ["string"],
  "mapPin": { "lat": 0.0, "lng": 0.0, "label": "string" }
}
```

**PUT /creators/me body** (all fields optional)

```json
{
  "firstName": "string",
  "fullName": "string",
  "region": "string",
  "craft": "string",
  "pullQuote": "string",
  "portraitImage": "https://...",
  "headerImage": "https://...",
  "storyParagraphs": ["string"],
  "processSteps": [{ "image": "https://...", "caption": "string" }]
}
```

> ⚠️ `GET /creators` only returns active (unsuspended) creators. For admin list including suspended see `GET /admin/creators` below.

---

## Products — `/products`, `/creators/me/products`, `/admin/products`

| Method | Path                                          | Auth    | Description                                                                     |
| ------ | --------------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| GET    | `/products`                                   | Public  | Paginated browse. Query: `?creatorId=&minPrice=&maxPrice=&sort=&page=0&size=12` |
| GET    | `/products/{id}`                              | Public  | Single product                                                                  |
| GET    | `/creators/me/products`                       | CREATOR | Own products (all statuses)                                                     |
| POST   | `/creators/me/products`                       | CREATOR | Create product → 201                                                            |
| PUT    | `/creators/me/products/{id}`                  | CREATOR | Full update (ownership enforced)                                                |
| PATCH  | `/creators/me/products/{id}/status`           | CREATOR | Update own product status                                                       |
| DELETE | `/creators/me/products/{id}`                  | CREATOR | Soft-delete own product → 204                                                   |
| POST   | `/creators/me/products/{id}/images`           | CREATOR | Add image to product                                                            |
| DELETE | `/creators/me/products/{id}/images/{imageId}` | CREATOR | Remove image from product → 204                                                 |
| PATCH  | `/admin/products/{id}/status`                 | ADMIN   | Admin override product status                                                   |
| DELETE | `/admin/products/{id}`                        | ADMIN   | Admin delete product → 204                                                      |

**ProductStatus enum**: `ACTIVE`, `DRAFT`, `SUSPENDED`

**ProductDto**

```json
{
  "id": "string",
  "name": "string",
  "pricePence": 12500,
  "heroImage": "string|null",
  "pieceStory": "string|null",
  "materials": ["string"],
  "dimensions": "string|null",
  "care": "string|null",
  "status": "ACTIVE|DRAFT|SUSPENDED",
  "images": [{ "id": 1, "url": "string", "displayOrder": 0 }],
  "creator": { "id": "string", "fullName": "string", "craft": "string" }
}
```

**POST /creators/me/products body**

```json
{
  "name": "string",
  "pricePence": 12500,
  "heroImage": "https://...",
  "pieceStory": "string",
  "materials": ["string"],
  "dimensions": "string",
  "care": "string"
}
```

**PATCH status body**

```json
{ "status": "ACTIVE|DRAFT|SUSPENDED" }
```

**POST images body**

```json
{ "url": "https://...", "displayOrder": 0 }
```

---

## Orders

| Method | Path                                     | Auth                    | Description                                                        |
| ------ | ---------------------------------------- | ----------------------- | ------------------------------------------------------------------ |
| POST   | `/orders`                                | Public (buyer or guest) | Place order. Guest requires `guestEmail` + `guestFullName` in body |
| GET    | `/orders/track?displayId=&email=`        | Public                  | Track single order by displayId + email                            |
| GET    | `/orders/track-by-email?email=`          | Public                  | All orders for an email address                                    |
| GET    | `/orders/me`                             | BUYER                   | Own orders                                                         |
| GET    | `/creators/me/orders`                    | CREATOR                 | Orders containing own products                                     |
| PATCH  | `/creators/me/orders/{displayId}/status` | CREATOR                 | Update order status                                                |
| GET    | `/admin/orders`                          | ADMIN                   | All orders                                                         |
| PATCH  | `/admin/orders/{displayId}/status`       | ADMIN                   | Update any order status                                            |
| PATCH  | `/admin/orders/{displayId}/refund`       | ADMIN                   | Refund order                                                       |
| PATCH  | `/admin/orders/bulk-status`              | ADMIN                   | Bulk status update                                                 |

**OrderStatus enum**: `PENDING`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`

**POST /orders body**

```json
{
  "items": [{ "productId": "string", "quantity": 1 }],
  "delivery": {
    "fullName": "string",
    "email": "string",
    "addressLine1": "string",
    "addressLine2": "string|null",
    "city": "string",
    "postcode": "string",
    "country": "string"
  },
  "deliveryZoneId": "uuid|null",
  "guestEmail": "string|null",
  "guestFullName": "string|null"
}
```

**PATCH status body**

```json
{ "status": "PROCESSING|SHIPPED|DELIVERED|CANCELLED" }
```

**PATCH bulk-status body**

```json
{ "displayIds": ["UKN-001"], "status": "string" }
```

**OrderDto**

```json
{
  "id": "uuid",
  "displayId": "UKN-1042",
  "status": "PENDING",
  "totalPence": 37500,
  "shippingPence": 500,
  "buyerFullName": "string",
  "buyerEmail": "string",
  "delivery": { "fullName": "string", "email": "string", "addressLine1": "string", "addressLine2": "string|null", "city": "string", "postcode": "string", "country": "string" },
  "items": [
    {
      "productId": "string",
      "name": "string",
      "quantity": 1,
      "pricePence": 12500,
      "image": "string|null",
      "creatorId": "string",
      "creatorFullName": "string"
    }
  ],
  "gatewayRef": "string|null",
  "paidAt": "2025-04-22T14:32:00Z|null",
  "createdAt": "2025-04-22T14:32:00Z"
}
```

---

## Payments — `/payments`

| Method | Path                 | Auth                    | Description                         |
| ------ | -------------------- | ----------------------- | ----------------------------------- |
| POST   | `/payments/initiate` | Public (buyer or guest) | Initiate payment for an order       |
| POST   | `/payments/webhook`  | Public (gateway)        | Stripe or Paystack webhook receiver |

**POST /payments/initiate body**

```json
{ "orderId": "string", "guestEmail": "string|null" }
```

**PaymentInitResponse**

```json
{ "checkoutUrl": "string", "reference": "string" }
```

Webhook accepts both Stripe (`Stripe-Signature` header) and Paystack (`x-paystack-signature` header).

---

## Admin — `/admin`

| Method | Path                               | Auth  | Description                                                                                  |
| ------ | ---------------------------------- | ----- | -------------------------------------------------------------------------------------------- |
| POST   | `/admin/staff`                     | ADMIN | Create ROLE_SUPPORT account → 201                                                            |
| GET    | `/admin/staff`                     | ADMIN | List all ADMIN + ROLE_SUPPORT accounts                                                       |
| GET    | `/admin/buyers`                    | ADMIN | List all buyers with suspend status                                                          |
| PATCH  | `/admin/buyers/{id}/suspend`       | ADMIN | Suspend buyer (UUID path param) → 204                                                        |
| PATCH  | `/admin/buyers/{id}/unsuspend`     | ADMIN | Unsuspend buyer → 204                                                                        |
| GET    | `/admin/creators`                  | ADMIN | **List ALL creators including suspended.** Query: `?status=ACTIVE\|SUSPENDED` (omit for all) |
| PATCH  | `/admin/creators/{id}/suspend`     | ADMIN | Suspend creator: sets `deletedAt`, suspends user account, suspends all products → 204        |
| PATCH  | `/admin/creators/{id}/unsuspend`   | ADMIN | Unsuspend creator: clears `deletedAt`, restores user + products → 204                        |
| GET    | `/admin/payouts`                   | ADMIN | List all creator payout records                                                              |
| POST   | `/admin/payouts/{creatorId}/pay`   | ADMIN | Process payout for one creator                                                               |
| GET    | `/admin/reviews`                   | ADMIN | List all reviews (all statuses)                                                              |
| PATCH  | `/admin/reviews/{id}/status`       | ADMIN | Update review moderation status                                                              |
| GET    | `/admin/featured`                  | ADMIN | Get 4 featured slots                                                                         |
| PUT    | `/admin/featured`                  | ADMIN | Replace featured slots                                                                       |
| GET    | `/admin/orders`                    | ADMIN | All orders (defined in OrderController)                                                      |
| PATCH  | `/admin/orders/{displayId}/status` | ADMIN | Update any order status                                                                      |
| PATCH  | `/admin/orders/{displayId}/refund` | ADMIN | Refund order                                                                                 |
| PATCH  | `/admin/orders/bulk-status`        | ADMIN | Bulk order status update                                                                     |
| PATCH  | `/admin/products/{id}/status`      | ADMIN | Override product status                                                                      |
| DELETE | `/admin/products/{id}`             | ADMIN | Delete product                                                                               |
| GET    | `/admin/applications`              | ADMIN | List all artisan applications                                                                |
| GET    | `/admin/applications/{id}`         | ADMIN | Get single application                                                                       |
| PATCH  | `/admin/applications/{id}/status`  | ADMIN | Update application status                                                                    |
| GET    | `/admin/delivery-zones`            | ADMIN | All delivery zones including inactive                                                        |
| POST   | `/admin/delivery-zones`            | ADMIN | Create delivery zone → 201                                                                   |
| PUT    | `/admin/delivery-zones/{id}`       | ADMIN | Update delivery zone                                                                         |
| DELETE | `/admin/delivery-zones/{id}`       | ADMIN | Delete delivery zone → 204                                                                   |

**POST /admin/staff body**

```json
{ "email": "string", "password": "string", "fullName": "string" }
```

**StaffDto**

```json
{ "id": "string", "email": "string", "fullName": "string", "role": "ROLE_ADMIN|ROLE_SUPPORT" }
```

**AdminBuyerRow**

```json
{ "id": "uuid", "fullName": "string", "email": "string", "suspended": false }
```

**AdminCreatorRow** (returned by `GET /admin/creators`)

```json
{ "id": "string", "firstName": "string", "fullName": "string", "craft": "string", "region": "string", "image": "string", "suspended": false, "createdAt": "2025-04-22T14:32:00Z" }
```

`suspended: true` means `deletedAt IS NOT NULL` on the creator row.

**CreatorPayoutDto**

```json
{ "creatorId": "string", "fullName": "string", "region": "string", "craft": "string", "pendingPence": 0, "paidThisMonthPence": 0, "totalLifetimePence": 0, "lastPaidAt": "2025-04-22T14:32:00Z|null" }
```

**POST /admin/payouts/{creatorId}/pay body**

```json
{ "accountNumber": "string", "accountName": "string" }
```

**ProductReviewDto**

```json
{ "id": "string", "productId": "string|null", "productName": "string|null", "buyerName": "string", "rating": 5, "body": "string", "submittedAt": "2025-04-22T14:32:00Z", "status": "PENDING|APPROVED|REJECTED" }
```

**PATCH /admin/reviews/{id}/status body**

```json
{ "status": "PENDING|APPROVED|REJECTED" }
```

**FeaturedSlotDto**

```json
{ "position": 1, "creatorId": "string|null", "productId": "string|null" }
```

**PUT /admin/featured body**: array of `FeaturedSlotDto`. Positions 1–4. Pass `"creatorId": null` to clear a slot.

---

## Applications — `/applications`, `/admin/applications`

| Method | Path                              | Auth   | Description                      |
| ------ | --------------------------------- | ------ | -------------------------------- |
| POST   | `/applications`                   | Public | Submit artisan application → 201 |
| GET    | `/admin/applications`             | ADMIN  | List all applications            |
| GET    | `/admin/applications/{id}`        | ADMIN  | Get single application           |
| PATCH  | `/admin/applications/{id}/status` | ADMIN  | Update status                    |

**ApplicationStatus enum**: `PENDING`, `APPROVED`, `REJECTED`

**POST /applications body**

```json
{
  "fullName": "string",
  "email": "string",
  "region": "string",
  "craft": "string",
  "yearsOfPractice": 5,
  "story": "string",
  "photos": ["https://..."]
}
```

**PATCH status body**

```json
{ "status": "APPROVED|REJECTED|PENDING", "notes": "string|null" }
```

**ApplicationDto**

```json
{ "id": "string", "fullName": "string", "email": "string", "region": "string", "craft": "string", "yearsOfPractice": 5, "story": "string", "status": "PENDING", "submittedAt": "2025-04-22T14:32:00Z" }
```

---

## Reviews — `/reviews`

| Method | Path                           | Auth   | Description                                      |
| ------ | ------------------------------ | ------ | ------------------------------------------------ |
| POST   | `/reviews`                     | BUYER  | Submit review (goes to PENDING moderation) → 201 |
| GET    | `/reviews/product/{productId}` | Public | Get approved/published reviews for a product     |

**POST /reviews body**

```json
{ "productId": "string", "orderId": "string", "rating": 5, "body": "string" }
```

**PublicReviewDto**

```json
{ "id": "string", "buyerName": "string", "rating": 5, "body": "string", "submittedAt": "2025-04-22T14:32:00Z" }
```

---

## Saved Items — `/saved`

All endpoints require `ROLE_BUYER`.

| Method | Path                 | Auth  | Description            |
| ------ | -------------------- | ----- | ---------------------- |
| POST   | `/saved/{productId}` | BUYER | Save a product → 201   |
| GET    | `/saved`             | BUYER | List saved products    |
| DELETE | `/saved/{productId}` | BUYER | Unsave a product → 204 |

**SavedItemDto**

```json
{ "productId": "string", "savedAt": "2025-04-22T14:32:00Z" }
```

---

## Search — `/search`

| Method | Path                                 | Auth   | Description                     |
| ------ | ------------------------------------ | ------ | ------------------------------- |
| GET    | `/search?q=&type=all&page=0&size=12` | Public | Search creators and/or products |

**type values**: `all` · `creators` · `products`
`q` must not be blank. `size` must be 1–50.

**SearchResultDto**

```json
{
  "creators": [{ "id": "string", "firstName": "string", "fullName": "string", "craft": "string", "region": "string", "hook": "string", "image": "string" }],
  "products": [{ "id": "string", "name": "string", "pricePence": 12500, "heroImage": "string|null", "creatorId": "string|null", "creatorFullName": "string|null", "creatorCraft": "string|null" }],
  "total": 0
}
```

---

## Delivery Zones

| Method | Path                         | Auth   | Description                             |
| ------ | ---------------------------- | ------ | --------------------------------------- |
| GET    | `/delivery-zones`            | Public | List active zones for checkout dropdown |
| GET    | `/admin/delivery-zones`      | ADMIN  | All zones including inactive            |
| POST   | `/admin/delivery-zones`      | ADMIN  | Create zone → 201                       |
| PUT    | `/admin/delivery-zones/{id}` | ADMIN  | Update zone                             |
| DELETE | `/admin/delivery-zones/{id}` | ADMIN  | Delete zone → 204                       |

**DeliveryZoneDto**

```json
{ "id": "uuid", "name": "string", "pricePence": 500, "active": true }
```

**POST/PUT body**

```json
{ "name": "string", "pricePence": 500, "active": true }
```

---

## Cloudinary — `/cloudinary`

| Method | Path                | Auth                                                   | Description                                             |
| ------ | ------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| POST   | `/cloudinary/sign`  | Public (applications folder only) or any authenticated | Get signed upload token for direct-to-Cloudinary upload |
| DELETE | `/cloudinary/image` | CREATOR or ADMIN                                       | Delete image by Cloudinary publicId                     |

Unauthenticated callers may only request tokens for `folder: "applications"`. Any other folder requires authentication.

**POST /cloudinary/sign body**

```json
{ "folder": "string", "publicId": "string|null" }
```

**SignResponse**

```json
{ "signature": "string", "timestamp": 1234567890, "apiKey": "string", "cloudName": "string", "folder": "string" }
```

**DELETE /cloudinary/image body**

```json
{ "publicId": "string" }
```

---

## Media — `/media`

| Method | Path                        | Auth              | Description              |
| ------ | --------------------------- | ----------------- | ------------------------ |
| POST   | `/media/upload` (multipart) | Any authenticated | Upload file, returns URL |

**Form field**: `file` (multipart)

**UploadedMediaDto**

```json
{ "url": "string", "publicId": "string" }
```

---

## Security config — public endpoints (no JWT required)

The following are explicitly permitted without authentication:

```
OPTIONS  /**
POST     /auth/login
POST     /auth/register
POST     /auth/forgot-password
POST     /auth/reset-password
POST     /applications
POST     /cloudinary/sign
POST     /payments/webhook
GET      /payments/webhook
POST     /payments/initiate
POST     /orders
GET      /orders/track
GET      /orders/track-by-email
GET      /delivery-zones
GET      /creators
GET      /creators/*
GET      /products
GET      /products/*
GET      /reviews/product/*
GET      /search
GET      /actuator/health
GET      /v3/api-docs/**
GET      /swagger-ui.html
GET      /swagger-ui/**
```

Everything else requires a valid JWT. Role enforcement is via `@PreAuthorize` on controller methods.

---

## Suspend / unsuspend behaviour

When `PATCH /admin/creators/{id}/suspend` is called the backend:

1. Sets `creator.deletedAt = now()` (soft-delete — hides from public storefront)
2. Sets `user.suspended = true` (blocks login)
3. Sets `status = SUSPENDED` on all products belonging to that creator

When `PATCH /admin/creators/{id}/unsuspend` is called:

1. Clears `creator.deletedAt = null`
2. Sets `user.suspended = false`
3. Restores all products (reverses the suspension)

`AdminCreatorRow.suspended` is derived from `deletedAt IS NOT NULL` — there is no separate status column on the `creators` table.

---

## Money & timestamps

- All monetary values are **integers in pence (GBP)**. Never floats.
- All timestamps are **ISO-8601 UTC strings** (`2025-04-22T14:32:00Z`). `Instant` server-side.
- All IDs are opaque strings. User IDs are UUIDs. Creator/product IDs are slugs (e.g. `wanjiru`, `p-mara-01`).
- Order display IDs are human-readable strings (e.g. `UKN-1042`).

```

```
