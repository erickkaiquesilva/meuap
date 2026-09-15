# Chave Imóveis Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/chave-imoveis/design.md` (approved 2026-08-28)  
**Status**: In Progress — Phase 1 complete (T1–T8); next T9 AdminGuard

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec — confirm before Execute. Guidelines found: none — strong defaults applied.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| NestJS service (domain) | unit | All branches; 1:1 to spec ACs; all listed edge cases | `chave-api/src/**/*.spec.ts` | `cd chave-api && npm test` |
| NestJS controller / API route | e2e | All routes in scope: happy + edge + error paths | `chave-api/test/*.e2e-spec.ts` | `cd chave-api && npm run test:e2e` |
| Prisma schema / migration | none | — (build gate only) | `chave-api/prisma/` | `cd chave-api && npm run build` |
| React hook / util | unit | Key paths + error handling | `chave/src/**/*.test.ts` | `cd chave && npm run test:run` |
| React page / component | unit | Render + user interaction per AC | `chave/src/**/*.test.tsx` | `cd chave && npm run test:run` |
| SSR server | integration | Public routes return HTML with meta/JSON-LD | `chave/server/**/*.test.ts` | `cd chave && npm run test:run` |
| Analytics / Sentry init | none | — (manual smoke in staging) | `chave/src/core/analytics/` | `cd chave && npm run build` |

## Gate Check Commands

> Generated from codebase — confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | After tasks with unit tests only | `cd chave-api && npm test` or `cd chave && npm run test:run` |
| Full | After tasks with e2e/integration tests | `cd chave-api && npm run test:e2e` or `cd chave && npm run test:run` |
| Build | After schema/config-only tasks or phase completion | `cd chave-api && npm run build && npm run lint` / `cd chave && npm run build && npm run lint` |

---

## Execution Plan

Phases are ordered and run sequentially — each phase completes before the next begins, and tasks within a phase execute in order.

### Phase 1: Listing + Catalog + Media

```
T1 → T2 → T3 → T8
T1 → T4 → T5 → T8
T4 → T6 → T7 → T8
```

### Phase 2: Admin Moderation

```
T9 → T10 → T11 → T12 → T13
```

### Phase 3: Favorites + Visit Scheduling

```
T14 → T15

T16 → T17 → T18
```

### Phase 4: Search Alerts + Notifications

```
T19 → T20 → T21

T20 → T22
```

### Phase 5: SSR + SEO

```
T23 → T24 → T25 → T27
T24 → T26 → T27
```

### Phase 6: Analytics + Observability

```
T28

T29 → T30 → T31
```

---

## Task Breakdown

### Phase 1

### T1: Prisma Listing domain schema and migration

**What**: Add all beta enums and models per design.md (`Listing`, `ListingPhoto`, `Favorite`, `SearchAlert`, `VisitRequest`, `NotificationOutbox`, `User.isAdmin`); run migration.
**Where**: `chave-api/prisma/schema.prisma`
**Depends on**: None
**Reuses**: Existing `Neighborhood` seed, `User` model
**Requirement**: CHV-11 (data foundation)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Migration applies cleanly on fresh DB
- [ ] `prisma generate` succeeds
- [ ] Gate check passes: `cd chave-api && npm run build`

**Tests**: none  
**Gate**: build

**Commit**: `feat(api): add Listing and ListingPhoto prisma schema`

---

### T2: CatalogService and PropertyMapper

**What**: Implement public catalog query service with MSW-parity filters, pagination, featured, and property DTO mapping; exclude non-approved listings.
**Where**: `chave-api/src/modules/catalog/catalog.service.ts`
**Depends on**: T1
**Reuses**: `chave/src/mocks/handlers/properties.ts` filter logic, `chave-api/src/shared/http/` error envelope
**Requirement**: CHV-01, CHV-02, CHV-03, CHV-04, CHV-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `search()` returns paginated approved listings with MSW shape
- [ ] `findById()` returns null for non-approved
- [ ] `findFeatured()` returns up to 12 approved
- [ ] Gate check passes: `cd chave-api && npm test`
- [ ] Test count: ≥6 unit tests pass (filters, pagination, status exclusion)

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(api): add CatalogService with MSW-parity filters`

---

### T3: CatalogController and catalog e2e tests

**What**: Expose `GET /api/properties`, `GET /api/properties/:id`, `GET /api/properties/featured`, `GET /api/neighborhoods` wired to CatalogService.
**Where**: `chave-api/src/modules/catalog/catalog.controller.ts`
**Depends on**: T2
**Reuses**: `chave-api/test/auth.e2e-spec.ts` setup pattern
**Requirement**: CHV-01, CHV-02, CHV-03, CHV-04, CHV-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] All four endpoints return MSW-compatible JSON
- [ ] Non-approved listing returns 404 on detail
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥5 e2e tests pass in `test/catalog.e2e-spec.ts`

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): add catalog public endpoints`

