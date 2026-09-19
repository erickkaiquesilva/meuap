import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { clearAuthToken, setAuthToken } from '@/core/api/tokenStorage'
import { resetAuthSession } from '@/mocks/handlers/auth'
import { resetAlerts } from '@/mocks/handlers/alerts'
import { AlertModal } from './AlertModal'
import { AlertsPage } from '../../pages/AlertsPage'
import { toAlertFilters } from '../../api/alertsTypes'

function renderAlertFlow(initialPath = '/imoveis?city=Maringá&maxPrice=1500') {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter(
    [
      { path: 'entrar', element: <div>Login page</div> },
      {
        path: 'imoveis',
        element: (
          <AlertModal
            open
            filters={{ city: 'Maringá', maxPrice: '1500', op: 'rent' }}
            onClose={() => undefined}
          />
        ),
      },
      { path: 'alertas', element: <AlertsPage /> },
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

describe('toAlertFilters', () => {
  it('converts string search params into numeric alert filters', () => {
    expect(
      toAlertFilters({
        city: 'Maringá',
        maxPrice: '1500',
        bedrooms: '2',
        op: 'rent',
      }),
    ).toEqual({
      city: 'Maringá',
      maxPrice: 1500,
      bedrooms: 2,
      op: 'rent',
    })
  })
})

describe('AlertModal + AlertsPage', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
    resetAlerts()
  })

  it('redirects unauthenticated users to /entrar with return URL', async () => {
    const user = userEvent.setup()
    const { router } = renderAlertFlow('/imoveis?city=Maringá')

    await user.click(screen.getByRole('button', { name: 'Criar alerta' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/entrar')
      expect(router.state.location.search).toContain('redirect=')
    })
  })

  it('creates an alert with selected channels', async () => {
    setAuthToken('mock-jwt-token-dev-only')
    const user = userEvent.setup()
    renderAlertFlow('/imoveis')

    await user.click(screen.getByRole('checkbox', { name: 'WhatsApp' }))
    await user.click(screen.getByRole('button', { name: 'Criar alerta' }))

    expect(
      await screen.findByRole('status'),
    ).toHaveTextContent(/Alerta criado/)
  })

  it('lists alerts and allows disabling an active one', async () => {
    setAuthToken('mock-jwt-token-dev-only')
    resetAlerts([
      {
        id: 'alert-seed',
        filters: { city: 'Maringá', maxPrice: 1200 },
        channels: ['email'],
        active: true,
        createdAt: new Date().toISOString(),
      },
    ])
    const user = userEvent.setup()
    renderAlertFlow('/alertas')

    expect(await screen.findByText(/Maringá/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Desativar' }))

    await waitFor(() => {
      expect(screen.getByText('Inativo')).toBeInTheDocument()
    })
  })
})
