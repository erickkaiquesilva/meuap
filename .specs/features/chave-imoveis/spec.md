# Chave Imóveis — Beta Platform Specification

**Source PRD:** `docs/prd/2026-08-28-chave-imoveis-prd.md` (approved 2026-08-28)  
**Repos:** `meuap/chave` (front), `chave-api` (back)  
**Scope:** Beta fechado até dez/2026 — marketplace regional Maringá + Sarandi

## Problem Statement

Sites imobiliários locais em Maringá e Sarandi falham em expor filtros, transmitir confiança e converter visitantes em leads. A Chave entrega marketplace regional com UX moderna, conectando anunciantes (corretores/proprietários) a locatários/compradores — com backend real, moderação, analytics e fundação SEO para abertura pública em 2027.

## Goals

- [ ] Beta fechado (dez/2026): corretores convidados publicam e moderam ≥50 imóveis reais; locatários buscam, favoritam, alertam e agendam visitas
- [ ] Integração front↔API real substituindo MSW em staging/produção para fluxos P0
- [ ] Fundação SEO (HTML indexável em rotas públicas) + analytics (PostHog + GA4) + observabilidade (Sentry free)

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Expansão fora Maringá/Sarandi | PRD beta boundary |
| Área ads B2B | Adiado pós-beta (AD-PRD-13) |
| Chat in-app | WhatsApp é canal oficial |
| Pagamento/comissão na plataforma | Fora do modelo atual |
| CRM imobiliário completo | Escopo futuro |
| Planos pagos (preço) | OQ-09 aberto — não bloqueia beta |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Push notifications no beta | Implementar infraestrutura; e-mail e WhatsApp prioritários no beta | Push exige Service Worker + permissão; custo de complexidade | y |
| WhatsApp visita no beta | E-mail obrigatório; WhatsApp opcional se API disponível | PRD permite opcional; reduz dependência externa no MVP | y |
| SSR implementation | Vite SSR ou prerender (não rewrite Next.js completo) | AD-PRD-15 + custo menor para equipe pequena | y |
| Preço plano >3 anúncios | Indefinido — bloquear apenas no limite 3 no beta | OQ-09 aberto | n |
| Admin portal auth | Roles `admin` separados de `User` anunciante | Isolamento de moderação | y |

**Open questions:** none — OQ-09 (preço plano pago) logged as assumption above; does not block beta.

---

## User Stories

### P1: Catálogo público e busca ⭐ MVP

**User Story**: As a locatário or comprador, I want to search and browse listings with filters and map so that I find properties in Maringá or Sarandi quickly.

**Why P1**: Core marketplace value; front exists in mock — needs real API.

**Acceptance Criteria**:

1. WHEN a visitor requests `GET /api/properties` with query params (city, neighborhood, operation, price, bedrooms) THEN the catalog service SHALL return a paginated JSON list matching MSW contract shape within 500ms p95.
2. WHEN a visitor requests `GET /api/properties/:id` for an approved listing THEN the system SHALL return full property detail including photos, fees, and specs.
3. WHEN a visitor requests `GET /api/properties/featured` THEN the system SHALL return up to 12 approved featured listings for the home page.
4. WHEN a visitor requests `GET /api/neighborhoods` THEN the system SHALL return seeded neighborhoods for Maringá and Sarandi.
5. IF a listing status is not `approved` THEN the catalog service SHALL NOT include it in public search or detail responses.
6. The catalog UI SHALL expose filters for operation (`rent` and `sale`), city, neighborhood, price range, bedrooms, and amenities consistent with existing `FilterPanel`.

**Independent Test**: Search "2 quartos Maringá aluguel até R$2000" returns filtered results from API; open detail shows photos and WhatsApp CTA.

**Requirement IDs**: CHV-01, CHV-02, CHV-03, CHV-04, CHV-05

---

### P1: Autenticação e onboarding ⭐ MVP

