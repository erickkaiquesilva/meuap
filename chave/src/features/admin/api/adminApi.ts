import { apiClient } from '@/core/api/client'
import type { MyListing } from '@/features/announcer/types/listings'

export async function fetchModerationQueue(): Promise<MyListing[]> {
  const { data } = await apiClient.get<{ data: MyListing[] }>('/api/admin/listings')
  return data.data ?? []
}

export async function approveListing(id: string): Promise<MyListing> {
  const { data } = await apiClient.post<{ data: MyListing }>(
    `/api/admin/listings/${id}/approve`,
  )
  return data.data
}

export async function rejectListing(id: string, reason: string): Promise<MyListing> {
  const { data } = await apiClient.post<{ data: MyListing }>(
    `/api/admin/listings/${id}/reject`,
    { reason },
  )
  return data.data
}