---

### T4: ListingsService with limit-3 and status machine

**What**: Owner-scoped CRUD, `assertCanCreate` limit-3 enforcement, pause/resume/archive transitions, visit availability persistence.
**Where**: `chave-api/src/modules/listings/listings.service.ts`
**Depends on**: T1
**Reuses**: `chave/src/features/announcer/types/listings.ts` validation rules
**Requirement**: CHV-11, CHV-12, CHV-13, CHV-14, CHV-15, CHV-17, CHV-48

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Create sets `pending_moderation`
- [ ] 4th active listing throws `LISTING_LIMIT_REACHED`
- [ ] Pause excludes from catalog; delete requires reason enum
- [ ] Visit schedule JSON persisted per mode
- [ ] Gate check passes: `cd chave-api && npm test`
- [ ] Test count: ≥8 unit tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(api): add ListingsService with limit and status machine`

---

### T5: ListingsController and owner routes e2e

**What**: Expose `POST/GET/PATCH/DELETE /api/me/listings` with JWT guard and ownership checks.
**Where**: `chave-api/src/modules/listings/listings.controller.ts`
**Depends on**: T4
**Reuses**: `chave-api/src/modules/identity/guards/jwt-auth.guard.ts`
**Requirement**: CHV-11, CHV-12, CHV-13, CHV-14, CHV-15, CHV-17

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Authenticated announcer can CRUD own listings
- [ ] 403 on limit exceeded; 403 on wrong owner
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥6 e2e tests pass in `test/listings.e2e-spec.ts`

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): add announcer listings endpoints`

---

### T6: MediaService R2 presigned upload

**What**: Generate presigned PUT URLs for Cloudflare R2; register `ListingPhoto` after upload; enforce max 20 photos / 5MB.
**Where**: `chave-api/src/modules/media/media.service.ts`
**Depends on**: T4
**Reuses**: NestJS ConfigModule for R2 credentials
**Requirement**: CHV-16

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `presignUpload` returns uploadUrl + publicUrl + photoId
- [ ] Rejects when listing has 20 photos
- [ ] Gate check passes: `cd chave-api && npm test`
- [ ] Test count: ≥4 unit tests pass (mock R2 client)

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(api): add MediaService with R2 presigned upload`

---

### T7: MediaController and photo routes e2e

**What**: Expose `POST /api/me/listings/:id/photos/presign` and `DELETE /api/me/listings/:id/photos/:photoId`.
**Where**: `chave-api/src/modules/media/media.controller.ts`
**Depends on**: T6
**Reuses**: JWT guard, listings ownership check
**Requirement**: CHV-16

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Presign returns valid shape; delete removes photo record
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥3 e2e tests pass in `test/media.e2e-spec.ts`

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): add listing photo presign endpoints`

---

### T8: Front wire catalog and announcer listings to real API

**What**: Replace MSW handlers with axios calls in staging mode for catalog search, detail, featured, and announcer dashboard CRUD hooks.
**Where**: `chave/src/features/listings/api/propertiesApi.ts`
**Depends on**: T3, T5, T7
**Reuses**: Existing TanStack Query hooks, `VITE_API_URL` staging config
**Requirement**: CHV-05, CHV-06 (integration), CHV-11–CHV-16

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [x] `dev:staging` loads listings from API (not MSW)
- [x] Announcer can create listing end-to-end against local API
- [x] Gate check passes: `cd chave && npm run test:run`
- [x] Test count: existing tests pass; ≥2 new integration tests for API client

