// src/features/services/hooks/useServices.ts
import { useQuery } from '@tanstack/react-query'
import { getServices, ServiceFilters } from '../api/servicesApi'

export const useServices = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters),
    staleTime: 5 * 60 * 1000,
  })
}
