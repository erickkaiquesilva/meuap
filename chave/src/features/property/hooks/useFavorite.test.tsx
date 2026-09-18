import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { clearAuthToken, setAuthToken } from '@/core/api/tokenStorage'
import { resetAuthSession } from '@/mocks/handlers/auth'
import { resetFavorites } from '@/mocks/handlers/favorites'
import { useFavorite } from './useFavorite'
import { FavoritesPage } from '../pages/FavoritesPage'

function FavoriteToggle({ listingId }: { listingId: string }) {
  const { isFavorite, toggle, isPending } = useFavorite(listingId)
  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      disabled={isPending}
      onClick={toggle}
    >
      {isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
    </button>
  )
}

function renderToggle(initialPath = '/imoveis/1') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter(
    [
      { path: 'entrar', element: <div>Login page</div> },
      {
        path: 'imoveis/:id',
        element: <FavoriteToggle listingId="1" />,
      },
      {
        path: 'favoritos',
        element: <FavoritesPage />,
      },
    ],
    { initialEntries: [initialPath] },
  )

  return {
    router,
    ...render(
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>,
    ),
  }
}

describe('useFavorite', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
    resetFavorites()
  })

  it('redirects unauthenticated users to /entrar with return URL', async () => {
    const user = userEvent.setup()
    const { router } = renderToggle('/imoveis/1')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Favoritar' })).toBeEnabled()
    })
    await user.click(screen.getByRole('button', { name: 'Favoritar' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/entrar')
      expect(router.state.location.search).toBe('?redirect=%2Fimoveis%2F1')
    })
  })

  it('persists a favorite so it stays active after remount', async () => {
    setAuthToken('mock-jwt-token-dev-only')
    const user = userEvent.setup()
    const first = renderToggle('/imoveis/1')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Favoritar' })).toBeEnabled()
    })
    await user.click(screen.getByRole('button', { name: 'Favoritar' }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Remover dos favoritos' })).toBeInTheDocument()
    })
    first.unmount()

    renderToggle('/imoveis/1')
    expect(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    ).toBeInTheDocument()
  })

  it('removes a favorite when toggled again', async () => {
    setAuthToken('mock-jwt-token-dev-only')
    resetFavorites(['1'])
    const user = userEvent.setup()
    renderToggle('/imoveis/1')

    await user.click(
      await screen.findByRole('button', { name: 'Remover dos favoritos' }),
    )
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Favoritar' })).toBeInTheDocument()
    })
  })

  it('lists saved properties on the favorites page', async () => {
    setAuthToken('mock-jwt-token-dev-only')
    resetFavorites(['1'])
    renderToggle('/favoritos')

    expect(
      await screen.findByRole('heading', { name: 'Favoritos' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('link', {
        name: /Ver detalhes: Apartamento 2 Quartos com Varanda — Zona 7/i,
      }),
    ).toBeInTheDocument()
  })
})
