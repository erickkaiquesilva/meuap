import axios from 'axios'
import { apiUrl } from './config'
import { clearAuthToken, getAuthToken } from './tokenStorage'

export const apiClient = axios.create({
  baseURL: apiUrl || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken()
      window.location.href = '/entrar'
    }
    return Promise.reject(error)
  },
)
