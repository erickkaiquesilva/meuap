import { http, HttpResponse } from 'msw'
import type { ListingIntent, User, UserRole } from '@/features/auth/types/auth'

const MOCK_TOKEN = 'mock-jwt-token-dev-only'
const ROLES: UserRole[] = ['corretor', 'corretora', 'proprietario']
const INTENTS: ListingIntent[] = ['sell', 'rent']

function makeMockUser(partial: {
  name: string
  email: string
  id?: string
  role?: UserRole | null
  intent?: ListingIntent[]
  onboardingComplete?: boolean
}): User {
  return {
    id: partial.id ?? 'user-001',
    name: partial.name,
    email: partial.email,
    role: partial.role ?? null,
    intent: partial.intent ?? [],
    onboardingComplete: partial.onboardingComplete ?? false,
  }
}

const DEFAULT_USER = makeMockUser({
  name: 'Usuário Teste',
  email: 'teste@chave.com.br',
  onboardingComplete: true,
})

let sessionUser: User = DEFAULT_USER

export function resetAuthSession() {
  sessionUser = DEFAULT_USER
}

function isRole(value: unknown): value is UserRole {
  return typeof value === 'string' && ROLES.includes(value as UserRole)
}

function parseIntent(value: unknown): ListingIntent[] | null {
  if (!Array.isArray(value) || value.length === 0) return null
  const unique = [...new Set(value)]
  if (unique.some((item) => !INTENTS.includes(item as ListingIntent))) return null
  return unique as ListingIntent[]
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

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as {
      name?: string
      email?: string
      password?: string
      role?: unknown
      intent?: unknown
    }

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 },
      )
    }

    if (!isRole(body.role)) {
      return HttpResponse.json(
        { message: 'Selecione se você é corretor, corretora ou proprietário' },
        { status: 400 },
      )
    }

    const intent = parseIntent(body.intent)
    if (!intent) {
      return HttpResponse.json(
        { message: 'Selecione se quer vender, alugar ou ambos' },
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
      role: body.role,
      intent,
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
]
