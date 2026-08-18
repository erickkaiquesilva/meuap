import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../context/AuthContext'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { getAuthToken } from '@/core/api/tokenStorage'

function renderLogin() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>,
    { initialEntries: ['/entrar'] },
  )
}

describe('LoginPage Google', () => {
  it('creates a session with Conta Google in mock mode', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: 'Entrar com Conta Google' }))

    await waitFor(() => {
      expect(getAuthToken()).toBeTruthy()
    })
  })

  it('is not offered on the register screen', () => {
    render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>,
      { initialEntries: ['/cadastro'] },
    )

    expect(screen.queryByRole('button', { name: 'Entrar com Conta Google' })).not.toBeInTheDocument()
  })
})
