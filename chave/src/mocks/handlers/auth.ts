import { http, HttpResponse } from 'msw'
import type {
  RentProfile,
  RentPurpose,
  User,
  UserGoal,
  UserRole,
} from '@/features/auth/types/auth'

const MOCK_TOKEN = 'mock-jwt-token-dev-only'
const GOALS: UserGoal[] = ['rent', 'list']
const PURPOSES: RentPurpose[] = ['morar', 'trabalho', 'estudos', 'temporada', 'outro']

function makeMockUser(partial: {
  name: string
  email: string
  id?: string
  goal?: UserGoal | null
  role?: UserRole | null
  onboardingComplete?: boolean
  rentProfile?: RentProfile | null
}): User {
  return {
    id: partial.id ?? 'user-001',
    name: partial.name,
    email: partial.email,
    goal: partial.goal ?? null,
    role: partial.role ?? null,
    onboardingComplete: partial.onboardingComplete ?? false,
    rentProfile: partial.rentProfile ?? null,
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

function isPurpose(value: unknown): value is RentPurpose {
  return typeof value === 'string' && PURPOSES.includes(value as RentPurpose)
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

    sessionUser = {
      ...sessionUser,
      rentProfile,
      onboardingComplete: body.onboardingComplete ?? true,
    }
    return HttpResponse.json(sessionUser)
  }),
]
