import { apiClient } from '@/core/api/client'
import type { Property } from '@/shared/types/property'

export async function fetchFeaturedProperties(): Promise<Property[]> {
  const { data } = await apiClient.get<Property[]>('/api/properties/featured')
  return data
}

export async function fetchNeighborhoods(city?: string): Promise<{ id: string; name: string; city: string }[]> {
  const params = city ? `?city=${encodeURIComponent(city)}` : ''
  const { data } = await apiClient.get(`/api/neighborhoods${params}`)
  return data
}
