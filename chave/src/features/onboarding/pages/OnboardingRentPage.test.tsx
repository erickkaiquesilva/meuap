import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext'
import { OnboardingRentPage } from './OnboardingRentPage'
import { clearAuthToken, getAuthToken, setAuthToken } from '@/core/api/tokenStorage'
import { resetAuthSession } from '@/mocks/handlers/auth'
import { apiClient } from '@/core/api/client'

function HomeProbe() {
  const { user } = useAuth()
  return (
    <div>
      <p>Home</p>
      <p data-testid="complete">{String(user?.onboardingComplete)}</p>
      <p data-testid="purpose">{user?.rentProfile?.purpose ?? 'none'}</p>
      <p data-testid="city">{user?.rentProfile?.city ?? 'none'}</p>
      <p data-testid="maxRent">{String(user?.rentProfile?.maxRent)}</p>
      <p data-testid="bedrooms">{String(user?.rentProfile?.minBedrooms)}</p>
      <p data-testid="wantRec">{String(user?.rentProfile?.wantRecommendations)}</p>
    </div>
  )
}

async function seedIncompleteRentUser() {
  const { data } = await apiClient.post<{ token: string }>('/api/auth/register', {
    name: 'Ana Locataria',
    email: `rent-wizard-${Date.now()}@chave.com.br`,
    password: 'SenhaForte1!',
    goal: 'rent',
  })
  setAuthToken(data.token)
}

function renderWizard() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter(
    [
      { path: 'onboarding/alugar', element: <OnboardingRentPage /> },
      { path: '/', element: <HomeProbe /> },
    ],
    { initialEntries: ['/onboarding/alugar'] },
  )

  return render(
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

describe('OnboardingRentPage', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
  })

  it('requires purpose before continuing', async () => {
    await seedIncompleteRentUser()
    const user = userEvent.setup()
    renderWizard()

    expect(await screen.findByText('Para que você busca um imóvel?')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(screen.getByText('Selecione o motivo da busca')).toBeInTheDocument()
    expect(getAuthToken()).toBeTruthy()
  })

  it('completes the wizard and persists rent profile', async () => {
    await seedIncompleteRentUser()
    const user = userEvent.setup()
    renderWizard()

    await screen.findByText('Para que você busca um imóvel?')
    await user.click(screen.getByRole('radio', { name: 'Estudos' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(await screen.findByText('Onde e quanto?')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Cidade'), 'Sarandi')
    await user.selectOptions(screen.getByLabelText('Aluguel até (R$)'), '4000')
    await user.click(screen.getByRole('radio', { name: '3+' }))
    await user.click(screen.getByRole('button', { name: 'Concluir' }))

    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    expect(screen.getByTestId('complete')).toHaveTextContent('true')
    expect(screen.getByTestId('purpose')).toHaveTextContent('estudos')
    expect(screen.getByTestId('city')).toHaveTextContent('Sarandi')
    expect(screen.getByTestId('maxRent')).toHaveTextContent('4000')
    expect(screen.getByTestId('bedrooms')).toHaveTextContent('3')
    expect(screen.getByTestId('wantRec')).toHaveTextContent('false')
  })

  it('allows going back to step 1', async () => {
    await seedIncompleteRentUser()
    const user = userEvent.setup()
    renderWizard()

    await screen.findByText('Para que você busca um imóvel?')
    await user.click(screen.getByRole('radio', { name: 'Morar' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    await screen.findByText('Onde e quanto?')
    await user.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(await screen.findByText('Para que você busca um imóvel?')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Morar' })).toHaveAttribute('aria-checked', 'true')
  })
})
