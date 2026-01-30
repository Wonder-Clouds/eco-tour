import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query' // ← Agrega useQueryClient
import {
  loginUser,
  verifyToken,
  refreshTokenApi,
} from '@/features/auth/api/authApi'
import { Auth } from '@/types/auth.type'
import { clearAuthStorage } from '@/config/axios'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('accessToken')
    setAccessToken(token)
  }, [])

  const { data: isVerified, isLoading: isVerifying } = useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: async () => {
      if (!accessToken) return false
      try {
        await verifyToken(accessToken)
        return true
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } }
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
    enabled: !!accessToken && isMounted,
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: Auth) => loginUser(credentials),
  })

  const getErrorMessage = (): string | null => {
    if (!loginMutation.error) return null
    if (loginMutation.error instanceof Error) {
      return loginMutation.error.message
    }
    return 'Error al iniciar sesión'
  }

  const handleLogin = async (
    credentials: Auth,
    callbacks?: {
      onSuccess?: () => void
      onError?: (error: any) => void
    },
  ) => {
    try {
      const data = await loginMutation.mutateAsync(credentials)

      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      setAccessToken(data.access)

      queryClient.setQueryData(['auth', 'verify'], true)

      callbacks?.onSuccess?.()
    } catch (error) {
      callbacks?.onError?.(error)
    }
  }

  return {
    isAuthenticated: isVerified === true,
    isLoading: !isMounted || isVerifying,
    isPending: loginMutation.isPending,
    error: getErrorMessage(),
    login: handleLogin,
    logout: () => {
      clearAuthStorage()
      setAccessToken(null)
      navigate({ to: '/login' })
    },
  }
}
