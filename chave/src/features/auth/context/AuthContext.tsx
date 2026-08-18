import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { AuthContextValue, RegisterPayload, User } from '../types/auth'
import { apiGetMe, apiLogin, apiLogout, apiRegister } from '../services/authApi'
import { clearAuthToken, getAuthToken, setAuthToken } from '@/core/api/tokenStorage'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      setIsLoading(false)
      return
    }
    apiGetMe()
      .then(setUser)
      .catch(() => clearAuthToken())
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: me } = await apiLogin(email, password)
    setAuthToken(token)
    setUser(me)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const { token, user: me } = await apiRegister(payload)
    setAuthToken(token)
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout().catch(() => {})
    clearAuthToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
