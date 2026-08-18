import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'
import type { SearchFilters } from '@/shared/types/property'
import { fetchListings } from '../services/listingsApi'

const FILTER_KEYS: (keyof SearchFilters)[] = [
  'op', 'city', 'neighborhood', 'type',
  'maxPrice', 'minPrice', 'bedrooms', 'bathrooms', 'parkingSpots',
  'minArea', 'maxArea', 'amenities', 'sort', 'page',
]

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
    bathrooms: searchParams.get('bathrooms') ?? undefined,
    parkingSpots: searchParams.get('parkingSpots') ?? undefined,
    minArea: searchParams.get('minArea') ?? undefined,
    maxArea: searchParams.get('maxArea') ?? undefined,
    amenities: searchParams.get('amenities') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    page: searchParams.get('page') ?? '1',
  }

  const setFilters = useCallback(
    (next: Partial<SearchFilters>) => {
      setSearchParams((prev) => {
        const updated = new URLSearchParams(prev)
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

  return { filters, setFilters, setPage, resetFilters, filterKeys: FILTER_KEYS }
}

export function useListings(filters: SearchFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => fetchListings(filters),
    placeholderData: (prev) => prev,
  })
}

/** Larger unpaged set for the map + viewport-synced list */
export function useMapListings(filters: SearchFilters) {
  const { page: _page, ...mapFilters } = filters
  return useQuery({
    queryKey: ['listings-map', mapFilters],
    queryFn: () => fetchListings({ ...mapFilters, page: '1' }, { limit: 80 }),
    placeholderData: (prev) => prev,
  })
}