**Tests**: unit  
**Gate**: quick

**Commit**: `T8-feat: ligando catalogo e anunciante a API real`

---

### Phase 2

### T9: AdminGuard and admin seed

**What**: Create `AdminGuard` extending JWT guard; add seed script for initial admin user (`isAdmin` column from T1).
**Where**: `chave-api/src/modules/identity/guards/admin.guard.ts`
**Depends on**: T1
**Reuses**: `jwt-auth.guard.ts`, `User.isAdmin` from T1 migration
**Requirement**: CHV-18, CHV-22

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] AdminGuard returns 403 for non-admin JWT
- [ ] Seed creates at least one admin user for beta
- [ ] Gate check passes: `cd chave-api && npm test`
- [ ] Test count: ≥3 unit tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(api): add AdminGuard and admin seed`

---

### T10: ModerationService approve and reject

**What**: Queue query for `pending_moderation`, approve sets `approved` + timestamp, reject sets `rejected` + reason and enqueues notification.
**Where**: `chave-api/src/modules/moderation/moderation.service.ts`
**Depends on**: T4, T9
**Reuses**: ListingsService status transitions
**Requirement**: CHV-19, CHV-20, CHV-21

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Queue ordered by `createdAt` asc
- [ ] Approve makes listing visible in catalog
- [ ] Reject stores reason
- [ ] Gate check passes: `cd chave-api && npm test`
- [ ] Test count: ≥5 unit tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(api): add ModerationService`

---

### T11: Admin moderation controller and e2e

**What**: Expose `GET /api/admin/listings`, `POST /api/admin/listings/:id/approve`, `POST /api/admin/listings/:id/reject` behind AdminGuard.
**Where**: `chave-api/src/modules/moderation/moderation.controller.ts`
**Depends on**: T10
**Reuses**: AdminGuard, error envelope
**Requirement**: CHV-18, CHV-19, CHV-20, CHV-21, CHV-22

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Admin can approve/reject; non-admin gets 403
- [ ] Approved listing appears in catalog within same request cycle
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥5 e2e tests pass in `test/moderation.e2e-spec.ts`

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): add admin moderation endpoints`

---

### T12: Front admin feature module

**What**: Create `AdminQueuePage`, `ListingReviewCard`, `useModerationQueue` hook, and `adminApi.ts`.
**Where**: `chave/src/features/admin/pages/AdminQueuePage.tsx`
**Depends on**: T11
**Reuses**: Existing table/card UI patterns from announcer dashboard
**Requirement**: CHV-18, CHV-19, CHV-20, CHV-21

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Queue renders pending listings with approve/reject actions
- [ ] Reject modal captures reason
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥4 component tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(chave): add admin moderation portal UI`

---

### T13: Front admin routing and AdminGuard

**What**: Register `/admin` route with client-side AdminGuard (JWT + `isAdmin` check); redirect non-admin to home.
**Where**: `chave/src/core/router/routes.tsx`
**Depends on**: T12
**Reuses**: Existing auth context, protected route pattern
**Requirement**: CHV-18, CHV-22

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `/admin` accessible only for admin users
- [ ] Non-admin redirected to `/`
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥2 route guard tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(chave): add admin route with AdminGuard`

---

### Phase 3

### T14: Favorites engagement service and e2e

**What**: Implement toggle favorite, list favorites; persist `Favorite` join table.
**Where**: `chave-api/src/modules/engagement/favorites.service.ts`
**Depends on**: T3
**Reuses**: Catalog PropertyMapper for favorite list response
**Requirement**: CHV-23, CHV-24, CHV-25

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] POST favorite returns 201; DELETE returns 204
- [ ] GET returns user's saved listings
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥4 e2e tests pass in `test/favorites.e2e-spec.ts`

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): add favorites endpoints`

---

### T15: Front favorites API wire

