import { apiClient } from '@/core/api/client'
import type { CreateAlertInput, SearchAlert } from './alertsTypes'

export async function fetchAlerts(): Promise<SearchAlert[]> {
  const { data } = await apiClient.get<{ data: SearchAlert[] }>('/api/me/alerts')
  return data.data
}

export async function createAlert(input: CreateAlertInput): Promise<SearchAlert> {
  const { data } = await apiClient.post<{ data: SearchAlert }>('/api/me/alerts', input)
  return data.data
}

export async function disableAlert(alertId: string): Promise<SearchAlert> {
  const { data } = await apiClient.patch<{ data: SearchAlert }>(
    `/api/me/alerts/${alertId}/disable`,
  )
  return data.data
}
