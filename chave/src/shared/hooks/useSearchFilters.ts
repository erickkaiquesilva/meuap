import { useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import type { SearchFilters } from '@/shared/types/property'

export function useSearchFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const filters: SearchFilters = {
    op: (searchParams.get('op') as SearchFilters['op']) ?? undefined,
    city: searchParams.get('city') ?? undefined,
    neighborhood: searchParams.get('neighborhood') ?? undefined,
    maxPrice: searchParams.get('maxPrice') ?? undefined,
    bedrooms: searchParams.get('bedrooms') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    page: searchParams.get('page') ?? undefined,
  }

  const setFilters = useCallback(
    (newFilters: SearchFilters) => {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })
      setSearchParams(params)
    },
    [setSearchParams],
  )

  const navigateToListings = useCallback(
    (newFilters: SearchFilters) => {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })
      navigate(`/imoveis?${params.toString()}`)
    },
    [navigate],
  )

  return { filters, setFilters, navigateToListings }
}
