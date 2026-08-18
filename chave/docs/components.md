# Components

## Design System Wrappers (`src/shared/components/`)

DS classes are in `src/assets/ds/`. React components are thin wrappers that map props to DS class names — no CSS-in-JS.

### Button

```tsx
import { Button } from '@/shared/components/Button/Button'

<Button variant="primary">Buscar</Button>
<Button variant="outline" size="sm">Ver mais</Button>
<Button loading>Enviando...</Button>
```

Props:
- `variant`: `primary | secondary | outline | ghost | danger | danger-outline`
- `size`: `default | sm | icon`
- `loading`: boolean — disables button and shows spinner
- All native `<button>` HTML attributes

### Badge / Chip

```tsx
import { Badge, Chip } from '@/shared/components/Badge/Badge'

<Badge variant="secondary">Novo</Badge>
<Chip active={isSelected} onClick={toggle}>2+ quartos</Chip>
```

### Field

```tsx
import { Field, Input, Select } from '@/shared/components/Field/Field'

<Field label="E-mail" htmlFor="email" error={errors.email}>
  <Input id="email" type="email" />
</Field>

<Field label="Cidade" htmlFor="city">
  <Select id="city">
    <option>Maringá</option>
    <option>Sarandi</option>
  </Select>
</Field>
```

### Avatar

```tsx
import { Avatar } from '@/shared/components/Avatar/Avatar'

<Avatar name="Ana Souza" />           // renders initials
<Avatar name="Carlos" src="/photo.jpg" />  // renders image
```

## Shared Layout

### Header / Footer

Both are in `src/shared/components/` and composed in `Layout.tsx`. Do not import them in feature pages. `/entrar` and `/cadastro` sit **outside** Layout (full-bleed `AuthSplitLayout`, no Header/Footer).

### Layout

```tsx
// src/core/router/routes.tsx
{
  path: '/',
  element: <Layout />,   // renders Header + <Outlet> + Footer
  children: [...]
}
```

## Feature Components

Each feature owns its components. Cross-feature reuse happens through `shared/`:

| Component | Location | Reused in |
|---|---|---|
| `PropertyCard` | `shared/components/PropertyCard/` | Home, Listings, Details |
| `SearchBar` | `shared/components/SearchBar/` | Home Hero, Listings sticky bar |
| `Pagination` | `shared/components/Pagination/` | Listings |
| `EmptyState` | `shared/components/EmptyState/` | Listings, error states |

## DS Token Reference

```css
/* Colours */
--primary-500: #243B8F   /* Brand blue — actions, links */
--secondary-200: #FFF0C9  /* Cream — backgrounds, badges */
--secondary-400: #FFD977  /* Gold — accents, CTAs */
--neutral-700: #383C54   /* Body text */

/* Typography */
--font-display: 'Plus Jakarta Sans', system-ui
--font-ui:      'Plus Jakarta Sans', system-ui

/* Spacing */
--sp-1: 4px  --sp-2: 8px  --sp-3: 12px  --sp-4: 16px
--sp-5: 24px --sp-6: 32px --sp-7: 48px  --sp-8: 64px

/* Shadows */
--shadow-sm   --shadow-md   --shadow-lg   --shadow-focus

/* Radius */
--radius-sm: 8px  --radius-md: 12px  --radius-lg: 16px
--radius-xl: 24px --radius-pill: 999px
```
