import { apiClient } from '@/core/api/client'
import type { Property } from '@/shared/types/property'

export async function fetchProperty(id: string): Promise<Property> {
  const { data } = await apiClient.get<Property>(`/api/properties/${id}`)
  return data
}

export async function fetchSimilarProperties(id: string): Promise<Property[]> {
  const { data } = await apiClient.get<Property[]>(`/api/properties/${id}/similar`)
  if (!Array.isArray(data)) return []
  return data
}
