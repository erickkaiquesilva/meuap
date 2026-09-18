import { apiClient } from '@/core/api/client'
import type { Property } from '@/shared/types/property'

export async function fetchFavorites(): Promise<Property[]> {
  const { data } = await apiClient.get<{ data: Property[] }>('/api/me/favorites')
  return data.data ?? []
}

export async function addFavorite(listingId: string): Promise<Property> {
  const { data } = await apiClient.post<{ data: Property }>('/api/me/favorites', {
    listingId,
  })
  return data.data
}

export async function removeFavorite(listingId: string): Promise<void> {
  await apiClient.delete(`/api/me/favorites/${listingId}`)
}
