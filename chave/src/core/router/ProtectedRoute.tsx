import { Navigate, Outlet, useLocation } from 'react-router-dom'

// Placeholder until AuthContext is wired in T018
function useAuth() {
  return { isAuthenticated: false, isLoading: false }
}

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div aria-live="polite" aria-busy="true" />
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/entrar?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  return <Outlet />
}
