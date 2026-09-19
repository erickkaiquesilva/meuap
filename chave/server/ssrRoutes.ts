import type { Property } from '@/shared/types/property'

export type SsrRouteKind = 'home' | 'listings' | 'property' | 'spa'

export type SsrMatch =
  | { kind: 'home' }
  | { kind: 'listings'; search: string }
  | { kind: 'property'; id: string }
  | { kind: 'spa' }

const SPA_PREFIXES = [
  '/entrar',
  '/cadastro',
  '/onboarding',
  '/anuncios',
  '/admin',
  '/favoritos',
  '/alertas',
  '/recuperar-senha',
]

/** Classify a request path for hybrid SSR (public) vs SPA-only. */
export function matchSsrRoute(url: string): SsrMatch {
  let pathname = url
  let search = ''
  try {
    const parsed = new URL(url, 'http://ssr.local')
    pathname = parsed.pathname
    search = parsed.search
  } catch {
    const q = url.indexOf('?')
    if (q >= 0) {
      pathname = url.slice(0, q)
      search = url.slice(q)
    }
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1)
  }

  if (pathname === '/' || pathname === '') return { kind: 'home' }
  if (pathname === '/imoveis') return { kind: 'listings', search }

  const detail = pathname.match(/^\/imoveis\/([^/]+)$/)
  if (detail) return { kind: 'property', id: decodeURIComponent(detail[1]) }

  if (SPA_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return { kind: 'spa' }
  }

  // Unknown public-ish paths still get a soft shell (client router handles 404)
  return { kind: 'spa' }
}

export function titleForHome(): string {
  return 'Chave — Imóveis em Maringá e Sarandi'
}

export function titleForListings(): string {
  return 'Imóveis em Maringá e Sarandi | Chave'
}

export function titleForProperty(property: Pick<Property, 'title' | 'city'>): string {
  return `${property.title} | ${property.city} | Chave`
}

export function titleForSpa(): string {
  return titleForHome()
}