**What**: Connect favorite button and favorites page to real API; redirect unauthenticated users to login with return URL.
**Where**: `chave/src/features/property/hooks/useFavorite.ts`
**Depends on**: T14
**Reuses**: Existing favorite UI on property detail
**Requirement**: CHV-23, CHV-24, CHV-25, CHV-26

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Favorite persists across page reload
- [ ] Unauthenticated click redirects to `/entrar?redirect=...`
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥3 tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(chave): wire favorites to API`

---

### T16: VisitRequest service with slot conflict check

**What**: Create visit request with `pending` status; validate slot against announcer availability; return 409 on concurrent booking.
**Where**: `chave-api/src/modules/engagement/visits.service.ts`
**Depends on**: T4
**Reuses**: Listing `visitSchedule` JSON from T4
**Requirement**: CHV-31, CHV-34, CHV-35

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Valid slot creates `VisitRequest`
- [ ] Concurrent same slot returns 409
- [ ] Invalid slot outside availability rejected
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥5 e2e tests pass in `test/visits.e2e-spec.ts`

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): add visit request booking with slot validation`

---

### T17: Visit request notification email

**What**: On visit create, enqueue `visit-request` row in `NotificationOutbox` (delivery via Resend implemented in T19).
**Where**: `chave-api/src/modules/engagement/visits.service.ts`
**Depends on**: T16
**Reuses**: `NotificationOutbox` model from T1
**Requirement**: CHV-32, CHV-33

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Visit create writes outbox row with announcer email payload
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥2 e2e tests verify outbox enqueue

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): enqueue visit request notification on booking`

---

### T18: Front visit booking flow wire

**What**: Connect visit scheduling modal to API; show slot picker from listing availability; handle 409 conflict UX.
**Where**: `chave/src/features/property/components/VisitScheduler/VisitScheduler.tsx`
**Depends on**: T17
**Reuses**: Existing visit button on property detail
**Requirement**: CHV-31, CHV-34, CHV-35

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Renter can book available slot
- [ ] 409 shows "horário indisponível" message
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥3 component tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(chave): wire visit scheduling to API`

---

### Phase 4

### T19: NotificationOutbox and NotificationsService with Resend

**What**: Prisma `NotificationOutbox` model, Resend integration, cron `processOutbox()` every 1 min, templates: `visit-request`, `listing-approved`, `listing-rejected`, `search-alert-match`.
**Where**: `chave-api/src/modules/notifications/notifications.service.ts`
**Depends on**: T1
**Reuses**: NestJS `@nestjs/schedule` or manual cron
**Requirement**: CHV-21, CHV-28, CHV-32, CHV-30

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Outbox processes pending rows and marks sent/failed
- [ ] Failed rows retry up to 3 attempts
- [ ] Gate check passes: `cd chave-api && npm test`
- [ ] Test count: ≥5 unit tests pass (mock Resend)

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(api): add NotificationOutbox and Resend delivery`

---

### T20: SearchAlert CRUD endpoints

**What**: Create, list, disable search alerts with filters JSON and channel selection (`email`, `push`, `whatsapp`).
**Where**: `chave-api/src/modules/engagement/alerts.service.ts`
**Depends on**: T19
**Reuses**: Catalog filter shape for `filters` JSON
**Requirement**: CHV-27, CHV-29

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] CRUD persists `SearchAlert` with channels array
- [ ] Disable sets `active=false`
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥4 e2e tests pass in `test/alerts.e2e-spec.ts`

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): add search alert CRUD endpoints`

---

### T21: Alert matching on listing approval

**What**: On `listing.approved`, sync match against active alerts; enqueue notifications per channel within 15 min SLA.
**Where**: `chave-api/src/modules/engagement/alert-matcher.service.ts`
**Depends on**: T10, T20
**Reuses**: NotificationsService, Catalog filter matching logic
**Requirement**: CHV-28, CHV-30

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Matching alert enqueues email notification
- [ ] WhatsApp failure does not block email (CHV-30)
- [ ] Gate check passes: `cd chave-api && npm run test:e2e`
- [ ] Test count: ≥4 e2e tests pass

**Tests**: e2e  
**Gate**: full

**Commit**: `feat(api): match search alerts on listing approval`

---

### T22: Front search alerts wire