**User Story**: As a user, I want to register, log in (email or Google), and complete onboarding so that I can use renter or announcer features.

**Why P1**: Auth API largely done; wire remaining flows to production.

**Acceptance Criteria**:

1. WHEN a user submits valid register credentials THEN the auth service SHALL create account and return JWT with expiry per `JWT_EXPIRES_IN`.
2. WHEN a user logs in with valid credentials THEN the system SHALL return JWT and user profile including `goal` and `onboardingComplete`.
3. WHEN an authenticated user with `goal=list` completes announcer onboarding THEN the system SHALL persist `listProfile` and set `onboardingComplete=true`.
4. WHEN an authenticated user with `goal=rent` completes rent wizard THEN the system SHALL persist `rentProfile` and set `onboardingComplete=true`.
5. IF register email already exists THEN the auth service SHALL return HTTP 409 with error envelope `{ error: { code, message } }`.
6. IF forgot-password is requested THEN the system SHALL return generic success message without revealing email existence (stub acceptable until Resend in 2027 public phase).

**Independent Test**: Register → onboarding → `GET /api/auth/me` reflects profile; duplicate email returns 409.

**Requirement IDs**: CHV-06, CHV-07, CHV-08, CHV-09, CHV-10

---

### P1: Anunciante — CRUD e limite ⭐ MVP

**User Story**: As an announcer, I want to create, edit, pause, and delete up to 3 active listings with photos and visit availability so that I reach potential clients.

**Why P1**: Core supply side; dashboard exists in mock only.

**Acceptance Criteria**:

1. WHEN an authenticated announcer creates a listing THEN the listings service SHALL persist it with status `pending_moderation` and return the created record.
2. WHEN an announcer already has 3 listings with status `approved` or `pending_moderation` THEN the system SHALL reject a new create with HTTP 403 and code `LISTING_LIMIT_REACHED`.
3. WHEN an announcer updates their own listing THEN the system SHALL allow edit only if `ownerId` matches authenticated user.
4. WHEN an announcer pauses a listing THEN the system SHALL set status `paused` and exclude it from public catalog.
5. WHEN an announcer deletes a listing THEN the system SHALL require a delete reason from the allowed enum and soft-delete or archive per API design.
6. WHEN an announcer uploads photos THEN the media service SHALL store files in Cloudflare R2 and attach URLs to the listing (max 20 photos per listing).
7. WHEN an announcer saves visit availability (weekdays pattern or specific day/time slots) THEN the system SHALL persist `VisitAvailability` linked to the listing.

**Independent Test**: Create 3 listings succeeds; 4th fails; paused listing hidden from search.

**Requirement IDs**: CHV-11, CHV-12, CHV-13, CHV-14, CHV-15, CHV-16, CHV-17

---

### P1: Moderação admin ⭐ MVP

**User Story**: As a Chave operator, I want an admin portal to approve or reject listings before they go live so that beta quality is controlled.

**Why P1**: AD-PRD-09; required for beta with invited brokers.

**Acceptance Criteria**:

1. WHEN an admin authenticates to the admin portal THEN the system SHALL grant access only to users with role `admin`.
2. WHEN an admin views the moderation queue THEN the system SHALL list all listings with status `pending_moderation` ordered by `createdAt` ascending.
3. WHEN an admin approves a listing THEN the system SHALL set status `approved` and make it visible in public catalog within 60 seconds.
4. WHEN an admin rejects a listing THEN the system SHALL set status `rejected`, store rejection reason, and notify announcer by email.
5. IF a non-admin calls admin endpoints THEN the system SHALL return HTTP 403.

**Independent Test**: Submit listing → appears in admin queue → approve → visible in public search.

**Requirement IDs**: CHV-18, CHV-19, CHV-20, CHV-21, CHV-22

---

### P1: Favoritos ⭐ MVP

**User Story**: As a logged-in renter, I want to save favorites to my account so that I can compare properties later.

