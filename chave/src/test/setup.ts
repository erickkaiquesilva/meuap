import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '@/mocks/server'
import { resetAuthSession } from '@/mocks/handlers/auth'
import { clearAuthToken } from '@/core/api/tokenStorage'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => {
  clearAuthToken()
  resetAuthSession()
  server.resetHandlers()
})
afterAll(() => server.close())
