import axios from 'axios'
import { apiUrl } from './config'

export const apiClient = axios.create({
  baseURL: apiUrl || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Inject auth token on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('chave:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralised error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('chave:token')
      window.location.href = '/entrar'
    }
    return Promise.reject(error)
  },
)
