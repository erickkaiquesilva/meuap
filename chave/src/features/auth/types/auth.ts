export type UserGoal = 'rent' | 'list'
/** Preenchido no onboarding de quem anuncia — null no pré-cadastro */
export type UserRole = 'corretor' | 'corretora' | 'proprietario'

export interface User {
  id: string
  name: string
  email: string
  goal: UserGoal | null
  role: UserRole | null
  onboardingComplete: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  goal: UserGoal
}

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  loginWithGoogle: (idToken?: string) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  completeOnboarding: () => Promise<User>
  logout: () => Promise<void>
}
