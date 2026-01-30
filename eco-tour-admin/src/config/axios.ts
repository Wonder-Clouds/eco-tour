import axios, { AxiosError } from 'axios'

const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refreshToken')
          if (!refreshToken) {
            clearAuthStorage()
            throw new Error('No refresh token available')
          }

          const response = await api.post('/token/refresh/', {
            refresh: refreshToken,
          })
          const { access, refresh } = response.data
          localStorage.setItem('accessToken', access)
          localStorage.setItem('refreshToken', refresh)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        clearAuthStorage()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
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
