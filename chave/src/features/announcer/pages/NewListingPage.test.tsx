import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { ListGoalGate } from '@/core/router/ListGoalGate'
import { AnnouncerDashboardPage } from './AnnouncerDashboardPage'
import { NewListingPage } from './NewListingPage'
import { clearAuthToken, setAuthToken } from '@/core/api/tokenStorage'
import { resetAuthSession } from '@/mocks/handlers/auth'
import { resetMyListings } from '@/mocks/handlers/announcer'
import { apiClient } from '@/core/api/client'

async function seedListAnnouncer() {
  const { data } = await apiClient.post<{ token: string }>(
    '/api/auth/register',
    {
      name: 'Dona Ana',
      email: `create-${Date.now()}@chave.com.br`,
      password: 'SenhaForte1!',
      goal: 'list',
    },
  )
  setAuthToken(data.token)
  await apiClient.patch('/api/auth/onboarding', {
    onboardingComplete: true,
    role: 'proprietario',
    listProfile: {
      kind: 'proprietario',
      cpf: '39053344705',
      phone: '44999999999',
      city: 'Maringá',
      hasListingReady: true,
    },
  })
}

function renderCreateFlow() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter(
    [
      {
        element: <ListGoalGate />,
        children: [
          { path: 'anuncios', element: <AnnouncerDashboardPage /> },
          { path: 'anuncios/novo', element: <NewListingPage /> },
        ],
      },
    ],
    { initialEntries: ['/anuncios/novo'] },
  )

  return render(
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('NewListingPage', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
    resetMyListings()
  })

  it('validates required fields before submit', async () => {
    await seedListAnnouncer()
    const user = userEvent.setup()
    renderCreateFlow()

    expect(await screen.findByRole('heading', { name: 'Novo anúncio' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Publicar anúncio' }))
    expect(screen.getByText('Título com pelo menos 8 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Informe um preço válido')).toBeInTheDocument()
  })

  it('publishes a listing and returns to the dashboard ready state', async () => {
    await seedListAnnouncer()
    const user = userEvent.setup()
    renderCreateFlow()

    await screen.findByRole('heading', { name: 'Novo anúncio' })

    await user.type(
      screen.getByLabelText('Título do anúncio'),
      'Apartamento amplo na Zona 7',
    )
    await user.type(screen.getByLabelText(/Aluguel mensal/i), '2500')
    await user.type(screen.getByLabelText('Endereço'), 'Rua Exemplo 100')
    await user.clear(screen.getByLabelText('Descrição'))
    await user.type(
      screen.getByLabelText('Descrição'),
      'Imóvel iluminado, próximo ao centro universitário e comércio local.',
    )
    await user.click(screen.getByLabelText('Piscina'))
    await user.click(screen.getByRole('button', { name: 'Publicar anúncio' }))

    await waitFor(() => {
      expect(screen.getByText('Meus anúncios')).toBeInTheDocument()
    })
    expect(await screen.findByText('Apartamento amplo na Zona 7')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Novo anúncio' })).toBeInTheDocument()
  })
})
