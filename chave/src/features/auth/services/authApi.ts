import { apiClient } from '@/core/api/client'
import type { CompleteOnboardingPayload, RegisterPayload, User } from '../types/auth'

export async function apiLogin(
  email: string,
  password: string,
): Promise<{ token: string; user: User }> {
  const { data } = await apiClient.post<{ token: string; user: User }>(
    '/api/auth/login',
    { email, password },
  )
  return data
}

export async function apiLoginWithGoogle(
  idToken?: string,
): Promise<{ token: string; user: User }> {
  const { data } = await apiClient.post<{ token: string; user: User }>(
    '/api/auth/google',
    idToken ? { idToken } : { provider: 'google' },
  )
  return data
}

export async function apiRegister(
  payload: RegisterPayload,
): Promise<{ token: string; user: User }> {
  const { data } = await apiClient.post<{ token: string; user: User }>(
    '/api/auth/register',
    payload,
  )
  return data
}

export async function apiCompleteOnboarding(
  payload?: CompleteOnboardingPayload,
): Promise<User> {
  const { data } = await apiClient.patch<User>('/api/auth/onboarding', {
    onboardingComplete: true,
    ...payload,
  })
  if (!data || typeof data !== 'object' || !('id' in data)) {
    throw new Error('Invalid user response')
  }
  return data
}

export async function apiSetWantRecommendations(want: boolean): Promise<User> {
  const { data } = await apiClient.patch<User>('/api/auth/rent-profile', {
    wantRecommendations: want,
  })
  if (!data || typeof data !== 'object' || !('id' in data)) {
    throw new Error('Invalid user response')
  }
  return data
}

export async function apiForgotPassword(email: string): Promise<void> {
  await apiClient.post('/api/auth/forgot-password', { email })
}

export async function apiLogout(): Promise<void> {
  await apiClient.post('/api/auth/logout')
}

export async function apiGetMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/api/auth/me')
  if (!data || typeof data !== 'object' || !('id' in data)) {
    throw new Error('Invalid user response')
  }
  return data
}
