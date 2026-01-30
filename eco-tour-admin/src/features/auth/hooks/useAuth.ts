import { useMutation, useQuery } from '@tanstack/react-query'
import {
  loginUser,
  verifyToken,
  refreshTokenApi,
} from '@/features/auth/api/authApi'
import { Auth } from '@/types/auth.type'
import { clearAuthStorage } from '@/config/axios'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

const isServer = typeof window === 'undefined'

export const useAuth = () => {
  const navigate = useNavigate()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (!isServer) {
      setIsMounted(true)
      const token = localStorage.getItem('accessToken')
      setAccessToken(token)
    }
  }, [])

  const { data: isVerified, isLoading: isVerifying } = useQuery({
    queryKey: ['auth', 'verify', accessToken],
    queryFn: async () => {
      if (isServer || !accessToken) return false
      try {
        await verifyToken(accessToken)
        return true
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } }
        // Si el token expiró, intenta renovarlo
        if (axiosError?.response?.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const response = await refreshTokenApi(refreshToken)
              localStorage.setItem('accessToken', response.access)
              setAccessToken(response.access)
              return true
            } catch {
              clearAuthStorage()
              setAccessToken(null)
              return false
            }
          }
        }
        clearAuthStorage()
        setAccessToken(null)
        return false
      }
    },
    enabled: !isServer && !!accessToken && isMounted,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: Auth) => loginUser(credentials),
    onSuccess: (data) => {
      if (!isServer) {
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        setAccessToken(data.access)
        setTimeout(() => navigate({ to: '/' }), 100)
      }
    },
  })

  const getErrorMessage = (): string | null => {
    if (!loginMutation.error) return null
    if (loginMutation.error instanceof Error) {
      return loginMutation.error.message
    }
    return 'Error al iniciar sesión'
  }

  return {
    isAuthenticated: isVerified === true,
    isLoading: !isMounted || isVerifying,
    isPending: loginMutation.isPending,
    error: getErrorMessage(),
    login: loginMutation.mutate,
    logout: () => {
      clearAuthStorage()
      setAccessToken(null)
      navigate({ to: '/login' })
    },
  }
}
