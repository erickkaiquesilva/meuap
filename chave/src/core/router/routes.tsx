import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@/shared/components/Layout/Layout'
import { OnboardingGate } from '@/core/router/OnboardingGate'
import { OnboardingRoute } from '@/core/router/OnboardingRoute'
import { ListGoalGate } from '@/core/router/ListGoalGate'
import { HomePage } from '@/features/home/pages/HomePage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { ListingsPage } from '@/features/listings/pages/ListingsPage'
import { PropertyPage } from '@/features/property/pages/PropertyPage'
import { OnboardingRentPage } from '@/features/onboarding/pages/OnboardingRentPage'
import { OnboardingListPage } from '@/features/onboarding/pages/OnboardingListPage'
import { AnnouncerDashboardPage } from '@/features/announcer/pages/AnnouncerDashboardPage'
import { NewListingPage } from '@/features/announcer/pages/NewListingPage'

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
  { path: 'entrar', element: <LoginPage /> },
  { path: 'cadastro', element: <RegisterPage /> },
  {
    path: 'onboarding',
    element: <OnboardingRoute />,
    children: [
      { path: 'alugar', element: <OnboardingRentPage /> },
      { path: 'anunciar', element: <OnboardingListPage /> },
    ],
  },
  {
    path: '/',
    element: <OnboardingGate />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'recuperar-senha', element: <ForgotPasswordPage /> },
          { path: 'imoveis', element: <ListingsPage /> },
          { path: 'imoveis/:id', element: <PropertyPage /> },
          {
            element: <ListGoalGate />,
            children: [
              { path: 'anuncios', element: <AnnouncerDashboardPage /> },
              { path: 'anuncios/novo', element: <NewListingPage /> },
              { path: 'anuncios/:listingId/editar', element: <NewListingPage /> },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
