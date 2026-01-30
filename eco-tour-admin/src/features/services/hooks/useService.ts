import { useQuery } from '@tanstack/react-query'
import { getServiceById } from '../api/servicesApi'

export const useService = (id: string) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}
