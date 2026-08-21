import { apiClient } from '@/core/api/client'
import type { DeleteListingPayload, MyListing } from '../types/listings'

export async function fetchMyListings(): Promise<MyListing[]> {
  const { data } = await apiClient.get<{ data: MyListing[] }>('/api/me/listings')
  return data.data ?? []
}

export async function deleteMyListing(
  id: string,
  payload: DeleteListingPayload,
): Promise<void> {
  await apiClient.delete(`/api/me/listings/${id}`, { data: payload })
}

/** Test / demo helper — seeds mock listings for the session. */
export async function seedMyListings(ownerId: string, count = 3): Promise<MyListing[]> {
  const { data } = await apiClient.post<{ data: MyListing[] }>('/api/me/listings/seed', {
    ownerId,
    count,
  })
  return data.data
}