**What**: Connect alert creation UI to API; channel multi-select; alert management in user settings.
**Where**: `chave/src/features/listings/components/AlertModal/AlertModal.tsx`
**Depends on**: T20
**Reuses**: Existing alert stub UI
**Requirement**: CHV-27, CHV-29

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] User can create and disable alerts
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥3 tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(chave): wire search alerts to API`

---

### Phase 5

### T23: Vite SSR server scaffold

**What**: Create Express + Vite middleware server with `entry-client.tsx` and `entry-server.tsx` dual entrypoints; `npm run dev:ssr` and `build:ssr` scripts.
**Where**: `chave/server/index.ts`
**Depends on**: T8
**Reuses**: Existing Vite config, React Router
**Requirement**: CHV-36, CHV-40

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `dev:ssr` serves app with HMR
- [ ] Production build produces server bundle
- [ ] Gate check passes: `cd chave && npm run build`

**Tests**: none  
**Gate**: build

**Commit**: `feat(chave): add Vite SSR server scaffold`

---

### T24: SSR render for public routes

**What**: Server-render `/`, `/imoveis`, `/imoveis/:id` with catalog API data prefetch; hydrate on client.
**Where**: `chave/server/render.tsx`
**Depends on**: T23
**Reuses**: `features/home`, `features/listings`, `features/property` pages
**Requirement**: CHV-36, CHV-40

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `curl /imoveis/:id` returns HTML with listing title in `<title>`
- [ ] SPA routes (`/anuncios`) still client-only
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥3 SSR render tests pass

**Tests**: integration  
**Gate**: full

**Commit**: `feat(chave): SSR render public listing routes`

---

### T25: SEO meta and JSON-LD helpers

**What**: Pure functions for title, meta description, canonical, OG tags, and `RealEstateListing` JSON-LD.
**Where**: `chave/src/core/seo/meta.ts`
**Depends on**: T24
**Reuses**: Listing data from catalog API
**Requirement**: CHV-36, CHV-37

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Listing detail HTML includes JSON-LD with price, address, photo
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥5 unit tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(chave): add SEO meta and JSON-LD helpers`

---

### T26: robots.txt and sitemap.xml

