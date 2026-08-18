import type { Property } from '@/shared/types/property'

/** Approximate city centers (WGS84) for Maringá metro area — fallback only */
const CITY_CENTER: Record<string, { lat: number; lng: number }> = {
  'Maringá': { lat: -23.4205, lng: -51.9333 },
  'Sarandi': { lat: -23.4441, lng: -51.8740 },
}

const DEFAULT_CENTER = CITY_CENTER['Maringá']

const GEOCODE_CACHE_KEY = 'chave-geocode-v1'

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

export function buildGeocodeAddress(property: Property): string {
  return `${property.address}, ${property.neighborhood}, ${property.city}, Paraná, Brasil`
}

function readCache(): Record<string, { lat: number; lng: number }> {
  try {
    const raw = sessionStorage.getItem(GEOCODE_CACHE_KEY)
    return raw ? JSON.parse(raw) as Record<string, { lat: number; lng: number }> : {}
  } catch {
    return {}
  }
}

function writeCache(cache: Record<string, { lat: number; lng: number }>) {
  try {
    sessionStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache))
  } catch {
    /* quota / private mode */
  }
}

export function getCachedCoords(property: Property): { lat: number; lng: number } | null {
  if (typeof property.lat === 'number' && typeof property.lng === 'number') {
    return { lat: property.lat, lng: property.lng }
  }
  const cached = readCache()[buildGeocodeAddress(property)]
  return cached ?? null
}

/**
 * Geocode listing address via Maps JS Geocoder.
 * Requires Geocoding API enabled on the same browser key.
 */
export async function geocodeProperty(
  geocoder: google.maps.Geocoder,
  property: Property,
): Promise<{ lat: number; lng: number }> {
  const cached = getCachedCoords(property)
  if (cached) return cached

  const address = buildGeocodeAddress(property)

  const result = await new Promise<google.maps.GeocoderResult | null>((resolve) => {
    geocoder.geocode(
      { address, componentRestrictions: { country: 'BR' } },
      (results, status) => {
        if (status === 'OK' && results?.[0]) resolve(results[0])
        else resolve(null)
      },
    )
  })

  const loc = result?.geometry.location
  if (loc) {
    const coords = { lat: loc.lat(), lng: loc.lng() }
    const cache = readCache()
    cache[address] = coords
    writeCache(cache)
    return coords
  }

  return getCityCenter(property.city)
}
