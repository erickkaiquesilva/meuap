import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { AuthSplitLayout } from './AuthSplitLayout'

describe('AuthSplitLayout', () => {
  it('renders the brand title, subtitle and form children', () => {
    render(
      <AuthSplitLayout title="Título da marca" subtitle="Texto de apoio">
        <p>Conteúdo do formulário</p>
      </AuthSplitLayout>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Título da marca' })).toBeInTheDocument()
    expect(screen.getByText('Texto de apoio')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo do formulário')).toBeInTheDocument()
  })

  it('links the logo to home and skips to the form', () => {
    render(
      <AuthSplitLayout title="Título" subtitle="Apoio">
        <form aria-label="Cadastro" />
      </AuthSplitLayout>,
    )

    expect(screen.getByRole('link', { name: 'Chave Imóveis — Página inicial' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Ir para o formulário' })).toHaveAttribute('href', '#auth-form')
  })

  it('does not render site header or footer chrome', () => {
    render(
      <AuthSplitLayout title="Título" subtitle="Apoio">
        <p>Form</p>
      </AuthSplitLayout>,
    )

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })
})