**Why P1**: PRD v1.0 scope; today UI-only local state.

**Acceptance Criteria**:

1. WHEN an authenticated renter favorites an approved listing THEN the system SHALL persist the favorite and return HTTP 201.
2. WHEN an authenticated renter unfavorites a listing THEN the system SHALL remove the favorite and return HTTP 204.
3. WHEN an authenticated renter requests `GET /api/me/favorites` THEN the system SHALL return their saved listings.
4. IF an unauthenticated user attempts to favorite THEN the front SHALL redirect to login preserving return URL.

**Independent Test**: Favorite persists across sessions and devices for same account.

**Requirement IDs**: CHV-23, CHV-24, CHV-25, CHV-26

---

### P1: Alertas de busca ⭐ MVP

**User Story**: As a logged-in renter, I want search alerts via email, push, and/or WhatsApp when new listings match my criteria.

**Why P1**: PRD v1.0; stub today.

**Acceptance Criteria**:

1. WHEN an authenticated renter creates a search alert with filters and channels THEN the system SHALL persist `SearchAlert` with selected channels (`email`, `push`, `whatsapp`).
2. WHEN a new listing is approved matching alert criteria THEN the system SHALL enqueue notifications on each selected channel within 15 minutes.
3. WHEN a renter disables an alert THEN the system SHALL stop future notifications for that alert.
4. IF WhatsApp channel is selected but WhatsApp API is unavailable THEN the system SHALL still deliver via email and log the WhatsApp failure without blocking other channels.

**Independent Test**: Create alert → approve matching listing → renter receives email notification.

**Requirement IDs**: CHV-27, CHV-28, CHV-29, CHV-30

---

### P1: Agendamento de visita ⭐ MVP

**User Story**: As a renter, I want to book a visit slot from the announcer's availability so that the announcer is notified.

**Why P1**: PRD v1.0; button exists without flow.

**Acceptance Criteria**:

1. WHEN a renter selects date and time from available slots on a listing THEN the system SHALL create `VisitRequest` with status `pending` and return confirmation to renter.
2. WHEN a visit request is created THEN the system SHALL send email to announcer within 2 minutes containing listing title, renter name, and chosen slot.
3. WHERE WhatsApp integration is configured THEN the system SHALL send WhatsApp notification to announcer in addition to email.
4. IF selected slot is no longer available (concurrent booking) THEN the system SHALL return HTTP 409 and prompt renter to choose another slot.
5. WHEN announcer configures availability on listing create/edit THEN the system SHALL accept either `weekdays` preset or explicit day+time ranges.

**Independent Test**: Announcer sets Tue/Thu 14h–18h → renter books Thu 15h → announcer receives email.

**Requirement IDs**: CHV-31, CHV-32, CHV-33, CHV-34, CHV-35

---

### P1: SEO híbrido e discoverability ⭐ MVP

**User Story**: As a search engine or social crawler, I want indexable HTML on public listing pages so that Chave ranks organically from 2027 public launch.

**Why P1**: AD-PRD-15; SEO desde beta.

**Acceptance Criteria**:

1. WHEN a crawler requests `/`, `/imoveis`, or `/imoveis/:id` THEN the server SHALL respond with HTML containing title, meta description, canonical URL, and Open Graph tags in the initial response (SSR or prerender).
2. WHEN a crawler requests `/imoveis/:id` for an approved listing THEN the HTML SHALL include JSON-LD `RealEstateListing` with price, address, and primary photo URL.
3. The system SHALL serve `robots.txt` allowing indexation of public routes and disallowing `/anuncios`, `/onboarding`, `/entrar`.
4. The system SHALL serve `sitemap.xml` listing all approved listing URLs and city/neighborhood landing URLs, regenerated at least daily.
5. WHILE user is in logged-in announcer or onboarding routes THEN the system MAY serve client-rendered SPA without SSR.

