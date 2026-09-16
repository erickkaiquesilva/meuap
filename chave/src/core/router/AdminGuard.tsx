import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'

/** JWT válido + isAdmin. Visitante vai para o login; não-admin volta para a home. */
export function AdminGuard() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div aria-live="polite" aria-busy="true" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar?redirect=%2Fadmin" replace />
  }

  if (user?.isAdmin !== true) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
