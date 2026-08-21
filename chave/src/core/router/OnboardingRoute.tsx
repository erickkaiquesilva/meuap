import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { onboardingPathForGoal } from '@/features/auth/utils/onboarding'

/** Auth + correct onboarding branch for /onboarding/* routes. */
export function OnboardingRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div aria-live="polite" aria-busy="true" />
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={`/entrar?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
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
