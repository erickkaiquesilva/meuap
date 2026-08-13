import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout/Layout'
import { HomePage } from '@/features/home/pages/HomePage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { ListingsPage } from '@/features/listings/pages/ListingsPage'
import { PropertyPage } from '@/features/property/pages/PropertyPage'

function NotFoundPage() {
  return (
    <div style={{ padding: '96px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'var(--primary-500)', marginBottom: '16px' }}>
        404
      </h1>
      <p style={{ color: 'var(--neutral-500)', marginBottom: '32px' }}>
        Página não encontrada.
      </p>
      <a href="/" className="btn btn-primary">
        Voltar para o início
      </a>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'entrar', element: <LoginPage /> },
      { path: 'cadastro', element: <RegisterPage /> },
      { path: 'recuperar-senha', element: <ForgotPasswordPage /> },
      { path: 'imoveis', element: <ListingsPage /> },
      { path: 'imoveis/:id', element: <PropertyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
