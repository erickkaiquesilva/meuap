export const apiUrl = import.meta.env.VITE_API_URL as string
export const appEnv = import.meta.env.VITE_ENV as 'production' | 'staging' | 'mock'
export const waNumber = import.meta.env.VITE_WA_NUMBER as string

export const isMock = appEnv === 'mock'
