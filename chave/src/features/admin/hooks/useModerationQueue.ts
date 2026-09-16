import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { approveListing, fetchModerationQueue, rejectListing } from '../api/adminApi'

export function useModerationQueue() {
  return useQuery({
    queryKey: ['admin-queue'],
    queryFn: fetchModerationQueue,
  })
}

export function useApproveListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveListing(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-queue'] })
    },
  })
}

export function useRejectListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectListing(id, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-queue'] })
    },
  })
}
