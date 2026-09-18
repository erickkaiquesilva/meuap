import { apiClient } from '@/core/api/client'

export interface VisitRequestDto {
  id: string
  listingId: string
  renterId: string
  slotStart: string
  slotEnd: string
  status: string
  createdAt: string
}

export async function createVisit(input: {
  listingId: string
  slotStart: string
  slotEnd: string
}): Promise<VisitRequestDto> {
  const { data } = await apiClient.post<{ data: VisitRequestDto }>('/api/visits', input)
  return data.data
}
