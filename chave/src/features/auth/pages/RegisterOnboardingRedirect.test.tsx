import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../context/AuthContext'
import { RegisterPage } from './RegisterPage'
import { clearAuthToken, getAuthToken } from '@/core/api/tokenStorage'
import { resetAuthSession } from '@/mocks/handlers/auth'

function renderRegisterFlow() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter(
    [
      { path: 'cadastro', element: <RegisterPage /> },
      { path: 'onboarding/alugar', element: <div>Chegou no onboarding alugar</div> },
      { path: 'onboarding/anunciar', element: <div>Chegou no onboarding anunciar</div> },
    ],
    { initialEntries: ['/cadastro'] },
  )

  return render(
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

async function fillAccountFields(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
) {
  await user.type(screen.getByLabelText('Qual o seu nome?'), 'Ana Silva')
  await user.type(screen.getByLabelText('Qual o seu e-mail?'), email)
  await user.type(screen.getByLabelText('Digite uma senha'), 'Abcdefgh')
  await user.type(screen.getByLabelText('Confirme a senha'), 'Abcdefgh')
  await user.click(screen.getByRole('checkbox', { name: /Aceito os/i }))
}

describe('RegisterPage onboarding redirect', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
  })

  it('sends rent goal to /onboarding/alugar', async () => {
    const user = userEvent.setup()
    renderRegisterFlow()

    await user.click(screen.getByRole('radio', { name: 'Alugar um imóvel' }))
    await fillAccountFields(user, 'rent-redirect@chave.com.br')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => {
      expect(getAuthToken()).toBeTruthy()
      expect(screen.getByText('Chegou no onboarding alugar')).toBeInTheDocument()
    })
  })

  it('sends list goal to /onboarding/anunciar', async () => {
    const user = userEvent.setup()
    renderRegisterFlow()

    await user.click(screen.getByRole('radio', { name: 'Anunciar um imóvel' }))
    await fillAccountFields(user, 'list-redirect@chave.com.br')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => {
      expect(getAuthToken()).toBeTruthy()
      expect(screen.getByText('Chegou no onboarding anunciar')).toBeInTheDocument()
    })
  })
})