**What**: Static `robots.txt` disallowing private routes; dynamic `sitemap.xml` from approved listings API.
**Where**: `chave/public/robots.txt`
**Depends on**: T24
**Reuses**: Catalog API approved listings endpoint
**Requirement**: CHV-38, CHV-39

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `robots.txt` disallows `/anuncios`, `/admin`, `/onboarding`, `/entrar`
- [ ] `sitemap.xml` lists all approved listing URLs
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥2 tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(chave): add robots.txt and dynamic sitemap`

---

### T27: SSR smoke integration tests

**What**: End-to-end smoke tests verifying SSR HTML structure for home, search, and detail pages.
**Where**: `chave/server/render.test.ts`
**Depends on**: T25, T26
**Reuses**: MSW or test fixtures for catalog data
**Requirement**: CHV-36, CHV-37, CHV-38, CHV-39

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] All three public routes return valid HTML shell
- [ ] Gate check passes: `cd chave && npm run test:run`
- [ ] Test count: ≥3 integration tests pass

**Tests**: integration  
**Gate**: full

**Commit**: `test(chave): add SSR smoke integration tests`

---

### Phase 6

### T28: PostHog and GA4 analytics module

**What**: Init PostHog + GA4; emit events: `search_performed`, `listing_viewed`, `whatsapp_clicked`, `favorite_added`, `listing_created`, `visit_requested`, `alert_created`, `onboarding_completed`.
**Where**: `chave/src/core/analytics/posthog.ts`
**Depends on**: T8
**Reuses**: `VITE_POSTHOG_KEY`, `VITE_GA4_ID` env vars
**Requirement**: CHV-41, CHV-42, CHV-46

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Events fire on key user actions (mocked in tests)
- [ ] GA4 page_view on public routes
- [ ] Gate check passes: `cd chave && npm run build`

**Tests**: none  
**Gate**: build

**Commit**: `feat(chave): add PostHog and GA4 analytics`

---

### T29: Sentry error tracking front and API

**What**: `@sentry/react` in front; `@sentry/nestjs` in API; capture unhandled exceptions with environment tag.
**Where**: `chave-api/src/main.ts`
**Depends on**: T8
**Reuses**: Sentry DSN env vars
**Requirement**: CHV-43, CHV-44

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Test error appears in Sentry staging project
- [ ] Gate check passes: `cd chave-api && npm run build && cd ../meuap/chave && npm run build`

**Tests**: none  
**Gate**: build

**Commit**: `feat: add Sentry error tracking to front and API`

---

### T30: Pino structured request logging

**What**: JSON logs with request id, route, status, duration on every API request.
**Where**: `chave-api/src/shared/http/logging.middleware.ts`
**Depends on**: T29
**Reuses**: NestJS middleware pattern
**Requirement**: CHV-45

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Each request emits structured JSON log line
- [ ] Gate check passes: `cd chave-api && npm test`
- [ ] Test count: ≥2 unit tests pass

**Tests**: unit  
**Gate**: quick

**Commit**: `feat(api): add Pino structured request logging`

---

### T31: acceptedTermsAt on register and P2 polish

**What**: Set `acceptedTermsAt` on register; wire WhatsApp `wa.me` prefill (CHV-46) and recommendations banner (CHV-47) if not already done.
**Where**: `chave-api/src/modules/identity/auth.service.ts`
**Depends on**: T30
**Reuses**: Existing register flow, recommendations util
**Requirement**: CHV-46, CHV-47, CHV-10 (LGPD)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Register sets `acceptedTermsAt`
- [ ] WhatsApp link includes listing title and URL
- [ ] Gate check passes: `cd chave-api && npm run test:e2e && cd ../chave && npm run test:run`
- [ ] Test count: ≥3 tests pass

**Tests**: e2e  
**Gate**: full

**Commit**: `feat: set acceptedTermsAt on register and P2 WhatsApp polish`

---

## Phase Execution Map

Phases run strictly in order: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6.

Intra-phase task ordering is defined in each phase diagram above.

**Batch packing (~7 tasks/worker):**

| Batch | Phases | Tasks | Count |
| ----- | ------ | ----- | ----- |
| 1 | Phase 1 | T1–T8 | 8 |
| 2 | Phase 2 + 3 | T9–T18 | 10 |
| 3 | Phase 4 + 5 | T19–T27 | 9 |
| 4 | Phase 6 | T28–T31 | 4 |

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1: Prisma schema | 1 migration file | ✅ Granular |
| T2: CatalogService | 1 service + mapper | ✅ Granular |
| T3: CatalogController | 1 controller + e2e file | ✅ Granular |
| T4: ListingsService | 1 service | ✅ Granular |
| T5: ListingsController | 1 controller + e2e | ✅ Granular |
| T6: MediaService | 1 service | ✅ Granular |
| T7: MediaController | 1 controller + e2e | ✅ Granular |
| T8: Front API wire | 1 API module | ✅ Granular |
| T9: AdminGuard | 1 guard + migration | ✅ Granular |
| T10: ModerationService | 1 service | ✅ Granular |
| T11: ModerationController | 1 controller + e2e | ✅ Granular |
| T12: Admin UI | 1 feature module | ✅ Granular |
| T13: Admin routing | 1 route file | ✅ Granular |
| T14: Favorites | 1 service + e2e | ✅ Granular |
| T15: Front favorites | 1 hook | ✅ Granular |
| T16: Visits service | 1 service + e2e | ✅ Granular |
| T17: Visit notification | outbox enqueue in service | ✅ Granular |
| T18: Visit UI wire | 1 component | ✅ Granular |
| T19: Notifications | 1 service module | ✅ Granular |
| T20: Alerts CRUD | 1 service + e2e | ✅ Granular |
| T21: Alert matcher | 1 service | ✅ Granular |
| T22: Front alerts | 1 component | ✅ Granular |
| T23: SSR scaffold | 1 server entry | ✅ Granular |
| T24: SSR render | 1 render module | ✅ Granular |
| T25: SEO helpers | 1 util module | ✅ Granular |
| T26: robots + sitemap | 2 static/dynamic files | ✅ Granular |
| T27: SSR smoke tests | 1 test file | ✅ Granular |
| T28: Analytics | 1 module | ✅ Granular |
| T29: Sentry | 2 init files | ✅ Granular |
| T30: Pino logging | 1 middleware | ✅ Granular |
| T31: LGPD + P2 | auth service modify | ✅ Granular |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T1 | None | (start) | ✅ Match |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T1 | T1 → T4 (parallel from T1) | ✅ Match |
| T5 | T4 | T4 → T5 | ✅ Match |
| T6 | T4 | T4 → T6 | ✅ Match |
| T7 | T6 | T6 → T7 | ✅ Match |
| T8 | T3, T5, T7 | T7 → T8 | ✅ Match |
| T9 | T1 | T1 → T9 (cross-phase) | ✅ Match |
| T10 | T4, T9 | T9 → T10 | ✅ Match |
| T11 | T10 | T10 → T11 | ✅ Match |
| T12 | T11 | T11 → T12 | ✅ Match |
| T13 | T12 | T12 → T13 | ✅ Match |
| T14 | T3 | T3 → T14 (cross-phase) | ✅ Match |
| T15 | T14 | T14 → T15 | ✅ Match |
| T16 | T4 | T4 → T16 (cross-phase) | ✅ Match |
| T17 | T16 | T16 → T17 | ✅ Match |
| T18 | T16, T17 | T17 → T18 | ✅ Match |
| T19 | T1 | T1 → T19 (cross-phase) | ✅ Match |
| T20 | T19 | T19 → T20 | ✅ Match |
| T21 | T10, T20 | T20 → T21 | ✅ Match |
| T22 | T20 | T20 → T22 | ✅ Match |
| T23 | T8 | T8 → T23 (cross-phase) | ✅ Match |
| T24 | T23 | T23 → T24 | ✅ Match |
| T25 | T24 | T24 → T25 | ✅ Match |
| T26 | T24 | T24 → T26 | ✅ Match |
| T27 | T25, T26 | T26 → T27 | ✅ Match |
| T28 | T8 | T8 → T28 (cross-phase) | ✅ Match |
| T29 | T8 | T8 → T29 (cross-phase) | ✅ Match |
| T30 | T29 | T29 → T30 | ✅ Match |
| T31 | T30 | T30 → T31 | ✅ Match |

---

## Test Co-location Validation

| Task | Code Layer | Matrix Requires | Task Says | Status |
| ---- | ---------- | --------------- | --------- | ------ |
| T1 | Prisma schema | none | none | ✅ OK |
| T2 | NestJS service | unit | unit | ✅ OK |
| T3 | Controller | e2e | e2e | ✅ OK |
| T4 | NestJS service | unit | unit | ✅ OK |
| T5 | Controller | e2e | e2e | ✅ OK |
| T6 | NestJS service | unit | unit | ✅ OK |
| T7 | Controller | e2e | e2e | ✅ OK |
| T8 | React hook/api | unit | unit | ✅ OK |
| T9 | Guard | unit | unit | ✅ OK |
| T10 | NestJS service | unit | unit | ✅ OK |
| T11 | Controller | e2e | e2e | ✅ OK |
| T12 | React page | unit | unit | ✅ OK |
| T13 | Router | unit | unit | ✅ OK |
| T14 | Controller | e2e | e2e | ✅ OK |
| T15 | React hook | unit | unit | ✅ OK |
| T16 | Controller | e2e | e2e | ✅ OK |
| T17 | Service e2e | e2e | e2e | ✅ OK |
| T18 | React component | unit | unit | ✅ OK |
| T19 | NestJS service | unit | unit | ✅ OK |
| T20 | Controller | e2e | e2e | ✅ OK |
| T21 | Service e2e | e2e | e2e | ✅ OK |
| T22 | React component | unit | unit | ✅ OK |
| T23 | SSR server | none | none | ✅ OK |
| T24 | SSR server | integration | integration | ✅ OK |
| T25 | React util | unit | unit | ✅ OK |
| T26 | Static/dynamic | unit | unit | ✅ OK |
| T27 | SSR integration | integration | integration | ✅ OK |
| T28 | Analytics init | none | none | ✅ OK |
| T29 | Sentry init | none | none | ✅ OK |
| T30 | Middleware | unit | unit | ✅ OK |
| T31 | Auth service | e2e | e2e | ✅ OK |
