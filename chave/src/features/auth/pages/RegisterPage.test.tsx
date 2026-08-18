import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../context/AuthContext'
import { RegisterPage } from './RegisterPage'
import { getAuthToken } from '@/core/api/tokenStorage'

function renderRegister() {
  return render(
    <AuthProvider>
      <RegisterPage />
    </AuthProvider>,
    { initialEntries: ['/cadastro'] },
  )
}

async function fillAccountFields(user: ReturnType<typeof userEvent.setup>, email = 'nova@chave.com.br') {
  await user.type(screen.getByLabelText('Nome'), 'Ana Silva')
  await user.type(screen.getByLabelText('E-mail'), email)
  await user.type(screen.getByLabelText('Senha'), 'Abcdefgh')
}

describe('RegisterPage', () => {
  it('blocks submit without role or intent', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByText('Selecione se você é corretor, corretora ou proprietário')).toBeInTheDocument()
    expect(screen.getByText('Selecione se quer vender, alugar ou ambos')).toBeInTheDocument()
    expect(getAuthToken()).toBeNull()
  })

  it('blocks a weak password and updates the strength meter', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByLabelText('Senha'), 'abc')
    expect(screen.getByText('Fraca — use 8+ caracteres')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Corretor' }))
    await user.click(screen.getByRole('button', { name: 'Vender' }))
    await user.type(screen.getByLabelText('Nome'), 'Ana Silva')
    await user.type(screen.getByLabelText('E-mail'), 'ana@chave.com.br')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByText('Senha fraca demais')).toBeInTheDocument()
    expect(getAuthToken()).toBeNull()
  })

  it('creates a session after a valid pré-cadastro', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('radio', { name: 'Proprietário' }))
    await user.click(screen.getByRole('button', { name: 'Alugar' }))
    await fillAccountFields(user)

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => {
      expect(getAuthToken()).toBeTruthy()
    })
  })

  it('shows a duplicate e-mail error from the API', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('radio', { name: 'Corretora' }))
    await user.click(screen.getByRole('button', { name: 'Vender' }))
    await fillAccountFields(user, 'existente@chave.com.br')

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('Este e-mail já está cadastrado')).toBeInTheDocument()
    expect(getAuthToken()).toBeNull()
  })
})
