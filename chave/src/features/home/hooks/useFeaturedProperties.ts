import { useQuery } from '@tanstack/react-query'
import { fetchFeaturedProperties } from '../services/homeApi'

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: fetchFeaturedProperties,
  })
}
