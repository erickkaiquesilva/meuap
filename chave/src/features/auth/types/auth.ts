export type UserGoal = 'rent' | 'list'
/** Preenchido no onboarding de quem anuncia — null no pré-cadastro */
export type UserRole = 'corretor' | 'corretora' | 'proprietario'

export type RentPurpose = 'morar' | 'trabalho' | 'estudos' | 'temporada' | 'outro'

export interface RentProfile {
  purpose: RentPurpose
  city: string
  maxRent: number | null
  minBedrooms: number | null
  /** Preferência do CTA em /imoveis (T055); default false no wizard */
  wantRecommendations: boolean
}

export type RentProfileInput = Omit<RentProfile, 'wantRecommendations'>

export interface ProprietarioListProfile {
  kind: 'proprietario'
  phone: string
  city: string
  hasListingReady: boolean
}

export interface CorretorListProfile {
  kind: 'corretor'
  creci: string
  phone: string
  city: string
}

export interface CorretoraListProfile {
  kind: 'corretora'
  tradeName: string
  legalName: string
  cnpj: string
  creciJ: string
  phone: string
  cities: string[]
  website: string
}

export type ListProfile =
  | ProprietarioListProfile
  | CorretorListProfile
  | CorretoraListProfile

export interface CompleteOnboardingPayload {
  rentProfile?: RentProfileInput
  role?: UserRole
  listProfile?: ListProfile
}

export interface User {
  id: string
  name: string
  email: string
  goal: UserGoal | null
  role: UserRole | null
  onboardingComplete: boolean
  rentProfile: RentProfile | null
  listProfile: ListProfile | null
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
  completeOnboarding: (payload?: CompleteOnboardingPayload) => Promise<User>
  logout: () => Promise<void>
}
