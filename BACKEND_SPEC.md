# Ukena — Backend Specification (Java Spring Boot)

> **Audience.** Claude Code (or any AI assistant) working inside IntelliJ on a brand-new Spring Boot project that will be deployed to **Railway** and consumed by the existing Ukena React/TanStack frontend.
>
> **Goal.** Produce a modular, fast, secure backend that is **drop-in compatible** with the frontend's `src/services/*` layer. Every endpoint, DTO field name, status enum, and HTTP status code in this document is what the frontend already calls or expects.
>
> **Rule of thumb.** Match the JSON shapes in §6 exactly. If you change a field name, you must update the frontend at the same time — there is no translation layer.

---

## Table of contents

1. [Tech stack](#1-tech-stack)
2. [Project layout](#2-project-layout)
3. [Configuration & environment](#3-configuration--environment)
4. [Security model](#4-security-model)
5. [Cross-cutting conventions](#5-cross-cutting-conventions)
6. [Domain model & DTOs](#6-domain-model--dtos)
7. [REST API reference](#7-rest-api-reference)
8. [Validation rules](#8-validation-rules)
9. [Database schema (PostgreSQL)](#9-database-schema-postgresql)
10. [File / image uploads](#10-file--image-uploads)
11. [Seed data & dev profile](#11-seed-data--dev-profile)
12. [Testing strategy](#12-testing-strategy)
13. [Railway deployment](#13-railway-deployment)
14. [Frontend ↔ backend handshake checklist](#14-frontend--backend-handshake-checklist)
15. [Appendix A — example controller & service](#appendix-a--example-controller--service)
16. [Appendix B — example security config](#appendix-b--example-security-config)

---

## 1. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Language | **Java 21** (LTS) | Records, pattern matching, sealed types where they help. |
| Framework | **Spring Boot 3.3.x** | Spring Web, Validation, Security, Data JPA, Actuator. |
| Build | **Maven** (`pom.xml`) | Wrapper (`./mvnw`) committed. Gradle is fine if preferred — keep groupId/artifactId stable. |
| Database | **PostgreSQL 15+** | Provided by Railway plugin. |
| Migrations | **Flyway** | `src/main/resources/db/migration/V1__init.sql` etc. |
| Auth | **Spring Security + JWT (jjwt 0.12.x)** | Stateless, `HS256`, 24h expiry. |
| Mapping | **MapStruct 1.5+** | Compile-time entity ↔ DTO. |
| Object storage | **None server-side.** The browser uploads images directly to Cloudinary via an unsigned preset (see §10). The backend only stores the resulting URL strings. |
| Validation | **Jakarta Bean Validation** (`@Valid`, `@NotBlank`, etc.) | |
| Testing | JUnit 5 + Spring Boot Test + **Testcontainers** (Postgres) | Integration tests run a real DB. |
| Logging | SLF4J + Logback JSON encoder | Railway captures stdout. |
| API docs | **springdoc-openapi 2.x** | Swagger UI at `/api/swagger-ui.html` (dev only). |
| Containerisation | **Cloud Native Buildpacks** via `spring-boot:build-image` (no Dockerfile needed) | Railway picks it up automatically. |

### Maven coordinates
```
groupId:    co.ukena
artifactId: ukena-backend
version:    0.1.0-SNAPSHOT
package:    co.ukena.backend
```

---

## 2. Project layout

A **feature-package** layout (NOT layer-package). Each feature owns its controller, service, repository, entities, DTOs, and mapper. Cross-cutting concerns live under `common/` and `security/`.

```
ukena-backend/
├── pom.xml
├── mvnw / mvnw.cmd
├── src/main/java/co/ukena/backend/
│   ├── UkenaBackendApplication.java
│   ├── common/
│   │   ├── ApiResponse.java               // Envelope { success, data, message, errors }
│   │   ├── ApiException.java              // RuntimeException + HttpStatus + errors
│   │   ├── GlobalExceptionHandler.java    // @RestControllerAdvice
│   │   ├── PageRequestUtil.java
│   │   └── EnumUtil.java
│   ├── config/
│   │   ├── CorsConfig.java                // see §5
│   │   ├── OpenApiConfig.java
│   │   └── JacksonConfig.java
│   ├── security/
│   │   ├── SecurityConfig.java            // see Appendix B
│   │   ├── JwtService.java
│   │   ├── JwtAuthFilter.java
│   │   ├── AuthEntryPoint.java            // 401 JSON envelope
│   │   ├── AccessDeniedHandlerImpl.java   // 403 JSON envelope
│   │   └── CurrentUser.java               // @AuthenticationPrincipal helper
│   ├── auth/
│   │   ├── AuthController.java            // /api/auth/*
│   │   ├── AuthService.java
│   │   ├── dto/LoginRequest.java
│   │   ├── dto/RegisterRequest.java
│   │   ├── dto/AuthResponse.java          // { token, user }
│   │   └── dto/AuthUserDto.java
│   ├── user/
│   │   ├── User.java                      // @Entity
│   │   ├── UserRole.java                  // enum ROLE_BUYER, ROLE_CREATOR, ROLE_ADMIN
│   │   ├── UserRepository.java
│   │   └── UserService.java
│   ├── creator/
│   │   ├── Creator.java                   // @Entity
│   │   ├── CreatorRepository.java
│   │   ├── CreatorController.java         // /api/creators/*
│   │   ├── CreatorService.java
│   │   ├── CreatorMapper.java             // MapStruct
│   │   └── dto/{CreatorSummary,CreatorDetail,CreatorProfileUpdate}.java
│   ├── product/
│   │   ├── Product.java
│   │   ├── ProductRepository.java
│   │   ├── ProductController.java         // /api/products/*  +  /api/creators/me/products
│   │   ├── ProductService.java
│   │   ├── ProductMapper.java
│   │   └── dto/{ProductDto,ProductCreateRequest,ProductUpdateRequest}.java
│   ├── order/
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   ├── OrderStatus.java
│   │   ├── OrderRepository.java
│   │   ├── OrderController.java           // /api/orders + /api/creators/me/orders + /api/admin/orders
│   │   ├── OrderService.java
│   │   ├── OrderMapper.java
│   │   └── dto/{OrderDto,OrderItemDto,CreateOrderRequest,DeliveryDto,UpdateStatusRequest}.java
│   ├── application/
│   │   ├── ArtisanApplication.java        // @Entity
│   │   ├── ApplicationStatus.java
│   │   ├── ApplicationRepository.java
│   │   ├── ApplicationController.java     // POST /api/applications + /api/admin/applications/*
│   │   ├── ApplicationService.java
│   │   └── dto/{ApplicationDto,SubmitRequest,StatusUpdateRequest}.java
│   ├── cart/
│   │   ├── CartLine.java                  // @Entity (one row per buyer × productId)
│   │   ├── CartRepository.java
│   │   ├── CartController.java            // /api/cart, /api/cart/sync
│   │   ├── CartService.java
│   │   └── dto/CartLineDto.java
│   ├── saved/
│   │   ├── SavedItem.java                 // @Entity (buyer × kind × refId)
│   │   ├── SavedRepository.java
│   │   ├── SavedController.java           // /api/users/me/saved/*
│   │   └── SavedService.java
│   ├── address/
│   │   ├── BuyerAddress.java              // @Entity
│   │   ├── BuyerAddressRepository.java
│   │   ├── BuyerAddressController.java    // /api/users/me/addresses/*
│   │   ├── BuyerAddressService.java
│   │   └── dto/BuyerAddressDto.java
│   └── admin/
│       ├── AdminController.java           // buyers, payouts, reviews, featured, product moderation
│       ├── AdminService.java
│       ├── PayoutEntity.java
│       ├── ReviewEntity.java
│       ├── FeaturedSlotEntity.java
│       ├── ProductModerationStatusEntity.java
│       └── dto/{AdminBuyerRow,CreatorPayoutDto,ProductReviewDto,FeaturedSlotDto,ProductModerationRow}.java
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   ├── db/migration/V1__init.sql
│   ├── db/migration/V2__seed.sql           // dev profile only
│   └── logback-spring.xml
└── src/test/java/co/ukena/backend/
    ├── auth/AuthFlowIT.java
    ├── creator/CreatorApiIT.java
    ├── product/ProductApiIT.java
    ├── order/OrderApiIT.java
    └── support/PostgresContainer.java
```

### Why feature-packages?
- Easy to find everything related to "orders" in one place.
- Encourages clean module boundaries; cross-feature calls go through the **service** of the other feature, not the repository.
- Adding a new feature = adding one folder.

---

## 3. Configuration & environment

### `application.yml` (base)
```yaml
spring:
  application:
    name: ukena-backend
  jpa:
    hibernate:
      ddl-auto: validate                  # Flyway owns the schema
    open-in-view: false
    properties:
      hibernate.jdbc.time_zone: UTC
  flyway:
    enabled: true
    baseline-on-migrate: true
  servlet:
    multipart:
      max-file-size: 8MB
      max-request-size: 24MB

server:
  port: ${PORT:8080}                      # Railway injects PORT
  servlet:
    context-path: /api                    # All routes live under /api

management:
  endpoints.web.exposure.include: health,info
  endpoint.health.show-details: never

ukena:
  jwt:
    secret: ${JWT_SECRET}                 # 256-bit base64 string
    expiration-hours: 24
  cors:
    allowed-origins: ${CORS_ORIGINS:http://localhost:5173,http://localhost:3000}
  # Media uploads happen browser → Cloudinary directly. The backend does not
  # store or proxy any binaries. The Cloudinary credentials live on the frontend
  # (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET) — see §10.

springdoc:
  swagger-ui:
    path: /swagger-ui.html
  api-docs:
    path: /v3/api-docs
```

### `application-dev.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ukena
    username: ukena
    password: ukena
logging.level.co.ukena: DEBUG
```

### `application-prod.yml`
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}                  # Railway provides
    username: ${PGUSER}
    password: ${PGPASSWORD}
logging.level.root: INFO
```

### Required environment variables on Railway
| Name | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | JDBC URL (Railway Postgres plugin) | `jdbc:postgresql://...:5432/railway` |
| `PGUSER` / `PGPASSWORD` | Postgres credentials | injected |
| `PORT` | HTTP port | injected |
| `JWT_SECRET` | 256-bit random string, base64 | `openssl rand -base64 64` |
| `CORS_ORIGINS` | Comma-separated origins | `https://ukena.co.uk,https://www.ukena.co.uk` |
| _(no media vars)_ | Image binaries never reach the backend. The browser uploads to Cloudinary directly. | — |
| `SPRING_PROFILES_ACTIVE` | `prod` | `prod` |

---

## 4. Security model

### Roles
```
ROLE_BUYER     — default for self-registered users
ROLE_CREATOR   — assigned by admin when an application is APPROVED
ROLE_ADMIN     — manually granted via DB (never via API)
```

### Auth flow
1. **Register** — `POST /auth/register` → user created with `ROLE_BUYER` (the only self-serve role). Returns `{ token, user }`.
2. **Login** — `POST /auth/login` → verify bcrypt password → issue JWT. Returns `{ token, user }`.
3. **Logout** — `POST /auth/logout` → 204. (Stateless JWT — server-side blacklisting is out of scope for v1; the frontend simply discards the token.)
4. **Me** — `GET /auth/me` → returns the current `AuthUserDto` (used by the frontend for hydration).

### JWT
- Algorithm: **HS256**.
- Claims: `sub` = user id (UUID string), `email`, `role`, `creatorId` (nullable), `iat`, `exp`.
- Header: `Authorization: Bearer <token>`.
- Filter chain: `JwtAuthFilter` runs once per request, parses the header, populates `SecurityContextHolder`.
- On invalid/expired token → **HTTP 401** with the standard envelope (see §5). The frontend's `triggerUnauthorized()` will boot the user back to `/signin`.

### Password storage
- BCrypt (`BCryptPasswordEncoder`, strength 12).

### Authorisation (method-level)
Use `@PreAuthorize` on controller methods:
```java
@PreAuthorize("hasRole('ADMIN')")
@PreAuthorize("hasAnyRole('CREATOR','ADMIN')")
@PreAuthorize("isAuthenticated()")
```

### Public endpoints (no auth required)
```
POST   /auth/login
POST   /auth/register
POST   /applications
GET    /creators
GET    /creators/{id}
GET    /products
GET    /products/{id}
GET    /products?creatorId={id}
GET    /actuator/health
```

Everything else requires a valid JWT.

---

## 5. Cross-cutting conventions

### 5.1 Response envelope

**Every** JSON response (success and error) uses this shape:

```json
{
  "success": true,
  "data": { /* payload — never null on success */ },
  "message": "Optional human-readable message",
  "errors": []
}
```

Error example:
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": ["email: must be a well-formed email address"]
}
```

The frontend's `unwrap()` already handles this. Implement it with a generic helper:

```java
public record ApiResponse<T>(boolean success, T data, String message, List<String> errors) {
  public static <T> ApiResponse<T> ok(T data)            { return new ApiResponse<>(true, data, null, List.of()); }
  public static <T> ApiResponse<T> ok(T data, String m)  { return new ApiResponse<>(true, data, m, List.of()); }
  public static <T> ApiResponse<T> fail(String m, List<String> errs) { return new ApiResponse<>(false, null, m, errs == null ? List.of() : errs); }
}
```

### 5.2 HTTP status codes

| Scenario | Status |
|---|---|
| Successful GET / PUT / PATCH | `200 OK` |
| Successful POST that creates a resource | `201 Created` |
| Successful action with no body (logout, delete, suspend) | `204 No Content` |
| Validation failure | `400 Bad Request` |
| Missing/invalid JWT | `401 Unauthorized` |
| Authenticated but wrong role | `403 Forbidden` |
| Resource not found | `404 Not Found` |
| Conflict (duplicate email, etc.) | `409 Conflict` |
| Unhandled server error | `500 Internal Server Error` |

### 5.3 GlobalExceptionHandler

Map at minimum:
- `MethodArgumentNotValidException` → 400 with each field error in `errors[]`.
- `ConstraintViolationException` → 400.
- `ApiException` (custom) → its embedded status.
- `BadCredentialsException` / `AuthenticationException` → 401.
- `AccessDeniedException` → 403.
- `EntityNotFoundException` → 404.
- `DataIntegrityViolationException` → 409 (with friendly message).
- `Exception` (fallback) → 500, log full stack, return generic message (no leaking).

### 5.4 CORS

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
  var cfg = new CorsConfiguration();
  cfg.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
  cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
  cfg.setAllowedHeaders(List.of("Content-Type","Authorization","Accept","Origin"));
  cfg.setExposedHeaders(List.of("Authorization"));
  cfg.setAllowCredentials(true);
  cfg.setMaxAge(3600L);
  var src = new UrlBasedCorsConfigurationSource();
  src.registerCorsConfiguration("/**", cfg);
  return src;
}
```

The frontend uses `credentials: "include"` so `allowCredentials` MUST be `true` and the origin MUST be explicit (no `*`).

### 5.5 Pagination & filtering
Where listed (creators, products), accept query params:
```
?page=0&pageSize=20&craft=Weaving&region=Maragua
```
Default `page=0`, `pageSize=20`, max `pageSize=100`. For v1 the frontend doesn't paginate yet — return the full filtered list, but build the endpoints so they can paginate later.

### 5.6 Money

All monetary values are integers in **pence (GBP)**. Field name is `pricePence` / `totalPence`. Never use floats.

### 5.7 Timestamps

ISO-8601 UTC strings (`2025-04-22T14:32:00Z`). Use `Instant` server-side.

### 5.8 IDs

- **Users / Creators / Products / Orders / Applications / Reviews:** UUID strings (`UUID.randomUUID().toString()`). The frontend treats IDs as opaque strings.
- **Order display IDs** (e.g. `UKN-1042`) — generate a separate `displayId` column for orders. The frontend shows this; internal joins use the UUID.

### 5.9 Logging

- Use SLF4J. Never `System.out`.
- Log levels: `INFO` for business events (order placed, payout sent), `WARN` for auth failures, `ERROR` for unexpected.
- Never log passwords, JWTs, or full card numbers.

---

## 6. Domain model & DTOs

> **The frontend already uses these exact field names.** Do not rename; do not nest differently. JSON property names are camelCase.

### 6.1 `AuthUserDto`
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "fullName": "Wanjiru Kamau",
  "role": "ROLE_BUYER | ROLE_CREATOR | ROLE_ADMIN",
  "creatorId": "wanjiru"          // present only when role = ROLE_CREATOR
}
```

### 6.2 `AuthResponse`
```json
{ "token": "<jwt>", "user": { /* AuthUserDto */ } }
```

### 6.3 `CreatorSummary`
```json
{
  "id": "wanjiru",
  "firstName": "Wanjiru",
  "fullName": "Wanjiru Kamau",
  "craft": "Weaving",
  "region": "Maragua",
  "hook": "Sisal baskets dyed with avocado pit and indigo.",
  "image": "https://cdn.../wanjiru.jpg"
}
```

### 6.4 `CreatorDetail` (extends `CreatorSummary`)
```json
{
  "id": "...", "firstName": "...", "fullName": "...", "craft": "...", "region": "...", "hook": "...", "image": "...",
  "portraitImage": "https://cdn.../portrait.jpg",
  "headerImage":   "https://cdn.../header.jpg",
  "storyParagraphs": ["...", "..."],
  "pullQuote": "A basket is never just a basket.",
  "processSteps": [
    { "image": "https://cdn.../step-1.jpg", "caption": "Splitting the sisal." }
  ],
  "culturalMeaning": ["..."],
  "mapPin": { "lat": -0.78, "lng": 37.16, "label": "Maragua, Murang'a" }   // nullable
}
```

### 6.5 `CreatorProfileUpdate` (PUT body)
All fields optional — only provided fields are updated.
```json
{
  "firstName": "...",
  "fullName": "...",
  "region": "...",
  "craft": "...",
  "storyParagraphs": ["...", "..."],
  "pullQuote": "...",
  "portraitImage": "https://cdn.../...jpg",
  "headerImage":   "https://cdn.../...jpg"
}
```

### 6.6 `ProductDto`
```json
{
  "id": "p-mara-01",
  "name": "Mara Storage Basket",
  "pricePence": 12500,
  "heroImage": "https://cdn.../hero.jpg",
  "gallery": [
    { "src": "https://cdn.../1.jpg", "alt": "Side view",      "kind": "product" },
    { "src": "https://cdn.../2.jpg", "alt": "Wanjiru weaving","kind": "process" }
  ],
  "pieceStory": "Coiled over four days from sisal grown on...",
  "materials": ["Sisal", "Natural dye"],
  "dimensions": "Ø 32 cm × H 28 cm",
  "care": "Wipe clean. Keep out of direct sun.",
  "creator": {
    "id": "wanjiru",
    "firstName": "Wanjiru",
    "fullName": "Wanjiru Kamau",
    "region": "Maragua",
    "craft": "Weaving",
    "portrait": "https://cdn.../portrait.jpg"
  }
}
```

### 6.7 `ProductCreateRequest` / `ProductUpdateRequest`
```json
{
  "name": "...",
  "pricePence": 12500,
  "heroImage": "https://cdn.../...jpg",
  "gallery": [ { "src": "...", "alt": "...", "kind": "product" } ],
  "pieceStory": "...",
  "materials": ["..."],
  "dimensions": "...",
  "care": "..."
}
```
`creatorId` is **inferred from the JWT** — never accept it from the body.

### 6.8 `OrderDto`
```json
{
  "id": "UKN-1042",                     // displayId — opaque string
  "createdAt": "2025-04-22T14:32:00Z",
  "status": "PENDING | PREPARING | SHIPPED | DELIVERED | CANCELLED",
  "totalPence": 37500,
  "buyer": { "fullName": "Eleanor Reid", "email": "eleanor@example.co.uk" },
  "items": [
    {
      "productId": "p-mara-01",
      "name": "Mara Storage Basket",
      "quantity": 1,
      "pricePence": 12500,
      "image": "https://cdn.../hero.jpg",
      "creator": { "id": "wanjiru", "fullName": "Wanjiru Kamau", "region": "Maragua" }
    }
  ],
  "delivery": {
    "fullName": "Eleanor Reid",
    "email": "eleanor@example.co.uk",
    "addressLine1": "12 Linden Mews",
    "addressLine2": null,
    "city": "London",
    "postcode": "E2 8DY",
    "country": "United Kingdom"
  }
}
```

### 6.9 `CreateOrderRequest`
```json
{
  "items": [ { "productId": "p-mara-01", "quantity": 1 } ],
  "delivery": { "fullName": "...", "email": "...", "addressLine1": "...", "addressLine2": null, "city": "...", "postcode": "...", "country": "United Kingdom" }
}
```
`totalPence`, `buyer`, `creator` per item — all computed server-side from product lookups. **Never** trust client-provided prices.

### 6.10 `UpdateStatusRequest`
```json
{ "status": "PREPARING | SHIPPED | DELIVERED | CANCELLED" }
```

### 6.11 `ArtisanApplication`
```json
{
  "id": "APP-204",
  "fullName": "Wairimu Njoroge",
  "email": "wairimu@gmail.com",
  "region": "Limuru, Kiambu",
  "craft": "Weaving",
  "yearsOfPractice": 9,
  "story": "I weave market totes from sisal...",
  "submittedAt": "2025-04-21T09:12:00Z",
  "status": "PENDING | UNDER_REVIEW | APPROVED | REJECTED | CHANGES_REQUESTED",
  "portrait": "https://cdn.../portrait.jpg",
  "workSample": "https://cdn.../work.jpg"
}
```

### 6.12 `ApplicationSubmitRequest`
```json
{
  "fullName": "...",
  "email": "...",
  "region": "...",
  "craft": "Weaving",
  "yearsOfPractice": 9,
  "story": "...",
  "photos": ["https://cdn.../portrait.jpg", "https://cdn.../work.jpg"]   // 1-5 URLs
}
```

### 6.13 `ApplicationStatusUpdate`
```json
{ "status": "APPROVED", "notes": "Lovely portfolio. Welcome." }
```

When status transitions to `APPROVED`:
- Create a `User` with `role = ROLE_CREATOR` (random temp password emailed out — or magic link in v2; for v1 just log it).
- Create a `Creator` row populated from the application (firstName parsed from fullName, region, craft, portrait image).
- Link `User.creatorId = Creator.id`.

### 6.14 `CreatorPayoutDto`
```json
{
  "creatorId": "wanjiru",
  "fullName": "Wanjiru Kamau",
  "region": "Maragua",
  "craft": "Weaving",
  "pendingPence": 38400,
  "paidThisMonthPence": 96000,
  "lastPaidAt": "2025-04-16T00:00:00Z",
  "totalLifetimePence": 1248000
}
```

### 6.15 `ProductReviewDto`
```json
{
  "id": "REV-512",
  "productId": "p-mara-01",
  "productName": "Mara Storage Basket",
  "buyerName": "Eleanor R.",
  "rating": 5,                          // 1-5
  "body": "Worth every penny.",
  "submittedAt": "2025-04-20T00:00:00Z",
  "status": "PUBLISHED | PENDING | FLAGGED | REMOVED"
}
```

### 6.16 `FeaturedSlotDto`
```json
{ "position": 1, "creatorId": "wanjiru", "productId": "p-mara-01" }
```
4 slots total (position 1-4). `creatorId` and `productId` may be `null` to clear a slot.

### 6.17 `AdminBuyerRow`
```json
{
  "id": "uuid",
  "fullName": "Eleanor Reid",
  "email": "eleanor@example.co.uk",
  "city": "London",
  "orderCount": 3,
  "totalPence": 87500,
  "lastOrderAt": "2025-04-20T00:00:00Z",
  "suspended": false
}
```

### 6.18 `CartLineDto`
```json
{
  "productId": "p-mara-01",
  "quantity": 2,
  "name": "Mara Storage Basket",
  "pricePence": 12500,
  "image": "https://cdn.../hero.jpg",
  "creator": { "id": "wanjiru", "fullName": "Wanjiru Kamau", "region": "Maragua" }
}
```
The cart is a **flat list of `CartLineDto`** keyed by `productId`. Snapshots
of name/price/image/creator are stored so the bag renders without a refetch
even if the underlying product is later edited or removed.

### 6.19 `SavedCollections`
```json
{
  "products": ["p-mara-01", "p-mara-04"],
  "creators": ["wanjiru", "kibet"]
}
```
Saved lists are returned as plain ID arrays (the frontend joins them against
the products / creators caches itself). Add / remove endpoints return the
**updated array**, not the toggled item.

### 6.20 `BuyerAddress`
```json
{
  "id": "addr-7f3c…",
  "label": "Home",
  "fullName": "Eleanor Reid",
  "line1": "12 Linden Mews",
  "line2": null,
  "city": "London",
  "postcode": "E2 8DY",
  "country": "United Kingdom",
  "isDefault": true
}
```
`POST` / `PUT` bodies omit `id`. At most one address per buyer may have
`isDefault: true` — the server enforces this when a new default is set.

### 6.21 `ProductModerationRow`
```json
{ "productId": "p-mara-01", "status": "LIVE | DRAFT | TAKEN_DOWN" }
```

### 6.22 Cloudinary upload result (frontend-only — for reference)
The browser receives this directly from Cloudinary; the backend never sees it.
The frontend persists `url` (and optionally `publicId`) into product / profile /
application payloads as plain strings.
```json
{ "url": "https://res.cloudinary.com/.../abc123.jpg", "publicId": "ukena/abc123" }
```

---

## 7. REST API reference

> Base path: **`/api`** (set via `server.servlet.context-path`).
> All authenticated endpoints expect `Authorization: Bearer <jwt>`.
> All responses are wrapped in the §5.1 envelope.

### 7.1 Auth
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST | `/auth/register` | public | `RegisterRequest` | `AuthResponse` (201) |
| POST | `/auth/login` | public | `LoginRequest` | `AuthResponse` |
| POST | `/auth/logout` | any | — | 204 |
| GET  | `/auth/me` | any | — | `AuthUserDto` |

`RegisterRequest`:
```json
{ "email": "...", "password": "...", "fullName": "...", "role": "ROLE_BUYER" }
```
**Server MUST ignore any role except `ROLE_BUYER` here.** Creator/admin roles are assigned via the application flow / DB seed.

### 7.2 Creators
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET | `/creators?craft=&region=&page=&pageSize=` | public | — | `CreatorSummary[]` |
| GET | `/creators/{id}` | public | — | `CreatorDetail` |
| GET | `/creators/me` | CREATOR | — | `CreatorDetail` (uses JWT.creatorId) |
| PUT | `/creators/me` | CREATOR | `CreatorProfileUpdate` | `CreatorDetail` |

### 7.3 Products
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET    | `/products` | public | — | `ProductDto[]` |
| GET    | `/products?creatorId={id}` | public | — | `ProductDto[]` |
| GET    | `/products/{id}` | public | — | `ProductDto` |
| POST   | `/creators/me/products` | CREATOR | `ProductCreateRequest` | `ProductDto` (201) |
| PUT    | `/creators/me/products/{id}` | CREATOR (owner) | `ProductUpdateRequest` | `ProductDto` |
| DELETE | `/creators/me/products/{id}` | CREATOR (owner) | — | 204 |

### 7.4 Orders
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST  | `/orders` | BUYER | `CreateOrderRequest` | `OrderDto` (201) |
| GET   | `/orders/me` | BUYER | — | `OrderDto[]` |
| GET   | `/creators/me/orders` | CREATOR | — | `OrderDto[]` (only orders containing this creator's items) |
| GET   | `/admin/orders` | ADMIN | — | `OrderDto[]` |
| PATCH | `/creators/me/orders/{id}/status` | CREATOR | `UpdateStatusRequest` | `OrderDto` |
| PATCH | `/admin/orders/{id}/refund` | ADMIN | `{}` | `OrderDto` (status → CANCELLED, refund logged) |

**Status transitions allowed for creators:**
`PENDING → PREPARING`, `PREPARING → SHIPPED`, `SHIPPED → DELIVERED`. Anything else → 400.

### 7.5 Applications
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| POST  | `/applications` | public | `ApplicationSubmitRequest` | `ArtisanApplication` (201) |
| GET   | `/admin/applications` | ADMIN | — | `ArtisanApplication[]` |
| GET   | `/admin/applications/{id}` | ADMIN | — | `ArtisanApplication` |
| PATCH | `/admin/applications/{id}/status` | ADMIN | `ApplicationStatusUpdate` | `ArtisanApplication` |

### 7.6 Admin — buyers, payouts, reviews, featured, product moderation
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET   | `/admin/buyers` | ADMIN | — | `AdminBuyerRow[]` |
| PATCH | `/admin/buyers/{id}/suspend` | ADMIN | — | 204 |
| GET   | `/admin/payouts` | ADMIN | — | `CreatorPayoutDto[]` |
| POST  | `/admin/payouts/{creatorId}/pay` | ADMIN | `{}` | `CreatorPayoutDto` (zero pendingPence, log payment) |
| POST  | `/admin/payouts/run` | ADMIN | `{}` | `CreatorPayoutDto[]` (pay every creator, end-of-cycle) |
| GET   | `/admin/reviews` | ADMIN | — | `ProductReviewDto[]` |
| PATCH | `/admin/reviews/{id}/status` | ADMIN | `{ "status": "PUBLISHED|REMOVED|FLAGGED|PENDING" }` | `ProductReviewDto` |
| GET   | `/admin/featured` | ADMIN | — | `FeaturedSlotDto[]` (length 4) |
| PUT   | `/admin/featured` | ADMIN | `FeaturedSlotDto[]` | `FeaturedSlotDto[]` |
| GET   | `/admin/products/statuses` | ADMIN | — | `ProductModerationRow[]` |
| PATCH | `/admin/products/{id}/status` | ADMIN | `{ "status": "LIVE\|DRAFT\|TAKEN_DOWN" }` | `ProductModerationRow` |
| PATCH | `/admin/creators/{id}/suspend` | ADMIN | — | 204 |

### 7.7 Cart (buyer-scoped, persistent across devices)
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET  | `/cart` | BUYER | — | `CartLineDto[]` |
| PUT  | `/cart` | BUYER | `CartLineDto[]` | `CartLineDto[]` (full replace — server snaps name/price/image from product table) |
| POST | `/cart/sync` | BUYER | `{ "items": CartLineDto[] }` | `CartLineDto[]` |

`/cart/sync` merges the guest-side local cart with whatever the server already
holds. Merge rule: for duplicate `productId`s take the **max** quantity across
both sets. Called once on login by the frontend.

### 7.8 Saved (wishlist) — buyer-scoped
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET    | `/users/me/saved/products`            | BUYER | — | `string[]` (product IDs) |
| POST   | `/users/me/saved/products/{id}`       | BUYER | — | `string[]` (full updated list) |
| DELETE | `/users/me/saved/products/{id}`       | BUYER | — | `string[]` (full updated list) |
| GET    | `/users/me/saved/creators`            | BUYER | — | `string[]` (creator IDs) |
| POST   | `/users/me/saved/creators/{id}`       | BUYER | — | `string[]` |
| DELETE | `/users/me/saved/creators/{id}`       | BUYER | — | `string[]` |
| POST   | `/users/me/saved/sync`                | BUYER | `SavedCollections` | `SavedCollections` |

`/sync` unions the guest local set with the server set. Called once on login.

### 7.9 Buyer addresses
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET    | `/users/me/addresses`                 | BUYER | — | `BuyerAddress[]` |
| POST   | `/users/me/addresses`                 | BUYER | `BuyerAddress` (no `id`) | `BuyerAddress` (201) |
| PUT    | `/users/me/addresses/{id}`            | BUYER | `BuyerAddress` (no `id`) | `BuyerAddress` |
| DELETE | `/users/me/addresses/{id}`            | BUYER | — | 204 |
| POST   | `/users/me/addresses/{id}/default`    | BUYER | `{}` | `BuyerAddress[]` (full list with new default) |

When deleting the default address, the server promotes the next address (if any)
to default. Setting a new default automatically clears the flag on the others.

### 7.10 Media (no backend endpoint)

There is **no `/api/media/upload`**. Image uploads go from the browser straight
to Cloudinary via an unsigned preset; see §10. The backend only ever stores
the resulting URL strings against products / portraits / applications.

---

## 8. Validation rules

Use Bean Validation annotations on every request DTO.

| Field | Rule |
|---|---|
| `email` | `@Email`, `@NotBlank`, `@Size(max=254)` |
| `password` | `@NotBlank`, `@Size(min=8, max=128)` |
| `fullName` | `@NotBlank`, `@Size(min=2, max=120)` |
| `region`, `craft` | `@NotBlank`, `@Size(max=120)` |
| `pricePence` | `@Min(1)`, `@Max(10_000_000)` |
| `quantity` | `@Min(1)`, `@Max(99)` |
| `name` (product) | `@NotBlank`, `@Size(max=200)` |
| `pieceStory`, `story` | `@Size(max=4000)` |
| `materials` | `@Size(max=20)` (each item `@Size(max=80)`) |
| `gallery` | `@Size(max=12)` |
| `photos` (application) | `@Size(min=1, max=5)`; each must be a valid URL |
| `yearsOfPractice` | `@Min(0)`, `@Max(80)` |
| `addressLine1` | `@NotBlank`, `@Size(max=200)` |
| `postcode` | `@NotBlank`, `@Size(max=20)` |
| `city`, `country` | `@NotBlank`, `@Size(max=120)` |
| `rating` | `@Min(1)`, `@Max(5)` |
| `position` (featured) | `@Min(1)`, `@Max(4)` |

Status enums: validate via `@Pattern` or a custom `@ValidEnum` annotation against the allowed values listed in §6.

---

## 9. Database schema (PostgreSQL)

> All tables use `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` unless noted. Enable `pgcrypto`.

`V1__init.sql`:
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('ROLE_BUYER','ROLE_CREATOR','ROLE_ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING','PREPARING','SHIPPED','DELIVERED','CANCELLED');
CREATE TYPE application_status AS ENUM ('PENDING','UNDER_REVIEW','APPROVED','REJECTED','CHANGES_REQUESTED');
CREATE TYPE review_status AS ENUM ('PUBLISHED','PENDING','FLAGGED','REMOVED');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(254) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  role user_role NOT NULL DEFAULT 'ROLE_BUYER',
  creator_id VARCHAR(80),                                        -- FK to creators.id (slug)
  suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE creators (
  id VARCHAR(80) PRIMARY KEY,                                     -- slug e.g. 'wanjiru'
  first_name VARCHAR(80) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  craft VARCHAR(120) NOT NULL,
  region VARCHAR(120) NOT NULL,
  hook TEXT NOT NULL,
  image TEXT NOT NULL,
  portrait_image TEXT NOT NULL,
  header_image TEXT NOT NULL,
  story_paragraphs JSONB NOT NULL DEFAULT '[]'::jsonb,
  pull_quote TEXT,
  process_steps JSONB NOT NULL DEFAULT '[]'::jsonb,                -- [{image,caption}]
  cultural_meaning JSONB NOT NULL DEFAULT '[]'::jsonb,
  map_pin JSONB,                                                   -- {lat,lng,label}
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ADD CONSTRAINT users_creator_fk
  FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE SET NULL;

CREATE TABLE products (
  id VARCHAR(80) PRIMARY KEY,                                      -- slug e.g. 'p-mara-01'
  creator_id VARCHAR(80) NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  price_pence INTEGER NOT NULL CHECK (price_pence > 0),
  hero_image TEXT NOT NULL,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  piece_story TEXT NOT NULL,
  materials JSONB NOT NULL DEFAULT '[]'::jsonb,
  dimensions VARCHAR(200) NOT NULL,
  care TEXT NOT NULL,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX products_creator_idx ON products(creator_id);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_id VARCHAR(20) UNIQUE NOT NULL,                          -- 'UKN-1042'
  buyer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  buyer_full_name VARCHAR(120) NOT NULL,
  buyer_email VARCHAR(254) NOT NULL,
  status order_status NOT NULL DEFAULT 'PENDING',
  total_pence INTEGER NOT NULL,
  delivery JSONB NOT NULL,                                         -- DeliveryDto blob
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX orders_buyer_user_idx ON orders(buyer_user_id);
CREATE INDEX orders_status_idx ON orders(status);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(80) NOT NULL REFERENCES products(id),
  creator_id VARCHAR(80) NOT NULL REFERENCES creators(id),
  product_name VARCHAR(200) NOT NULL,                              -- snapshot
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_pence INTEGER NOT NULL,                                    -- snapshot
  image TEXT NOT NULL,                                             -- snapshot
  creator_full_name VARCHAR(120) NOT NULL,
  creator_region VARCHAR(120) NOT NULL
);

CREATE INDEX order_items_order_idx ON order_items(order_id);
CREATE INDEX order_items_creator_idx ON order_items(creator_id);

CREATE TABLE artisan_applications (
  id VARCHAR(20) PRIMARY KEY,                                      -- 'APP-204'
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  region VARCHAR(120) NOT NULL,
  craft VARCHAR(120) NOT NULL,
  years_of_practice INTEGER NOT NULL,
  story TEXT NOT NULL,
  portrait TEXT NOT NULL,
  work_sample TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payouts (
  creator_id VARCHAR(80) PRIMARY KEY REFERENCES creators(id) ON DELETE CASCADE,
  pending_pence INTEGER NOT NULL DEFAULT 0,
  paid_this_month_pence INTEGER NOT NULL DEFAULT 0,
  total_lifetime_pence INTEGER NOT NULL DEFAULT 0,
  last_paid_at TIMESTAMPTZ
);

CREATE TABLE reviews (
  id VARCHAR(20) PRIMARY KEY,                                      -- 'REV-512'
  product_id VARCHAR(80) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  buyer_name VARCHAR(120) NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  status review_status NOT NULL DEFAULT 'PENDING',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE featured_slots (
  position SMALLINT PRIMARY KEY CHECK (position BETWEEN 1 AND 4),
  creator_id VARCHAR(80) REFERENCES creators(id) ON DELETE SET NULL,
  product_id VARCHAR(80) REFERENCES products(id) ON DELETE SET NULL
);

INSERT INTO featured_slots(position) VALUES (1),(2),(3),(4);
```

---

## 10. File / image uploads

### Endpoint
`POST /api/media/upload` — `multipart/form-data` with field `file`. Authenticated.

### Server validation
- Allowed MIME: `image/jpeg`, `image/png`, `image/webp`.
- Max size: 8 MB (Spring already enforces via `multipart.max-file-size`).
- Reject anything else with 400.
- Generate filename: `<uuid>.<ext>`. Never trust the client's filename.

### Provider
- **Cloudinary** is recommended for v1 (free tier, automatic CDN, transformations). Set `MEDIA_PROVIDER=cloudinary` and `CLOUDINARY_URL`.
- Alternative: any S3-compatible bucket (Backblaze B2, Cloudflare R2). Build a tiny `MediaService` interface with two implementations and a Spring conditional.

### Returned URL
Public, immutable CDN URL. The frontend stores this URL in product DTOs, profile fields, and application photos.

---

## 11. Seed data & dev profile

When `spring.profiles.active=dev`, run `V2__seed.sql` after `V1__init.sql`. It must create:
- 1 admin user (`admin@admin.ukena` / password `admin1234`).
- 8 creators matching the slugs in `src/components/explore/creators-data.ts`: `wanjiru`, `naserian`, `mumo`, `akinyi`, `aluoch`, `otieno`, `saitoti`, `kibet`. Use the same names, regions, crafts the frontend currently displays.
- 1 corresponding `User` per creator (`<slug>@creator.ukena` / password `creator1234`, `creator_id` set).
- 1 buyer user (`buyer@buyer.ukena` / password `buyer1234`).
- 8-12 products distributed across creators, with prices and images.
- 5-7 seed orders across the status spectrum.
- 5 artisan applications across the status spectrum.

This makes the existing frontend mock data instantly recognisable when the backend takes over.

---

## 12. Testing strategy

### Unit tests
- Service-layer tests with Mockito for repositories.
- Mappers (MapStruct) are auto-tested by their generated code; add one round-trip test per mapper.

### Integration tests (Testcontainers)
- Spin up a real Postgres container.
- One IT class per feature covers: happy path, validation failure, auth failure (anonymous), authz failure (wrong role), not-found.
- `AuthFlowIT` should: register → login → call `/auth/me` → call a protected endpoint → 401 after fake token tampering.

### Coverage target
- 70%+ overall, **90%+ on controllers and security**.

### Smoke test against the running frontend
Start the backend on `:8080`, set the frontend `VITE_USE_MOCK_API=false`, and walk through:
1. Sign in as buyer → place an order → see it in `/account/orders`.
2. Sign in as creator → see the order in `/creator/orders` → mark shipped.
3. Sign in as admin → approve an application → confirm a new creator appears.

---

## 13. Railway deployment

### One-time setup
1. **Create a Railway project**, attach the **Postgres** plugin.
2. In the service settings, set the build command to:
   ```
   ./mvnw -DskipTests spring-boot:build-image -Dspring-boot.build-image.imageName=ukena-backend
   ```
   …or simply rely on Railway's Java buildpack (it detects Maven and builds the fat JAR automatically). The buildpack route is simpler — start with that.
3. Set environment variables (see §3).
4. Set `SPRING_PROFILES_ACTIVE=prod`.
5. Generate `JWT_SECRET`: `openssl rand -base64 64` → paste into Railway env.
6. After first deploy, manually run the SQL in `V2__seed.sql` against the Railway Postgres if you want demo data.

### Health check
Railway will probe `/api/actuator/health`. The Actuator endpoint should return `200 {"status":"UP"}`.

### Domain
- Default Railway domain works for testing.
- Production: point `api.ukena.co.uk` (or chosen subdomain) at the Railway service. Update the frontend's `VITE_API_BASE_URL` in `.env.production` to match.

### Cold-start tip
Railway suspends idle services. Use the free [UptimeRobot](https://uptimerobot.com) on `/api/actuator/health` every 5 minutes if you want it warm.

---

## 14. Frontend ↔ backend handshake checklist

When you flip `VITE_USE_MOCK_API=false`, walk this list:

- [ ] CORS origin in `CORS_ORIGINS` includes the deployed frontend domain.
- [ ] All responses use the §5.1 envelope (`{ success, data, message, errors }`).
- [ ] All field names match §6 exactly (camelCase, no renames).
- [ ] `pricePence` and `totalPence` are integers, never floats.
- [ ] All timestamps are ISO-8601 UTC strings.
- [ ] `/auth/login` and `/auth/register` return `{ token, user }` — not nested differently.
- [ ] `/creators/me`, `/creators/me/products`, `/creators/me/orders` infer `creatorId` from the JWT, not from a path/body param.
- [ ] `/orders` POST recomputes `totalPence` from products — never trusts the client total.
- [ ] 401 responses use the envelope so the frontend's `triggerUnauthorized()` fires cleanly.
- [ ] `/media/upload` accepts `multipart/form-data` with field name **`file`** (the frontend sends exactly that).
- [ ] `OPTIONS` preflight returns 204 with the same CORS headers.

---

## Appendix A — example controller & service

### `ProductController.java`
```java
@RestController
@RequestMapping
@RequiredArgsConstructor
public class ProductController {
  private final ProductService productService;

  @GetMapping("/products")
  public ApiResponse<List<ProductDto>> list(@RequestParam(required = false) String creatorId) {
    return ApiResponse.ok(productService.list(creatorId));
  }

  @GetMapping("/products/{id}")
  public ApiResponse<ProductDto> get(@PathVariable String id) {
    return ApiResponse.ok(productService.getById(id));
  }

  @PostMapping("/creators/me/products")
  @PreAuthorize("hasRole('CREATOR')")
  @ResponseStatus(HttpStatus.CREATED)
  public ApiResponse<ProductDto> create(@AuthenticationPrincipal CurrentUser me,
                                        @Valid @RequestBody ProductCreateRequest body) {
    return ApiResponse.ok(productService.create(me.creatorId(), body));
  }

  @PutMapping("/creators/me/products/{id}")
  @PreAuthorize("hasRole('CREATOR')")
  public ApiResponse<ProductDto> update(@AuthenticationPrincipal CurrentUser me,
                                        @PathVariable String id,
                                        @Valid @RequestBody ProductUpdateRequest body) {
    return ApiResponse.ok(productService.update(me.creatorId(), id, body));
  }

  @DeleteMapping("/creators/me/products/{id}")
  @PreAuthorize("hasRole('CREATOR')")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@AuthenticationPrincipal CurrentUser me, @PathVariable String id) {
    productService.delete(me.creatorId(), id);
  }
}
```

### `ProductService.java`
```java
@Service
@RequiredArgsConstructor
public class ProductService {
  private final ProductRepository repo;
  private final CreatorRepository creators;
  private final ProductMapper mapper;

  @Transactional(readOnly = true)
  public List<ProductDto> list(String creatorId) {
    var page = (creatorId == null)
      ? repo.findAllByArchivedFalse()
      : repo.findAllByCreatorIdAndArchivedFalse(creatorId);
    return page.stream().map(mapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public ProductDto getById(String id) {
    return repo.findById(id).map(mapper::toDto)
      .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
  }

  @Transactional
  public ProductDto create(String creatorId, ProductCreateRequest body) {
    var creator = creators.findById(creatorId)
      .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "No creator profile"));
    var product = mapper.fromCreate(body, creator);
    product.setId(slugify(body.name()) + "-" + shortId());
    return mapper.toDto(repo.save(product));
  }
  // update / delete elided for brevity — same shape, with ownership check.
}
```

---

## Appendix B — example security config

### `SecurityConfig.java`
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
  private final JwtAuthFilter jwtAuthFilter;
  private final AuthEntryPoint authEntryPoint;
  private final AccessDeniedHandlerImpl accessDeniedHandler;
  private final CorsConfigurationSource corsConfigurationSource;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
    return cfg.getAuthenticationManager();
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .cors(c -> c.configurationSource(corsConfigurationSource))
      .csrf(AbstractHttpConfigurer::disable)
      .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .exceptionHandling(e -> e.authenticationEntryPoint(authEntryPoint)
                               .accessDeniedHandler(accessDeniedHandler))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/auth/login", "/auth/register").permitAll()
        .requestMatchers(HttpMethod.POST, "/applications").permitAll()
        .requestMatchers(HttpMethod.GET, "/creators", "/creators/*", "/products", "/products/*").permitAll()
        .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**").permitAll()
        .anyRequest().authenticated())
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}
```

### `JwtService.java`
```java
@Service
public class JwtService {
  private final SecretKey key;
  private final long expirationMs;

  public JwtService(@Value("${ukena.jwt.secret}") String secret,
                    @Value("${ukena.jwt.expiration-hours}") long hours) {
    this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    this.expirationMs = Duration.ofHours(hours).toMillis();
  }

  public String issue(User user) {
    var now = Instant.now();
    return Jwts.builder()
      .subject(user.getId().toString())
      .claim("email", user.getEmail())
      .claim("role", user.getRole().name())
      .claim("creatorId", user.getCreatorId())
      .issuedAt(Date.from(now))
      .expiration(Date.from(now.plusMillis(expirationMs)))
      .signWith(key, Jwts.SIG.HS256)
      .compact();
  }

  public Claims parse(String jwt) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(jwt).getPayload();
  }
}
```

### `JwtAuthFilter.java`
```java
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserRepository users;

  @Override
  protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
      throws ServletException, IOException {
    var header = req.getHeader(HttpHeaders.AUTHORIZATION);
    if (header != null && header.startsWith("Bearer ")) {
      try {
        var claims = jwtService.parse(header.substring(7));
        var user = users.findById(UUID.fromString(claims.getSubject())).orElse(null);
        if (user != null && !user.isSuspended()) {
          var authority = new SimpleGrantedAuthority(user.getRole().name());
          var principal = new CurrentUser(user.getId(), user.getEmail(), user.getRole(), user.getCreatorId());
          var auth = new UsernamePasswordAuthenticationToken(principal, null, List.of(authority));
          SecurityContextHolder.getContext().setAuthentication(auth);
        }
      } catch (JwtException ignored) {
        // Invalid → leave context empty → entry point returns 401
      }
    }
    chain.doFilter(req, res);
  }
}
```

### `CurrentUser.java`
```java
public record CurrentUser(UUID id, String email, UserRole role, String creatorId) {}
```

---

## Done

When this spec is implemented and `VITE_USE_MOCK_API` is set to `false`, the existing Ukena frontend should work end-to-end against your Spring Boot service with **zero** frontend code changes. If something doesn't line up, the source of truth is §6 (DTO shapes) and §7 (endpoints) — match those exactly and the rest follows.
