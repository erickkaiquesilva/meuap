import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

/** Requires auth + list goal + completed onboarding. */
export function ListGoalGate() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div aria-live="polite" aria-busy="true" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar?redirect=%2Fanuncios" replace />
  }

  if (!user?.onboardingComplete || user.goal !== 'list') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
