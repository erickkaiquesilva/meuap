import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { AdminGuard } from './AdminGuard'
import { AdminQueuePage } from '@/features/admin/pages/AdminQueuePage'
import { clearAuthToken, setAuthToken } from '@/core/api/tokenStorage'
import { markSessionAdmin, resetAuthSession } from '@/mocks/handlers/auth'
import { resetAdminQueue } from '@/mocks/handlers/admin'
import { apiClient } from '@/core/api/client'

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <div>Home public</div> },
      { path: 'entrar', element: <div>Login</div> },
      {
        path: 'admin',
        element: <AdminGuard />,
        children: [{ index: true, element: <AdminQueuePage /> }],
      },
    ],
    { initialEntries: [path] },
  )

  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )
}

async function register(email: string) {
  const { data } = await apiClient.post<{ token: string }>('/api/auth/register', {
    name: 'Ana',
    email,
    password: 'SenhaForte1!',
    goal: 'list',
  })
  setAuthToken(data.token)
}

describe('AdminGuard', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
    resetAdminQueue([])
  })

  it('lets an admin open /admin', async () => {
    await register(`admin-${Date.now()}@chave.com.br`)
    markSessionAdmin()
    renderAt('/admin')

    expect(await screen.findByRole('heading', { name: 'Fila de moderação' })).toBeInTheDocument()
  })

  it('redirects a non-admin from /admin to home', async () => {
    await register(`user-${Date.now()}@chave.com.br`)
    renderAt('/admin')

    await waitFor(() => {
      expect(screen.getByText('Home public')).toBeInTheDocument()
    })
    expect(screen.queryByRole('heading', { name: 'Fila de moderação' })).not.toBeInTheDocument()
  })
})
