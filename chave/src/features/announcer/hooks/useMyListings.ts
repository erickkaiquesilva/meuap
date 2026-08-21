import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMyListing,
  deleteMyListing,
  fetchMyListings,
} from '../services/announcerApi'
import type { CreateListingInput, DeleteListingPayload } from '../types/listings'

export function useMyListings() {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: fetchMyListings,
  })
}

export function useCreateMyListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateListingInput) => createMyListing(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })
}

export function useDeleteMyListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DeleteListingPayload }) =>
      deleteMyListing(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })
}
