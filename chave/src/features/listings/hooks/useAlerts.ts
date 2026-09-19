import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import { createAlert, disableAlert, fetchAlerts } from '../api/alertsApi'
import type { CreateAlertInput } from '../api/alertsTypes'

export const alertsQueryKey = ['alerts'] as const

export function useAlertsList(enabled = true) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: alertsQueryKey,
    queryFn: fetchAlerts,
    enabled: enabled && isAuthenticated,
  })
}

export function useCreateAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAlertInput) => createAlert(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: alertsQueryKey })
    },
  })
}

export function useDisableAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (alertId: string) => disableAlert(alertId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: alertsQueryKey })
    },
  })
}
