import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

/** Requires auth + list capability (goal list or listProfile completed). */
export function ListGoalGate() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div aria-live="polite" aria-busy="true" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar?redirect=%2Fanuncios" replace />
  }

  const canList =
    !!user?.listProfile
    || (user?.goal === 'list' && user.onboardingComplete)

  if (!canList) {
    if (isAuthenticated) {
      return <Navigate to="/onboarding/anunciar?intent=list" replace />
    }
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
