import { apiClient } from '@/core/api/client'
import { isMock } from '@/core/api/config'
import type {
  CreateListingInput,
  DeleteListingPayload,
  MyListing,
  UpdateListingInput,
} from '../types/listings'

export async function fetchMyListings(): Promise<MyListing[]> {
  const { data } = await apiClient.get<{ data: MyListing[] }>('/api/me/listings')
  return data.data ?? []
}

export async function fetchMyListing(id: string): Promise<MyListing> {
  const { data } = await apiClient.get<{ data: MyListing }>(`/api/me/listings/${id}`)
  return data.data
}

export async function createMyListing(payload: CreateListingInput): Promise<MyListing> {
  const { data } = await apiClient.post<{ data: MyListing }>('/api/me/listings', payload)
  return data.data
}

export async function updateMyListing(
  id: string,
  payload: UpdateListingInput,
): Promise<MyListing> {
  const { data } = await apiClient.put<{ data: MyListing }>(`/api/me/listings/${id}`, payload)
  return data.data
}

export async function deleteMyListing(
  id: string,
  payload: DeleteListingPayload,
): Promise<void> {
  await apiClient.delete(`/api/me/listings/${id}`, { data: payload })
}

/** Helper só do MSW / testes — a API real não expõe seed. */
export async function seedMyListings(ownerId: string, count = 3): Promise<MyListing[]> {
  if (!isMock) {
    throw new Error('seedMyListings só está disponível em VITE_ENV=mock')
  }
  const { data } = await apiClient.post<{ data: MyListing[] }>('/api/me/listings/seed', {
    ownerId,
    count,
  })
  return data.data
}
