import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext'
import { OnboardingListPage } from './OnboardingListPage'
import { clearAuthToken, setAuthToken } from '@/core/api/tokenStorage'
import { resetAuthSession } from '@/mocks/handlers/auth'
import { apiClient } from '@/core/api/client'

function HomeProbe() {
  const { user } = useAuth()
  return (
    <div>
      <p>Home</p>
      <p data-testid="complete">{String(user?.onboardingComplete)}</p>
      <p data-testid="role">{user?.role ?? 'none'}</p>
      <p data-testid="kind">{user?.listProfile?.kind ?? 'none'}</p>
      <p data-testid="phone">
        {user?.listProfile && 'phone' in user.listProfile
          ? user.listProfile.phone
          : 'none'}
      </p>
    </div>
  )
}

async function seedIncompleteListUser() {
  const { data } = await apiClient.post<{ token: string }>('/api/auth/register', {
    name: 'Bruno Anunciante',
    email: `list-wizard-${Date.now()}@chave.com.br`,
    password: 'SenhaForte1!',
    goal: 'list',
  })
  setAuthToken(data.token)
}

function renderWizard() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter(
    [
      { path: 'onboarding/anunciar', element: <OnboardingListPage /> },
      { path: '/', element: <HomeProbe /> },
    ],
    { initialEntries: ['/onboarding/anunciar'] },
  )

  return render(
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('OnboardingListPage', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
  })

  it('requires persona before continuing', async () => {
    await seedIncompleteListUser()
    const user = userEvent.setup()
    renderWizard()

    expect(await screen.findByText('Você está anunciando como?')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText('Selecione como você anuncia')).toBeInTheDocument()
  })

  it('completes proprietario persona and marks onboarding done', async () => {
    await seedIncompleteListUser()
    const user = userEvent.setup()
    renderWizard()

    await screen.findByText('Você está anunciando como?')
    await user.click(screen.getByRole('radio', { name: /Sou o dono do imóvel/i }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(await screen.findByText('Dados do proprietário')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Telefone / WhatsApp'), '44999999999')
    await user.click(screen.getByRole('radio', { name: 'Sim' }))
    await user.click(screen.getByRole('button', { name: 'Concluir' }))

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
    expect(screen.getByTestId('complete')).toHaveTextContent('true')
    expect(screen.getByTestId('role')).toHaveTextContent('proprietario')
    expect(screen.getByTestId('kind')).toHaveTextContent('proprietario')
    expect(screen.getByTestId('phone')).toHaveTextContent('44999999999')
  })

  it('completes corretora persona with required fields', async () => {
    await seedIncompleteListUser()
    const user = userEvent.setup()
    renderWizard()

    await screen.findByText('Você está anunciando como?')
    await user.click(screen.getByRole('radio', { name: /Sou uma corretora/i }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(await screen.findByText('Dados da corretora')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Nome fantasia'), 'Chave Imob')
    await user.type(screen.getByLabelText('CNPJ'), '12.345.678/0001-90')
    await user.type(screen.getByLabelText('Telefone comercial'), '4430223344')
    await user.click(screen.getByRole('button', { name: 'Concluir' }))

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
    expect(screen.getByTestId('role')).toHaveTextContent('corretora')
    expect(screen.getByTestId('kind')).toHaveTextContent('corretora')
  })
})
