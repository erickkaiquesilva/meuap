import { http, HttpResponse } from 'msw'
import { mockProperties } from '../data/properties'
import type { Property } from '@/shared/types/property'

let favoriteIds = new Set<string>()

export function resetFavorites(ids: string[] = []) {
  favoriteIds = new Set(ids)
}

function requireAuth(request: Request) {
  return Boolean(request.headers.get('Authorization'))
}

function toProperty(id: string): Property | undefined {
  const found = mockProperties.find((property) => property.id === id)
  if (!found) return undefined
  return { ...found }
}

export const favoritesHandlers = [
  http.get('/api/me/favorites', ({ request }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json(
        { error: { code: 'Unauthorized', message: 'Não autenticado' } },
        { status: 401 },
      )
    }
    const data = [...favoriteIds]
      .map((id) => toProperty(id))
      .filter((property): property is Property => Boolean(property))
    return HttpResponse.json({ data })
  }),

  http.post('/api/me/favorites', async ({ request }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json(
        { error: { code: 'Unauthorized', message: 'Não autenticado' } },
        { status: 401 },
      )
    }
    const body = (await request.json()) as { listingId?: string }
    const listingId = body.listingId?.trim() ?? ''
    const property = toProperty(listingId)
    if (!property) {
      return HttpResponse.json(
        { error: { code: 'Not Found', message: 'Imóvel não encontrado' } },
        { status: 404 },
      )
    }
    favoriteIds.add(listingId)
    return HttpResponse.json({ data: property }, { status: 201 })
  }),

  http.delete('/api/me/favorites/:listingId', ({ request, params }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json(
        { error: { code: 'Unauthorized', message: 'Não autenticado' } },
        { status: 401 },
      )
    }
    const listingId = String(params.listingId)
    if (!favoriteIds.has(listingId)) {
      return HttpResponse.json(
        { error: { code: 'Not Found', message: 'Favorito não encontrado' } },
        { status: 404 },
      )
    }
    favoriteIds.delete(listingId)
    return new HttpResponse(null, { status: 204 })
  }),
]
