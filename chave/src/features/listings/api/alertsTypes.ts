import type { SearchFilters } from '@/shared/types/property'

export type AlertChannel = 'email' | 'push' | 'whatsapp'

export interface SearchAlert {
  id: string
  filters: Record<string, unknown>
  channels: AlertChannel[]
  active: boolean
  createdAt: string
}

export interface CreateAlertInput {
  filters: Record<string, unknown>
  channels: AlertChannel[]
}

const NUMERIC_KEYS = [
  'maxPrice',
  'minPrice',
  'bedrooms',
  'bathrooms',
  'parkingSpots',
  'minArea',
  'maxArea',
] as const

/** Maps URL/search filters to the API SearchAlert.filters shape (numbers where needed). */
export function toAlertFilters(filters: SearchFilters): Record<string, unknown> {
  const out: Record<string, unknown> = {}

  if (filters.op) out.op = filters.op
  if (filters.city) out.city = filters.city
  if (filters.neighborhood) out.neighborhood = filters.neighborhood
  if (filters.type) out.type = filters.type
  if (filters.amenities) out.amenities = filters.amenities

  for (const key of NUMERIC_KEYS) {
    const raw = filters[key]
    if (raw === undefined || raw === '') continue
    const n = Number(raw)
    if (!Number.isNaN(n)) out[key] = n
  }

  return out
}

export function summarizeAlertFilters(filters: Record<string, unknown>): string {
  const parts: string[] = []
  if (filters.op === 'rent') parts.push('Aluguel')
  if (filters.op === 'sale') parts.push('Venda')
  if (typeof filters.city === 'string') parts.push(filters.city)
  if (typeof filters.neighborhood === 'string') parts.push(filters.neighborhood)
  if (typeof filters.type === 'string') parts.push(String(filters.type))
  if (typeof filters.maxPrice === 'number') {
    parts.push(`até R$ ${filters.maxPrice.toLocaleString('pt-BR')}`)
  }
  if (typeof filters.bedrooms === 'number') parts.push(`${filters.bedrooms}+ quartos`)
  return parts.length > 0 ? parts.join(' · ') : 'Busca atual (sem filtros específicos)'
}