**Independent Test**: `curl` listing detail returns HTML with `<title>` containing property name; sitemap includes listing URL.

**Requirement IDs**: CHV-36, CHV-37, CHV-38, CHV-39, CHV-40

---

### P1: Analytics e observabilidade ⭐ MVP

**User Story**: As product operator, I want product analytics and error alerting so that I understand beta usage and fix failures quickly.

**Why P1**: AD-PRD-04, AD-PRD-16.

**Acceptance Criteria**:

1. The front SHALL emit PostHog events for: `search_performed`, `listing_viewed`, `whatsapp_clicked`, `favorite_added`, `listing_created`, `visit_requested`, `alert_created`, `onboarding_completed`.
2. The front SHALL load GA4 on all public pages with page_view and custom events mirroring key conversions.
3. WHEN an unhandled exception occurs in `chave-api` production THEN Sentry SHALL capture the error with stack trace and environment tag.
4. WHEN API 5xx rate exceeds 1% over 5 minutes THEN Sentry alert rules SHALL notify configured email (Sentry free tier).
5. The API SHALL emit structured JSON logs (Pino) for request id, route, status code, and duration on every request.

**Independent Test**: Trigger test error in staging → appears in Sentry; search in app → PostHog event recorded.

**Requirement IDs**: CHV-41, CHV-42, CHV-43, CHV-44, CHV-45

---

### P2: Contato WhatsApp e recomendações

**User Story**: As a renter, I want WhatsApp contact with pre-filled message and personalized recommendations after onboarding.

**Acceptance Criteria**:

1. WHEN renter clicks WhatsApp on listing detail THEN the system SHALL open `wa.me` URL with message containing listing title, price, and URL.
2. WHEN renter with `rentProfile` visits `/imoveis` THEN the system SHALL show recommendations banner applying profile filters unless dismissed for session.

**Requirement IDs**: CHV-46, CHV-47

---

### P2: Exclusão de anúncio com motivo

**User Story**: As an announcer, I want to delete a listing with reason for product insights.

**Acceptance Criteria**:

1. WHEN announcer deletes listing THEN the system SHALL require `reason` from enum (`sold`, `rented`, `withdrawn`, `other`) before confirming.

**Requirement ID**: CHV-48

---

## Edge Cases

