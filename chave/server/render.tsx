import { renderToString } from 'react-dom/server'
import type { Property } from '@/shared/types/property'
import {
  loadFeaturedForSsr,
  loadListingsForSsr,
  loadPropertyForSsr,
} from './catalog'
import {
  matchSsrRoute,
  titleForHome,
  titleForListings,
  titleForProperty,
  titleForSpa,
} from './ssrRoutes'

export type SsrRenderResult = {
  html: string
  title: string
  /** When true, HTML body is empty — client owns the route (auth/dashboard). */
  spaOnly: boolean
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function HomeShell({ featured }: { featured: Property[] }) {
  return (
    <div data-ssr="home">
      <h1>Chave — Imóveis em Maringá e Sarandi</h1>
      <p>Encontre imóveis para alugar ou comprar.</p>
      {featured.length > 0 ? (
        <section aria-label="Destaques">
          <h2>Destaques</h2>
          <ul>
            {featured.map((p) => (
              <li key={p.id}>
                <a href={`/imoveis/${p.id}`}>{p.title}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

function ListingsShell({
  items,
  total,
}: {
  items: Property[]
  total: number
}) {
  return (
    <div data-ssr="listings">
      <h1>Imóveis</h1>
      <p>
        {total} {total === 1 ? 'resultado' : 'resultados'}
      </p>
      <ul>
        {items.map((p) => (
          <li key={p.id}>
            <a href={`/imoveis/${p.id}`}>
              {p.title} — {p.neighborhood}, {p.city}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PropertyShell({ property }: { property: Property }) {
  return (
    <div data-ssr="property">
      <h1>{property.title}</h1>
      <p>
        {property.neighborhood}, {property.city} ·{' '}
        {property.operation === 'rent' ? 'Aluguel' : 'Venda'} · R${' '}
        {property.price.toLocaleString('pt-BR')}
      </p>
      {property.photos[0] ? (
        <img src={property.photos[0]} alt={property.title} width={800} height={600} />
      ) : null}
      <p>{property.description}</p>
    </div>
  )
}

function NotFoundShell() {
  return (
    <div data-ssr="not-found">
      <h1>Imóvel não encontrado</h1>
      <p>
        <a href="/imoveis">Ver outros imóveis</a>
      </p>
    </div>
  )
}

/**
 * Prefetch catalog data and render public-route HTML for crawlers.
 * SPA-only routes return an empty body (client-only).
 */
export async function render(url: string): Promise<SsrRenderResult> {
  const match = matchSsrRoute(url)

  if (match.kind === 'spa') {
    return { html: '', title: titleForSpa(), spaOnly: true }
  }

  if (match.kind === 'home') {
    const featured = await loadFeaturedForSsr()
    return {
      html: renderToString(<HomeShell featured={featured} />),
      title: titleForHome(),
      spaOnly: false,
    }
  }

  if (match.kind === 'listings') {
    const page = await loadListingsForSsr(match.search)
    return {
      html: renderToString(
        <ListingsShell items={page.data} total={page.total} />,
      ),
      title: titleForListings(),
      spaOnly: false,
    }
  }

  const property = await loadPropertyForSsr(match.id)
  if (!property) {
    return {
      html: renderToString(<NotFoundShell />),
      title: 'Imóvel não encontrado | Chave',
      spaOnly: false,
    }
  }

  return {
    html: renderToString(<PropertyShell property={property} />),
    title: titleForProperty(property),
    spaOnly: false,
  }
}

/** Escape for safe injection into HTML text nodes / title. */
export function escapeTitle(title: string): string {
  return escapeHtml(title)
}
