import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { onboardingPathForGoal } from '@/features/auth/utils/onboarding'

/**
 * Auth + onboarding branch for /onboarding/*.
 * Quem já completou onboarding (ex.: alugar) e ainda não tem listProfile
 * pode abrir `/onboarding/anunciar` para passar a anunciar — sem novo cadastro.
 */
export function OnboardingRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div aria-live="polite" aria-busy="true" />
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={`/entrar?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    )
  }

  const switchingToList =
    location.pathname.startsWith('/onboarding/anunciar')
    && user.onboardingComplete
    && !user.listProfile

  if (switchingToList) {
    return <Outlet />
  }

  if (user.onboardingComplete || !user.goal) {
    return <Navigate to="/" replace />
  }

  const expected = onboardingPathForGoal(user.goal)
  if (location.pathname !== expected && !location.pathname.startsWith(`${expected}/`)) {
    return <Navigate to={expected} replace />
  }

  return <Outlet />
}
