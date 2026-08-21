import { http, HttpResponse } from 'msw'
import type { MyListing } from '@/features/announcer/types/listings'
import { mockProperties } from '@/mocks/data/properties'

/** In-memory listings owned by the current mock session user. */
let myListings: MyListing[] = []

export function resetMyListings(seed: MyListing[] = []) {
  myListings = seed.map((item) => ({ ...item }))
}

export function seedDemoMyListings(ownerId: string, count = 3) {
  myListings = mockProperties.slice(0, count).map((p) => ({
    ...p,
    ownerId,
    status: 'active' as const,
    iptu: undefined,
    fireInsurance: undefined,
    serviceFee: undefined,
  }))
  return myListings
}

export const announcerHandlers = [
  http.get('/api/me/listings', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    // Test hook: fail once when header X-Force-Error is set
    if (request.headers.get('X-Force-Error') === '1') {
      return HttpResponse.json(
        { message: 'Não foi possível carregar seus anúncios' },
        { status: 500 },
      )
    }

    return HttpResponse.json({ data: myListings })
  }),

  http.post('/api/me/listings/seed', async ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }
    const body = await request.json() as { ownerId?: string; count?: number }
    const ownerId = body.ownerId ?? 'user-seed'
    const seeded = seedDemoMyListings(ownerId, body.count ?? 3)
    return HttpResponse.json({ data: seeded }, { status: 201 })
  }),

  http.delete('/api/me/listings/:id', async ({ request, params }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    const body = await request.json() as { reason?: string }
    if (!body.reason) {
      return HttpResponse.json(
        { message: 'Informe o motivo da exclusão' },
        { status: 400 },
      )
    }

    const id = String(params.id)
    const before = myListings.length
    myListings = myListings.filter((item) => item.id !== id)
    if (myListings.length === before) {
      return HttpResponse.json({ message: 'Anúncio não encontrado' }, { status: 404 })
    }

    return HttpResponse.json({ success: true })
  }),
]
