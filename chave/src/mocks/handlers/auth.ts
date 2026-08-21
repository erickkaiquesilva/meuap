import { http, HttpResponse } from 'msw'
import type {
  ListProfile,
  RentProfile,
  RentPurpose,
  User,
  UserGoal,
  UserRole,
} from '@/features/auth/types/auth'

const MOCK_TOKEN = 'mock-jwt-token-dev-only'
const GOALS: UserGoal[] = ['rent', 'list']
const ROLES: UserRole[] = ['proprietario', 'corretor', 'corretora']
const PURPOSES: RentPurpose[] = ['morar', 'trabalho', 'estudos', 'temporada', 'outro']

function makeMockUser(partial: {
  name: string
  email: string
  id?: string
  goal?: UserGoal | null
  role?: UserRole | null
  onboardingComplete?: boolean
  rentProfile?: RentProfile | null
  listProfile?: ListProfile | null
}): User {
  return {
    id: partial.id ?? 'user-001',
    name: partial.name,
    email: partial.email,
    goal: partial.goal ?? null,
    role: partial.role ?? null,
    onboardingComplete: partial.onboardingComplete ?? false,
    rentProfile: partial.rentProfile ?? null,
    listProfile: partial.listProfile ?? null,
  }
}

const DEFAULT_USER = makeMockUser({
  name: 'Usuário Teste',
  email: 'teste@chave.com.br',
  goal: 'rent',
  onboardingComplete: true,
})

let sessionUser: User = DEFAULT_USER

export function resetAuthSession() {
  sessionUser = DEFAULT_USER
}

function isGoal(value: unknown): value is UserGoal {
  return typeof value === 'string' && GOALS.includes(value as UserGoal)
}

function isRole(value: unknown): value is UserRole {
  return typeof value === 'string' && ROLES.includes(value as UserRole)
}

