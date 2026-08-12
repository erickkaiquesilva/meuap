# Technical Debt

Items registered at creation time. Each should be reviewed before the relevant phase launches.

---

## TD-001 — SEO: SPA without SSR

**Severity:** High (for Phase 2 production)
**Introduced in:** STORY-01 (T001)

React SPA pages are not indexed by search engine crawlers without JavaScript execution. Real estate is a high-SEO product.

**Mitigation for MVP:** Acceptable — MVP targets direct users, not SEO traffic.
**Resolution for Phase 2:** Migrate to Next.js App Router (SSR/ISR per page). `PropertyPage` and `ListingsPage` are the highest priority for SSR.

---

## TD-002 — Auth: JWT in localStorage

**Severity:** Medium
**Introduced in:** STORY-03 (T018)

`localStorage` tokens are readable by any JS on the page, making them vulnerable to XSS attacks.

**Mitigation for MVP:** No sensitive financial data stored; XSS surface limited.
**Resolution for production:** Migrate to `httpOnly` cookies (set by the backend on login) — immune to JS XSS. Requires CORS configuration and backend cooperation.

---

## TD-003 — Images: no CDN or automatic optimisation

**Severity:** Medium (performance)
**Introduced in:** STORY-02 (T011)

`<img>` tags load original-size images from the source. No WebP conversion, no responsive `srcset`, no CDN edge cache.

**Mitigation for MVP:** `loading="lazy"` on all non-hero images; placeholder gradients when no photo.
**Resolution for Phase 2:** Add Cloudinary or AWS CloudFront + Lambda@Edge for automatic resizing and WebP conversion.

---

## TD-004 — Accessibility: WCAG 2.2 target, not fully validated

**Severity:** Medium
**Introduced in:** All stories

Individual components are built with accessibility in mind, but no full automated audit (axe-core) has been run in CI.

**Mitigation:** `axe-core` run manually at the end of each story integration ticket.
**Resolution:** Add `@axe-core/playwright` to E2E tests in CI pipeline before launch.

---

## TD-005 — Testimonials: hardcoded data

**Severity:** Low
**Introduced in:** STORY-02 (T014)

Testimonials are static strings in source code. The client cannot update them without a deploy.

**Resolution for Phase 2:** Connect to a headless CMS (Notion API, Airtable, or Contentful) so the client can manage testimonials via a no-code interface.

---

## TD-006 — Neighbourhood count: not shown on Neighbourhood cards

**Severity:** Low (UX improvement)
**Introduced in:** STORY-02 (T013)

Neighbourhood cards could show the count of available properties (e.g., "12 imóveis") to guide the user's attention. This requires a backend aggregation endpoint.

**Resolution for Phase 2:** Add `GET /api/neighborhoods?includeCount=true` to the API.

---

## TD-007 — No E2E tests

**Severity:** Medium (quality)
**Introduced in:** STORY-01

No Playwright or Cypress tests for critical user flows (search → listing → detail → contact).

**Resolution:** Add Playwright E2E tests for the 3 main flows before production launch.
