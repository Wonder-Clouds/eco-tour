// src/features/services/hooks/useServices.ts
import { useQuery } from '@tanstack/react-query'
import { getServices, getServicesFull, ServiceFilters } from '../api/servicesApi'

export const useServices = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters),
    staleTime: 5 * 60 * 1000,
  })
}

// Hook for full services with departure_time
export const useServicesFull = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: ['services-full', filters],
    queryFn: () => getServicesFull(filters),
    staleTime: 5 * 60 * 1000,
  })
}

