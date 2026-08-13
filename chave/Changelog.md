# Changelog

## [v1.0.0] — In development

- feat-T001: setup project React 19 + TypeScript + Vite 8 with feature-based folder structure
- feat-T002: environment configuration (production / staging / mock) with Axios client and interceptors
- feat-T003: Design System integration — DS CSS tokens and components copied to src/assets/ds; Button, Badge, Field, Avatar React wrappers created
- feat-T004: React Router v7 routing setup with Layout, ProtectedRoute and placeholder pages for all MVP routes
- feat-T005: MSW v2 mock layer — 12 mock properties, 10 neighbourhoods, auth and property handlers for browser and Node
- feat-T006: Vitest + React Testing Library setup with renderWithProviders helper and first Button smoke tests
- feat-T007: initial documentation (architecture.md, components.md, technical-debt.md, Changelog.md)
- feat-T008: Header with sticky behaviour, desktop nav and mobile drawer with focus trap and Escape close
- feat-T009: Hero section with gradient background, headline, subtext and floating SearchBar
- feat-T010: SearchBar component — operation tabs, city/neighbourhood/price/bedrooms filters, URL-driven navigation
- feat-T011: PropertyCard — photo with lazy-load, placeholder gradient, badge, favourite toggle, specs row
- feat-T012: FeaturedGrid — React Query integration, skeleton loading, error state with retry
- feat-T013: Neighborhoods — static section with 6 neighbourhood cards linking to filtered listings
- feat-T014: Testimonials — 3 static testimonials with star rating and avatar initials
- feat-T015: CTABanner — gradient banner with WhatsApp link from VITE_WA_NUMBER env var
- feat-T016: HomePage integration — all sections composed; zero TypeScript errors; build successful
- feat-T008: Makefile at project root with interactive environment selector (mock / staging / production), install, test, build, lint and clean targets
- fix-T008: Makefile moved from chave/ to project root (meuap/); internal paths updated to target chave/ subdirectory
- fix-T016: guard fetchFeaturedProperties and fetchNeighborhoods against non-array API responses (Vite SPA fallback returns HTML on unknown /api/* routes)
- feat-T018: AuthContext with JWT in localStorage — AuthProvider, useAuth hook, login/logout/session-restore via /api/auth/me
- feat-T019: ProtectedRoute wired to real AuthContext — redirects unauthenticated users preserving redirect param
- feat-T017: Login page — validated form (email + password), show/hide password toggle, server error display, redirect after login
- feat-T017: Header updated to show user name and logout button when authenticated
- feat-T021: ListingsPage layout — two-column (sidebar + grid) on desktop, single column on mobile
- feat-T022: FilterPanel — operation tabs, city/neighborhood selects, type/bedroom chips, max price select; mobile bottom drawer
- feat-T023: PropertyGrid — responsive grid, shimmer skeleton (6 cards), empty and error states
- feat-T024: listingsApi + useListings hook (React Query) + useListingsFilters (URL-driven state)
- feat-T025: SortSelect (5 options) + Pagination component with ellipsis logic
- feat-T027: propertyApi (fetchProperty + fetchSimilarProperties) + useProperty/useSimilarProperties hooks
- feat-T028: PhotoGallery — main photo with prev/next arrows, thumbnail strip, counter badge, lightbox with keyboard navigation (←/→/Esc)
- feat-T029: PropertyInfo — specs grid (quartos/banheiros/vagas/m²), description, amenities checklist, location placeholder
- feat-T030: ContactCard — price summary, agent avatar, WhatsApp CTA with pre-filled message, print/PDF button; sticky on desktop
- feat-T031: SimilarProperties — grid of up to 3 PropertyCards + link to city listings
- feat-T032: PropertyPage — breadcrumb, gallery + info/contact layout (2-col desktop, 1-col mobile), skeleton and not-found states
- fix-T033: guard buildWhatsAppUrl against undefined VITE_WA_NUMBER (prevents CTABanner/ContactCard crash and blank screen); validate apiGetMe response shape; Makefile auto-creates .env.development on mock start
