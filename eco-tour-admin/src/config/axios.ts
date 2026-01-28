// src/utils/axios.ts
// import { RefreshToken } from '@/api/Token.api'
import axios, { AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest?.url !== '/token/refresh/' &&
      originalRequest
    ) {
      // try {
      //   const refreshToken = localStorage.getItem('refreshToken')
      //   const response = await RefreshToken(refreshToken as string)
      //   const { access } = response.data
      //   localStorage.setItem('accessToken', access)
      //   originalRequest.headers.Authorization = `Bearer ${access}`
      //   return axios(originalRequest)
      // } catch (refreshError) {
      //   localStorage.removeItem('accessToken')
      //   localStorage.removeItem('refreshToken')
      //   window.location.href = '/'
      //   return Promise.reject(refreshError)
      // }
    }

    return Promise.reject(error)
  },
)

export default api
