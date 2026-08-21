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

async function fillAccountFields(
  user: ReturnType<typeof userEvent.setup>,
  email = 'nova@chave.com.br',
) {
  await user.type(screen.getByLabelText('Qual o seu nome?'), 'Ana Silva')
  await user.type(screen.getByLabelText('Qual o seu e-mail?'), email)
  await user.type(screen.getByLabelText('Digite uma senha'), 'Abcdefgh')
  await user.type(screen.getByLabelText('Confirme a senha'), 'Abcdefgh')
  await user.click(screen.getByRole('checkbox', { name: /Aceito os/i }))
}

describe('RegisterPage', () => {
  it('blocks submit without goal or terms', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByText('Selecione se quer alugar ou anunciar um imóvel')).toBeInTheDocument()
    expect(screen.getByText('Aceite os Termos de uso e a Política de privacidade')).toBeInTheDocument()
    expect(getAuthToken()).toBeNull()
  })

  it('blocks mismatched confirm password', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('radio', { name: 'Alugar um imóvel' }))
    await user.type(screen.getByLabelText('Qual o seu nome?'), 'Ana Silva')
    await user.type(screen.getByLabelText('Qual o seu e-mail?'), 'ana@chave.com.br')
    await user.type(screen.getByLabelText('Digite uma senha'), 'Abcdefgh')
    await user.type(screen.getByLabelText('Confirme a senha'), 'OutraSenha1')
    await user.click(screen.getByRole('checkbox', { name: /Aceito os/i }))
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument()
    expect(getAuthToken()).toBeNull()
  })

  it('blocks a weak password and updates the strength meter', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByLabelText('Digite uma senha'), 'abc')
    expect(screen.getByText('Fraca — use 8+ caracteres')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Anunciar um imóvel' }))
    await user.type(screen.getByLabelText('Qual o seu nome?'), 'Ana Silva')
    await user.type(screen.getByLabelText('Qual o seu e-mail?'), 'ana@chave.com.br')
    await user.type(screen.getByLabelText('Confirme a senha'), 'abc')
    await user.click(screen.getByRole('checkbox', { name: /Aceito os/i }))
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(screen.getByText('Senha fraca demais')).toBeInTheDocument()
    expect(getAuthToken()).toBeNull()
  })

  it('creates a session after a valid pré-cadastro', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('radio', { name: 'Alugar um imóvel' }))
    await fillAccountFields(user)

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    await waitFor(() => {
      expect(getAuthToken()).toBeTruthy()
    })
  })

  it('shows a duplicate e-mail error from the API', async () => {
    const user = userEvent.setup()
    renderRegister()

    await user.click(screen.getByRole('radio', { name: 'Anunciar um imóvel' }))
    await fillAccountFields(user, 'existente@chave.com.br')

    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(await screen.findByText('Este e-mail já está cadastrado')).toBeInTheDocument()
    expect(getAuthToken()).toBeNull()
  })
})
