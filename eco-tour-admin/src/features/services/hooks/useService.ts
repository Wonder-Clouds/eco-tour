import { useQuery } from '@tanstack/react-query'
import { getServiceById } from '../api/servicesApi'

interface UseServiceOptions {
  enabled?: boolean
}

export const useService = (id: string, options: UseServiceOptions = {}) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceById(id),
    enabled: options.enabled !== undefined ? options.enabled : !!id,
    staleTime: 5 * 60 * 1000,
  })
}
