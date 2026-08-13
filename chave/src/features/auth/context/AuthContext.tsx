import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { AuthContextValue, User } from '../types/auth'
import { apiGetMe, apiLogin, apiLogout, apiRegister } from '../services/authApi'

const TOKEN_KEY = 'chave:token'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }
    apiGetMe()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token, user: me } = await apiLogin(email, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(me)
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { token, user: me } = await apiRegister(name, email, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout().catch(() => {})
    localStorage.removeItem(TOKEN_KEY)
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
