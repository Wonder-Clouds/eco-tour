import axios, { AxiosError } from 'axios'

const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Variables para manejar el refresh token de forma segura
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Si el error no es 401 o ya se intentó reintentar, rechazar
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Si ya se está refrescando el token, encolar esta petición
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      isRefreshing = false
      return Promise.reject(new Error('Window is undefined'))
    }

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      isRefreshing = false
      clearAuthStorage()
      window.location.href = '/login'
      return Promise.reject(new Error('No refresh token available'))
    }

    try {
      // Usar axios directamente para evitar el interceptor
      const response = await axios.post(`${apiBaseURL}/token/refresh/`, {
        refresh: refreshToken,
      })

      const { access, refresh } = response.data
      localStorage.setItem('accessToken', access)
      if (refresh) {
        localStorage.setItem('refreshToken', refresh)
      }

      // Procesar la cola de peticiones pendientes
      processQueue(null, access)

      originalRequest.headers.Authorization = `Bearer ${access}`
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError as Error, null)
      clearAuthStorage()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export const clearAuthStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}

export default api
