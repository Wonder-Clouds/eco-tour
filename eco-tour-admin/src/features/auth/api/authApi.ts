import api from '@/config/axios'
import { Auth } from '@/types/auth.type'

export const loginUser = async (credentials: Auth) => {
  const response = await api.post('/token/', credentials)
  return response.data
}

export const verifyToken = async (token: string) => {
  const response = await api.post('/token/verify/', { token })
  return response.data
}

export const refreshTokenApi = async (refreshToken: string) => {
  const response = await api.post('/token/refresh/', { refresh: refreshToken })
  return response.data
}
