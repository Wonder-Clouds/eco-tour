// src/features/services/hooks/useServices.ts
import { useQuery } from '@tanstack/react-query'
import { getServices } from '../api/servicesApi'

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => getServices(),
    staleTime: 5 * 60 * 1000,
  })
}
