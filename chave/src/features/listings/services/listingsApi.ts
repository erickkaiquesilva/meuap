import { apiClient } from '@/core/api/client'
import type { PaginatedProperties, SearchFilters } from '@/shared/types/property'

export async function fetchListings(
  filters: SearchFilters,
): Promise<PaginatedProperties> {
  const params = new URLSearchParams()

  if (filters.op) params.set('op', filters.op)
  if (filters.city) params.set('city', filters.city)
  if (filters.neighborhood) params.set('neighborhood', filters.neighborhood)
  if (filters.type) params.set('type', filters.type)
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
  if (filters.minPrice) params.set('minPrice', filters.minPrice)
  if (filters.bedrooms) params.set('bedrooms', filters.bedrooms)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', filters.page)
  params.set('limit', '12')

  const { data } = await apiClient.get<PaginatedProperties>(
    `/api/properties?${params.toString()}`,
  )

  if (!data || !Array.isArray(data.data)) {
    return { data: [], total: 0, page: 1, limit: 12, totalPages: 0 }
  }
  return data
}
