import axios from 'axios'

/** Extrai mensagem do envelope Nest `{ error: { code, message } }` ou fallback Axios. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) return fallback
  const data = err.response?.data as
    | { error?: { message?: string; code?: string }; message?: string }
    | undefined
  if (data?.error?.message) return data.error.message
  if (typeof data?.message === 'string') return data.message
  return fallback
}

export function getApiErrorCode(err: unknown): string | undefined {
  if (!axios.isAxiosError(err)) return undefined
  const data = err.response?.data as { error?: { code?: string } } | undefined
  return data?.error?.code
}
