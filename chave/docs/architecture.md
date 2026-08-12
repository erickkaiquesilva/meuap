# Architecture

## Stack

| Layer | Technology | Justification |
|---|---|---|
| Framework | React 19 + TypeScript | Strong typing, large ecosystem, team familiarity |
| Build Tool | Vite 8 | Fastest DX for SPAs; native ESM in dev |
| Routing | React Router v7 | Standard SPA routing; Data Router API |
| Server State | TanStack Query v5 | Cache, loading/error states, auto-refetch without Redux boilerplate |
| HTTP Client | Axios | Interceptors for auth injection and error handling |
| Styling | DS CSS Custom Properties | Zero lock-in; DS is the single source of truth |
| Mocking | MSW v2 | Service Worker intercepts — transparent to React code |
| Testing | Vitest + RTL | Vite-native; RTL enforces behaviour-first testing |

## Environment Strategy

```
VITE_ENV=mock        → MSW intercepts all /api/* requests (no real network)
VITE_ENV=staging     → points to staging API
VITE_ENV=production  → points to production API
```

Scripts:
- `npm run dev` → development mode
- `npm run dev:mock` → mock mode (MSW active, no network needed)
- `npm run build` → production build
- `npm run build:staging` → staging build

## Folder Structure

```
src/
├── assets/ds/          # Design System CSS (copied from /assets/css)
├── core/
│   ├── api/            # axios client + env config
│   ├── auth/           # AuthContext + useAuth hook
│   ├── router/         # createBrowserRouter + ProtectedRoute
│   └── query/          # QueryClient instance
├── features/
│   ├── home/           # Hero, SearchBar, FeaturedGrid, Neighborhoods, Testimonials
│   ├── auth/           # LoginForm, LoginPage
│   ├── listings/       # FilterSidebar, ListingGrid, Pagination
│   └── property/       # PhotoGallery, PropertyInfo, ContactPanel, SimilarProperties
├── shared/
│   ├── components/     # DS wrappers (Button, Badge, Field, Avatar, Header, Footer…)
│   ├── hooks/          # useSearchFilters, etc.
│   └── utils/          # formatCurrency, etc.
├── mocks/
│   ├── data/           # Static mock data (properties, neighborhoods)
│   ├── handlers/       # MSW request handlers
│   ├── browser.ts      # MSW browser worker
│   └── server.ts       # MSW node server (for tests)
└── test/
    ├── setup.ts        # jest-dom + MSW server lifecycle
    └── utils.tsx       # renderWithProviders helper
```

## Naming Conventions

- Components: PascalCase (`PropertyCard.tsx`)
- Hooks: camelCase prefixed with `use` (`useFeaturedProperties.ts`)
- Utils: camelCase (`formatCurrency.ts`)
- CSS Modules: `ComponentName.module.css`
- Types/Interfaces: PascalCase (`Property`, `SearchFilters`)
- Constants: UPPER_SNAKE_CASE (`MOCK_TOKEN`)
- Test files: `*.test.tsx` co-located with the component

## Data Flow

```
URL (query params)
  → useSearchFilters hook (reads/writes params)
  → TanStack Query (queryKey includes filters → auto-refetch)
  → MSW handler (mock) OR real API (staging/prod)
  → React component renders data
```

Filters are always in the URL — the URL is the single source of truth for search state. This avoids prop drilling and enables shareable links.
