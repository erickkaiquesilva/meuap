import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { addFavorite, fetchFavorites, removeFavorite } from '../api/favoritesApi'

export const favoritesQueryKey = ['favorites'] as const

export function useFavoritesList(enabled = true) {
  const { isAuthenticated, isLoading } = useAuth()
  return useQuery({
    queryKey: favoritesQueryKey,
    queryFn: fetchFavorites,
    enabled: enabled && !isLoading && isAuthenticated,
  })
}

export function useFavorite(listingId: string) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { data: favorites = [] } = useFavoritesList()

  const isFavorite = favorites.some((property) => property.id === listingId)

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: favoritesQueryKey })
  }

  const add = useMutation({
    mutationFn: () => addFavorite(listingId),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: () => removeFavorite(listingId),
    onSuccess: invalidate,
  })

  function toggle() {
    if (isLoading) return
    if (!isAuthenticated) {
      const returnTo = `${location.pathname}${location.search}`
      navigate(`/entrar?redirect=${encodeURIComponent(returnTo)}`)
      return
    }
    if (isFavorite) {
      remove.mutate()
      return
    }
    add.mutate()
  }

  return {
    isFavorite,
    toggle,
    isPending: isLoading || add.isPending || remove.isPending,
  }
}