function isPurpose(value: unknown): value is RentPurpose {
  return typeof value === 'string' && PURPOSES.includes(value as RentPurpose)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

function parseRentProfile(raw: unknown): RentProfile | null {
  if (!raw || typeof raw !== 'object') return null
  const body = raw as Record<string, unknown>
  if (!isPurpose(body.purpose)) return null
  if (typeof body.city !== 'string' || !body.city.trim()) return null

  const maxRent =
    body.maxRent === null
      ? null
      : typeof body.maxRent === 'number' && Number.isFinite(body.maxRent)
        ? body.maxRent
        : undefined
  if (maxRent === undefined) return null

  const minBedrooms =
    body.minBedrooms === null
      ? null
      : typeof body.minBedrooms === 'number' && Number.isFinite(body.minBedrooms)
        ? body.minBedrooms
        : undefined
  if (minBedrooms === undefined) return null

  return {
    purpose: body.purpose,
    city: body.city.trim(),
    maxRent,
    minBedrooms,
    wantRecommendations: false,
  }
}

function parseListProfile(raw: unknown, role: UserRole): ListProfile | null {
  if (!raw || typeof raw !== 'object') return null
  const body = raw as Record<string, unknown>

  if (role === 'proprietario') {
    if (body.kind !== 'proprietario') return null
    if (!isNonEmptyString(body.phone) || digitsOnly(body.phone).length < 10) return null
    if (!isNonEmptyString(body.city)) return null
    if (typeof body.hasListingReady !== 'boolean') return null
    return {
      kind: 'proprietario',
      phone: body.phone.trim(),
      city: body.city.trim(),
      hasListingReady: body.hasListingReady,
    }
  }

  if (role === 'corretor') {
    if (body.kind !== 'corretor') return null
    if (!isNonEmptyString(body.creci)) return null
    if (!isNonEmptyString(body.phone) || digitsOnly(body.phone).length < 10) return null
    if (!isNonEmptyString(body.city)) return null
    return {
      kind: 'corretor',
      creci: body.creci.trim(),
      phone: body.phone.trim(),
      city: body.city.trim(),
    }
  }

  if (role === 'corretora') {
    if (body.kind !== 'corretora') return null
    if (!isNonEmptyString(body.tradeName)) return null
    if (!isNonEmptyString(body.cnpj) || digitsOnly(body.cnpj).length !== 14) return null
    if (!isNonEmptyString(body.phone) || digitsOnly(body.phone).length < 10) return null
    if (!Array.isArray(body.cities) || body.cities.length === 0) return null
    if (!body.cities.every((c) => typeof c === 'string' && c.trim())) return null
    return {
      kind: 'corretora',
      tradeName: body.tradeName.trim(),
      legalName: typeof body.legalName === 'string' ? body.legalName.trim() : '',
      cnpj: digitsOnly(body.cnpj),
      creciJ: typeof body.creciJ === 'string' ? body.creciJ.trim() : '',
      phone: body.phone.trim(),
      cities: body.cities.map((c) => String(c).trim()),
      website: typeof body.website === 'string' ? body.website.trim() : '',
    }
  }

  return null
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string }

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'E-mail e senha são obrigatórios' },
        { status: 400 },
      )
    }

    if (body.password === 'wrongpassword') {
      return HttpResponse.json(
        { message: 'E-mail ou senha incorretos' },
        { status: 401 },
      )
    }

    sessionUser = DEFAULT_USER
    return HttpResponse.json({ token: MOCK_TOKEN, user: sessionUser })
  }),

  http.post('/api/auth/google', async () => {
    sessionUser = makeMockUser({
      name: 'Conta Google',
      email: 'google.user@chave.com.br',
      id: 'user-google',
      goal: null,
      onboardingComplete: true,
    })
    return HttpResponse.json({ token: MOCK_TOKEN, user: sessionUser })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as {
      name?: string
      email?: string
      password?: string
      goal?: unknown
    }

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 },
      )
    }

    if (!isGoal(body.goal)) {
      return HttpResponse.json(
        { message: 'Selecione se quer alugar ou anunciar um imóvel' },
        { status: 400 },
      )
    }

    if (body.email === 'existente@chave.com.br') {
      return HttpResponse.json(
        { message: 'Este e-mail já está cadastrado' },
        { status: 409 },
      )
    }

    sessionUser = makeMockUser({
      name: body.name,
      email: body.email,
      id: `user-${Date.now()}`,
      goal: body.goal,
      role: null,
      onboardingComplete: false,
    })
    return HttpResponse.json({ token: MOCK_TOKEN, user: sessionUser }, { status: 201 })
  }),

  http.post('/api/auth/forgot-password', async ({ request }) => {
    const body = await request.json() as { email?: string }

    if (!body.email) {
      return HttpResponse.json(
        { message: 'E-mail é obrigatório' },
        { status: 400 },
      )
    }

    return HttpResponse.json({ message: 'Se o e-mail estiver cadastrado, você receberá as instruções.' })
  }),

  http.post('/api/auth/logout', () => {
    resetAuthSession()
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json(sessionUser)
  }),

  http.patch('/api/auth/onboarding', async ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }

    const body = await request.json() as {
      onboardingComplete?: boolean
      rentProfile?: unknown
      role?: unknown
      listProfile?: unknown
    }

    let rentProfile = sessionUser.rentProfile
    if (body.rentProfile !== undefined) {
      const parsed = parseRentProfile(body.rentProfile)
      if (!parsed) {
        return HttpResponse.json(
          { message: 'Perfil de busca inválido' },
          { status: 400 },
        )
      }
      rentProfile = parsed
    }

    let role = sessionUser.role
    let listProfile = sessionUser.listProfile

    if (body.role !== undefined || body.listProfile !== undefined) {
      if (!isRole(body.role)) {
        return HttpResponse.json(
          { message: 'Selecione se é dono, corretor ou corretora' },
          { status: 400 },
        )
      }
      const parsedList = parseListProfile(body.listProfile, body.role)
      if (!parsedList) {
        return HttpResponse.json(
          { message: 'Dados do anunciante inválidos' },
          { status: 400 },
        )
      }
      role = body.role
      listProfile = parsedList
    }

    sessionUser = {
      ...sessionUser,
      rentProfile,
      role,
      listProfile,
      onboardingComplete: body.onboardingComplete ?? true,
    }
    return HttpResponse.json(sessionUser)
  }),
]
