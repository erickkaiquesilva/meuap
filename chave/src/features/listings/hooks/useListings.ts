import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import type { SearchFilters } from '@/shared/types/property'
import { fetchListings } from '../services/listingsApi'

export function useListingsFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: SearchFilters = {
    op: (searchParams.get('op') as 'rent' | 'sale') ?? undefined,
    city: searchParams.get('city') ?? undefined,
    neighborhood: searchParams.get('neighborhood') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    maxPrice: searchParams.get('maxPrice') ?? undefined,
    minPrice: searchParams.get('minPrice') ?? undefined,
    bedrooms: searchParams.get('bedrooms') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    page: searchParams.get('page') ?? '1',
  }

  const setFilters = useCallback(
    (next: Partial<SearchFilters>) => {
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev)
        // Reset to page 1 whenever filters change (except explicit page updates)
        if (!('page' in next)) updated.set('page', '1')

        Object.entries(next).forEach(([key, val]) => {
          if (val) {
            updated.set(key, val)
          } else {
            updated.delete(key)
          }
        })
        return updated
      })
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev)
        updated.set('page', String(page))
        return updated
      })
    },
    [setSearchParams],
  )

  const resetFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  return { filters, setFilters, setPage, resetFilters }
}

export function useListings(filters: SearchFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => fetchListings(filters),
    placeholderData: (prev) => prev,
  })
}
