import { http, HttpResponse } from 'msw'
import type { CreateListingInput, MyListing } from '@/features/announcer/types/listings'
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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

function parseCreateListing(raw: unknown): CreateListingInput | null {
  if (!raw || typeof raw !== 'object') return null
  const body = raw as Record<string, unknown>

  const types = ['apartment', 'house', 'commercial'] as const
  const ops = ['rent', 'sale'] as const
  if (!isNonEmptyString(body.title)) return null
  if (typeof body.type !== 'string' || !types.includes(body.type as typeof types[number])) return null
  if (typeof body.operation !== 'string' || !ops.includes(body.operation as typeof ops[number])) {
    return null
  }
  if (!isPositiveNumber(body.price) || body.price <= 0) return null
  if (!isNonEmptyString(body.city)) return null
  if (!isNonEmptyString(body.neighborhood)) return null
  if (!isNonEmptyString(body.address)) return null
  if (!isPositiveNumber(body.bedrooms)) return null
  if (!isPositiveNumber(body.bathrooms)) return null
  if (!isPositiveNumber(body.parkingSpots)) return null
  if (!isPositiveNumber(body.area) || body.area <= 0) return null
  if (!isNonEmptyString(body.description) || body.description.trim().length < 20) return null
  if (!Array.isArray(body.amenities) || !body.amenities.every((a) => typeof a === 'string')) {
    return null
  }

  let photos: string[] | undefined
  if (Array.isArray(body.photos)) {
    photos = body.photos
      .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
      .map((p) => p.trim())
    if (photos.length === 0) photos = undefined
  }

  return {
    title: body.title.trim(),
    type: body.type as CreateListingInput['type'],
    operation: body.operation as CreateListingInput['operation'],
    price: body.price,
    city: body.city.trim(),
    neighborhood: body.neighborhood.trim(),
    address: body.address.trim(),
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    parkingSpots: body.parkingSpots,
    area: body.area,
    description: body.description.trim(),
    amenities: body.amenities.map((a) => String(a).trim()).filter(Boolean),
    photos,
  }
}

export const announcerHandlers = [
  http.get('https://viacep.com.br/ws/:cep/json/', ({ params }) => {
    const cep = String(params.cep).replace(/\D/g, '')
    if (cep.length !== 8) {
      return HttpResponse.json({ erro: true })
    }
    // Deterministic mock for tests / offline mock mode
    return HttpResponse.json({
      cep: `${cep.slice(0, 5)}-${cep.slice(5)}`,
      logradouro: 'Avenida Colombo',
      bairro: 'Zona 7',
      localidade: 'Maringá',
      uf: 'PR',
    })
  }),

  http.get('/api/me/listings', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    if (request.headers.get('X-Force-Error') === '1') {
      return HttpResponse.json(
        { message: 'Não foi possível carregar seus anúncios' },
        { status: 500 },
      )
    }

    return HttpResponse.json({ data: myListings })
  }),

  http.post('/api/me/listings', async ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    const parsed = parseCreateListing(await request.json())
    if (!parsed) {
      return HttpResponse.json(
        { message: 'Dados do anúncio inválidos' },
        { status: 400 },
      )
    }

    const seed = encodeURIComponent(parsed.title.slice(0, 24) || 'listing')
    const photos = parsed.photos?.length
      ? parsed.photos
      : [`https://picsum.photos/seed/${seed}/800/600`]

    const listing: MyListing = {
      id: `mine-${Date.now()}`,
      ownerId: 'session-user',
      status: 'active',
      title: parsed.title,
      type: parsed.type,
      operation: parsed.operation,
      price: parsed.price,
      city: parsed.city,
      neighborhood: parsed.neighborhood,
      address: parsed.address,
      bedrooms: parsed.bedrooms,
      bathrooms: parsed.bathrooms,
      parkingSpots: parsed.parkingSpots,
      area: parsed.area,
      description: parsed.description,
      amenities: parsed.amenities,
      photos,
      featured: false,
      createdAt: new Date().toISOString().slice(0, 10),
    }

    myListings = [listing, ...myListings]
    return HttpResponse.json({ data: listing }, { status: 201 })
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
