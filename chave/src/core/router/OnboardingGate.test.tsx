import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { OnboardingGate } from './OnboardingGate'
import { OnboardingRoute } from './OnboardingRoute'
import { setAuthToken, clearAuthToken } from '@/core/api/tokenStorage'
import { resetAuthSession } from '@/mocks/handlers/auth'
import { apiClient } from '@/core/api/client'

function AppHome() {
  return <div>App home</div>
}

function RentStub() {
  return <div>Onboarding rent</div>
}

function ListStub() {
  return <div>Onboarding list</div>
}

function renderApp(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: 'onboarding',
        element: <OnboardingRoute />,
        children: [
          { path: 'alugar', element: <RentStub /> },
          { path: 'anunciar', element: <ListStub /> },
        ],
      },
      {
        path: '/',
        element: <OnboardingGate />,
        children: [{ index: true, element: <AppHome /> }],
      },
    ],
    { initialEntries: [initialPath] },
  )

  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  )
}

describe('onboarding gate and routes', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
  })

  it('lets guests browse the app', async () => {
    renderApp('/')
    expect(await screen.findByText('App home')).toBeInTheDocument()
  })

  it('redirects incomplete users from the app into onboarding', async () => {
    const { data } = await apiClient.post<{ token: string }>('/api/auth/register', {
      name: 'Ana',
      email: 'ana-gate@chave.com.br',
      password: 'SenhaForte1!',
      goal: 'rent',
    })
    setAuthToken(data.token)

    renderApp('/')

    await waitFor(() => {
      expect(screen.getByText('Onboarding rent')).toBeInTheDocument()
    })
  })

  it('keeps incomplete list users on /onboarding/anunciar', async () => {
    const { data } = await apiClient.post<{ token: string }>('/api/auth/register', {
      name: 'Bruno',
      email: 'bruno-gate@chave.com.br',
      password: 'SenhaForte1!',
      goal: 'list',
    })
    setAuthToken(data.token)

    renderApp('/onboarding/anunciar')

    expect(await screen.findByText('Onboarding list')).toBeInTheDocument()
  })

  it('sends incomplete rent users away from the list onboarding path', async () => {
    const { data } = await apiClient.post<{ token: string }>('/api/auth/register', {
      name: 'Carla',
      email: 'carla-gate@chave.com.br',
      password: 'SenhaForte1!',
      goal: 'rent',
    })
    setAuthToken(data.token)

    renderApp('/onboarding/anunciar')

    await waitFor(() => {
      expect(screen.getByText('Onboarding rent')).toBeInTheDocument()
    })
  })
})
