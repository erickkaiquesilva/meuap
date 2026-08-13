import { useQuery } from '@tanstack/react-query'
import { fetchProperty, fetchSimilarProperties } from '../services/propertyApi'

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchProperty(id),
    enabled: !!id,
  })
}

export function useSimilarProperties(id: string) {
  return useQuery({
    queryKey: ['property', id, 'similar'],
    queryFn: () => fetchSimilarProperties(id),
    enabled: !!id,
  })
}
