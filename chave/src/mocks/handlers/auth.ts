import { http, HttpResponse } from 'msw'

const MOCK_TOKEN = 'mock-jwt-token-dev-only'

function makeMockUser(name: string, email: string, id = 'user-001') {
  return { id, name, email }
}

const DEFAULT_USER = makeMockUser('Usuário Teste', 'teste@chave.com.br')

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

    return HttpResponse.json({ token: MOCK_TOKEN, user: DEFAULT_USER })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as { name?: string; email?: string; password?: string }

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 },
      )
    }

    // Simulate duplicate e-mail for testing
    if (body.email === 'existente@chave.com.br') {
      return HttpResponse.json(
        { message: 'Este e-mail já está cadastrado' },
        { status: 409 },
      )
    }

    const newUser = makeMockUser(body.name, body.email, `user-${Date.now()}`)
    return HttpResponse.json({ token: MOCK_TOKEN, user: newUser }, { status: 201 })
  }),

  http.post('/api/auth/forgot-password', async ({ request }) => {
    const body = await request.json() as { email?: string }

    if (!body.email) {
      return HttpResponse.json(
        { message: 'E-mail é obrigatório' },
        { status: 400 },
      )
    }

    // Always return success in mock mode (don't expose whether email exists)
    return HttpResponse.json({ message: 'Se o e-mail estiver cadastrado, você receberá as instruções.' })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json(DEFAULT_USER)
  }),
]