- IF R2 upload fails mid-gallery THEN the system SHALL keep already-uploaded photos and return partial success with retry token for failed items.
- IF Geocoding API key is missing THEN the map panel SHALL render CSS fallback mock without breaking list view.
- IF announcer edits listing under moderation THEN the system SHALL reset status to `pending_moderation` unless change is cosmetic-only (define in Design).
- IF beta invite-only registration THEN the system SHALL reject register without valid invite code — **N/A for beta** if open register among invited brokers only via manual onboarding (assumption: open register, curated moderation).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Task(s) | Status |
| -------------- | ----- | ----- | ------- | ------ |
| CHV-01 | P1 Catálogo | 1 | T2, T3 | Pending |
| CHV-02 | P1 Catálogo | 1 | T2, T3 | Pending |
| CHV-03 | P1 Catálogo | 1 | T2, T3 | Pending |
| CHV-04 | P1 Catálogo | 1 | T2, T3 | Pending |
| CHV-05 | P1 Catálogo | 1 | T2, T3, T8 | Pending |
| CHV-06 | P1 Auth | 1 | T8 | Pending |
| CHV-07 | P1 Auth | — | (done) | Pending |
| CHV-08 | P1 Auth | — | (done) | Pending |
| CHV-09 | P1 Auth | — | (done) | Pending |
| CHV-10 | P1 Auth | 6 | T31 | Pending |
| CHV-11 | P1 Anunciante | 1 | T4, T5, T8 | Pending |
| CHV-12 | P1 Anunciante | 1 | T4, T5 | Pending |
| CHV-13 | P1 Anunciante | 1 | T4, T5 | Pending |
| CHV-14 | P1 Anunciante | 1 | T4, T5 | Pending |
| CHV-15 | P1 Anunciante | 1 | T4, T5 | Pending |
| CHV-16 | P1 Anunciante | 1 | T6, T7, T8 | Pending |
| CHV-17 | P1 Anunciante | 1 | T4, T5 | Pending |
| CHV-18 | P1 Admin | 2 | T9, T11, T12, T13 | Pending |
| CHV-19 | P1 Admin | 2 | T10, T11, T12 | Pending |
| CHV-20 | P1 Admin | 2 | T10, T11, T12 | Pending |
| CHV-21 | P1 Admin | 2, 4 | T10, T11, T19 | Partial |
| CHV-22 | P1 Admin | 2 | T9, T11, T13 | Pending |
| CHV-23 | P1 Favoritos | 3 | T14, T15 | Done |
| CHV-24 | P1 Favoritos | 3 | T14, T15 | Done |
| CHV-25 | P1 Favoritos | 3 | T14, T15 | Done |
| CHV-26 | P1 Favoritos | 3 | T15 | Done |
| CHV-27 | P1 Alertas | 4 | T20, T22 | Partial |
| CHV-28 | P1 Alertas | 4 | T21 | Pending |
| CHV-29 | P1 Alertas | 4 | T20, T22 | Partial |
| CHV-30 | P1 Alertas | 4 | T19, T21 | Partial |
| CHV-31 | P1 Visitas | 3 | T16, T18 | Done |
| CHV-32 | P1 Visitas | 3, 4 | T17, T19 | Partial |
| CHV-33 | P1 Visitas | 3, 4 | T17, T19 | Pending |
| CHV-34 | P1 Visitas | 3 | T16, T18 | Done |
| CHV-35 | P1 Visitas | 3 | T16, T18 | Done |
| CHV-36 | P1 SEO | 5 | T23, T24, T25, T27 | Pending |
| CHV-37 | P1 SEO | 5 | T25, T27 | Pending |
| CHV-38 | P1 SEO | 5 | T26, T27 | Pending |
| CHV-39 | P1 SEO | 5 | T26, T27 | Pending |
| CHV-40 | P1 SEO | 5 | T23, T24 | Pending |
| CHV-41 | P1 Analytics/Obs | 6 | T28 | Pending |
| CHV-42 | P1 Analytics/Obs | 6 | T28 | Pending |
| CHV-43 | P1 Analytics/Obs | 6 | T29 | Pending |
| CHV-44 | P1 Analytics/Obs | 6 | T29 | Pending |
| CHV-45 | P1 Analytics/Obs | 6 | T30 | Pending |
| CHV-46 | P2 WhatsApp/Rec | 6 | T28, T31 | Pending |
| CHV-47 | P2 WhatsApp/Rec | 6 | T31 | Pending |
| CHV-48 | P2 Delete reason | 1 | T4 | Pending |

**Coverage:** 48 total requirements, 48 mapped to tasks (Tasks phase complete)

---

## Success Criteria

- [ ] ≥50 approved listings in platform by end of beta (dez/2026)
- [ ] ≥3 active announcers publishing in beta period
- [ ] Public listing pages return indexable HTML (curl validation)
- [ ] Zero MSW dependency in staging environment for P0 flows
- [ ] Sentry captures and alerts on staging 5xx before production cutover

---

## Implicit-Requirement Dimensions (Large scope)

| Dimension | Resolution |
| --------- | ---------- |
| Input validation | CPF/CNPJ/CRECI validators (existing); price max R$1B; photo max 20 |
| Failure states | API error envelope; partial R2 upload; alert channel fallback |
| Auth boundaries | JWT Bearer; admin role separate; owner-scoped listings |
| Rate limits | N/A for beta — log as Phase 2 (2027 public) |
| Observability | Sentry + Pino + PostHog events |
| State transitions | listing: draft→pending→approved/rejected; paused; visit: pending |
