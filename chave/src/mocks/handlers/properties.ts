import { http, HttpResponse } from 'msw'
import { mockProperties } from '../data/properties'
import { mockNeighborhoods } from '../data/neighborhoods'

export const propertyHandlers = [
  http.get('/api/properties/featured', () => {
    const featured = mockProperties.filter((p) => p.featured).slice(0, 6)
    return HttpResponse.json(featured)
  }),

  http.get('/api/properties', ({ request }) => {
    const url = new URL(request.url)
    const operation = url.searchParams.get('op')
    const city = url.searchParams.get('city')
    const neighborhood = url.searchParams.get('neighborhood')
    const type = url.searchParams.get('type')
    const maxPrice = url.searchParams.get('maxPrice')
    const minPrice = url.searchParams.get('minPrice')
    const bedrooms = url.searchParams.get('bedrooms')
    const sort = url.searchParams.get('sort') ?? 'relevant'
    const page = parseInt(url.searchParams.get('page') ?? '1', 10)
    const limit = parseInt(url.searchParams.get('limit') ?? '12', 10)

    let results = [...mockProperties]

    if (operation) results = results.filter((p) => p.operation === operation)
    if (city) results = results.filter((p) => p.city === city)
    if (neighborhood) results = results.filter((p) => p.neighborhood === neighborhood)
    if (type) results = results.filter((p) => p.type === type)
    if (maxPrice) results = results.filter((p) => p.price <= Number(maxPrice))
    if (minPrice) results = results.filter((p) => p.price >= Number(minPrice))
    if (bedrooms) results = results.filter((p) => p.bedrooms >= Number(bedrooms))

    switch (sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'area-desc':
        results.sort((a, b) => b.area - a.area)
        break
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    const total = results.length
    const totalPages = Math.ceil(total / limit)
    const data = results.slice((page - 1) * limit, page * limit)

    return HttpResponse.json({ data, total, page, limit, totalPages })
  }),

  http.get('/api/properties/:id', ({ params }) => {
    const property = mockProperties.find((p) => p.id === params.id)
    if (!property) return new HttpResponse(null, { status: 404 })

    // Inject realistic monthly cost breakdown for rental listings
    const enriched =
      property.operation === 'rent'
        ? {
            ...property,
            iptu: Math.round(property.price * 0.12),
            fireInsurance: Math.round(property.price * 0.03),
            serviceFee: Math.round(property.price * 0.08),
          }
        : property

    return HttpResponse.json(enriched)
  }),

  http.get('/api/properties/:id/similar', ({ params }) => {
    const current = mockProperties.find((p) => p.id === params.id)
    if (!current) return HttpResponse.json([])

    const similar = mockProperties
      .filter((p) => p.id !== params.id && p.type === current.type && p.city === current.city)
      .slice(0, 3)

    return HttpResponse.json(similar)
  }),

  http.get('/api/neighborhoods', ({ request }) => {
    const url = new URL(request.url)
    const city = url.searchParams.get('city')
    const results = city
      ? mockNeighborhoods.filter((n) => n.city === city)
      : mockNeighborhoods
    return HttpResponse.json(results)
  }),
]
