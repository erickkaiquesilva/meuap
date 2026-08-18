export type UserRole = 'corretor' | 'corretora' | 'proprietario'
export type ListingIntent = 'sell' | 'rent'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole | null
  intent: ListingIntent[]
  onboardingComplete: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
  intent: ListingIntent[]
}

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}
