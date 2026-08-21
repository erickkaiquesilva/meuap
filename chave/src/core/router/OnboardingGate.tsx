import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { needsOnboarding, onboardingPathForGoal } from '@/features/auth/utils/onboarding'

/** Forces incomplete users into /onboarding/* when browsing the main app. */
export function OnboardingGate() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div aria-live="polite" aria-busy="true" />
  }

  if (
    isAuthenticated
    && needsOnboarding(user)
    && user?.goal
    && !location.pathname.startsWith('/onboarding')
  ) {
    return <Navigate to={onboardingPathForGoal(user.goal)} replace />
  }

  return <Outlet />
}
