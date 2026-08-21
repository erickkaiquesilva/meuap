import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
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
import { seedMyListings } from '../services/announcerApi'

async function seedListAnnouncer() {
  const { data } = await apiClient.post<{ token: string; user: { id: string } }>(
    '/api/auth/register',
    {
      name: 'Dona Ana',
      email: `dash-${Date.now()}@chave.com.br`,
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
  return data.user.id
}

function renderDashboard(path = '/anuncios') {
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
      { path: '/', element: <div>Home public</div> },
    ],
    { initialEntries: [path] },
  )

  return render(
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('AnnouncerDashboardPage', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
    resetMyListings()
  })

  it('shows empty state with CTA to create first listing', async () => {
    await seedListAnnouncer()
    const user = userEvent.setup()
    renderDashboard()

    expect(await screen.findByText('Você ainda não tem anúncios')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fazer meu primeiro anúncio' }))
    expect(await screen.findByText('Novo anúncio')).toBeInTheDocument()
  })

  it('shows ready grid and deletes a listing after choosing a reason', async () => {
    const ownerId = await seedListAnnouncer()
    await seedMyListings(ownerId, 3)
    const user = userEvent.setup()
    renderDashboard()

    expect(await screen.findByText('Meus anúncios')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'Excluir' })).toHaveLength(3)
    })

    await user.click(screen.getAllByRole('button', { name: 'Excluir' })[0])
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/Por que deseja excluir/i)).toBeInTheDocument()

    await user.click(within(dialog).getByLabelText('Desisti de anunciar'))
    await user.click(within(dialog).getByRole('button', { name: 'Excluir anúncio' }))

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'Excluir' })).toHaveLength(2)
    })
  })

  it('redirects rent users away from the dashboard', async () => {
    const { data } = await apiClient.post<{ token: string }>('/api/auth/register', {
      name: 'Locataria',
      email: `rent-dash-${Date.now()}@chave.com.br`,
      password: 'SenhaForte1!',
      goal: 'rent',
    })
    setAuthToken(data.token)
    await apiClient.patch('/api/auth/onboarding', {
      onboardingComplete: true,
      rentProfile: {
        purpose: 'morar',
        city: 'Maringá',
        maxRent: 2500,
        minBedrooms: 2,
        nearby: [],
        condoIncluded: false,
        wantsParking: false,
      },
    })

    renderDashboard()
    expect(await screen.findByText('Home public')).toBeInTheDocument()
  })
})
