import { http, HttpResponse } from 'msw'

const MOCK_USER = {
  id: 'user-001',
  name: 'Usuário Teste',
  email: 'teste@chave.com.br',
}

const MOCK_TOKEN = 'mock-jwt-token-dev-only'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email?: string; password?: string }

    // Accepts any email/password in mock mode
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'E-mail e senha são obrigatórios' },
        { status: 400 },
      )
    }

    // Simulate wrong credentials for testing purposes
    if (body.password === 'wrongpassword') {
      return HttpResponse.json(
        { message: 'E-mail ou senha incorretos' },
        { status: 401 },
      )
    }

    return HttpResponse.json({ token: MOCK_TOKEN, user: MOCK_USER })
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json(MOCK_USER)
  }),
]
