import type { Property } from '@/shared/types/property'

/** Approximate city centers (WGS84) for Maringá metro area */
const CITY_CENTER: Record<string, { lat: number; lng: number }> = {
  'Maringá': { lat: -23.4205, lng: -51.9333 },
  'Sarandi': { lat: -23.4441, lng: -51.8740 },
}

const DEFAULT_CENTER = CITY_CENTER['Maringá']

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

/**
 * Returns lat/lng for a property.
 * Prefer explicit coordinates when the API provides them; otherwise
 * scatter deterministically around the city center (mock / missing coords).
 */
export function getPropertyCoords(property: Property): { lat: number; lng: number } {
  if (typeof property.lat === 'number' && typeof property.lng === 'number') {
    return { lat: property.lat, lng: property.lng }
  }

  const base = CITY_CENTER[property.city] ?? DEFAULT_CENTER
  const h = hashString(`${property.id}-${property.neighborhood}`)
  // ~±0.035° ≈ ±3–4 km scatter
  const latOffset = ((h % 1000) / 1000 - 0.5) * 0.07
  const lngOffset = (((h >> 10) % 1000) / 1000 - 0.5) * 0.07
  return { lat: base.lat + latOffset, lng: base.lng + lngOffset }
}

export function getCityCenter(city?: string): { lat: number; lng: number } {
  if (city && CITY_CENTER[city]) return CITY_CENTER[city]
  return DEFAULT_CENTER
}

export function formatMapPrice(price: number): string {
  if (price >= 1000) {
    const k = price / 1000
    return `R$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`
  }
  return `R$${price}`
}
