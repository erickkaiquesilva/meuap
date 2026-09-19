import { apiUrl, isMock } from '@/core/api/config'
import { mockProperties } from '@/mocks/data/properties'
import type { PaginatedProperties, Property } from '@/shared/types/property'

function toProperty(row: (typeof mockProperties)[number]): Property {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    operation: row.operation,
    price: row.price,
    city: row.city,
    neighborhood: row.neighborhood,
    address: row.address,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parkingSpots: row.parkingSpots,
    area: row.area,
    photos: row.photos,
    description: row.description,
    featured: row.featured,
    badge: row.badge,
    createdAt: row.createdAt,
    amenities: row.amenities,
  }
}

function shouldUseLocalCatalog(): boolean {
  return isMock || !apiUrl
}

export async function loadFeaturedForSsr(): Promise<Property[]> {
  if (shouldUseLocalCatalog()) {
    return mockProperties.filter((p) => p.featured).slice(0, 6).map(toProperty)
  }
  const res = await fetch(`${apiUrl}/api/properties/featured`)
  if (!res.ok) return []
  return (await res.json()) as Property[]
}

export async function loadListingsForSsr(
  search = '',
): Promise<PaginatedProperties> {
  if (shouldUseLocalCatalog()) {
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
    let rows = [...mockProperties]
    const city = params.get('city')
    const op = params.get('op')
    if (city) rows = rows.filter((p) => p.city === city)
    if (op === 'rent' || op === 'sale') {
      rows = rows.filter((p) => p.operation === op)
    }
    const data = rows.slice(0, 12).map(toProperty)
    return {
      data,
      total: rows.length,
      page: 1,
      limit: 12,
      totalPages: Math.max(1, Math.ceil(rows.length / 12)),
    }
  }
  const qs = search.startsWith('?') ? search : search ? `?${search}` : '?limit=12'
  const res = await fetch(`${apiUrl}/api/properties${qs.includes('limit=') ? qs : `${qs}${qs.includes('?') ? '&' : '?'}limit=12`}`)
  if (!res.ok) {
    return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 }
  }
  return (await res.json()) as PaginatedProperties
}

export async function loadPropertyForSsr(id: string): Promise<Property | null> {
  if (shouldUseLocalCatalog()) {
    const found = mockProperties.find((p) => p.id === id)
    return found ? toProperty(found) : null
  }
  const res = await fetch(`${apiUrl}/api/properties/${id}`)
  if (res.status === 404) return null
  if (!res.ok) return null
  return (await res.json()) as Property
}
