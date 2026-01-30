import { useQuery } from '@tanstack/react-query'
import { getPackageById } from '../api/packagesApi'

interface UsePackageOptions {
  enabled?: boolean
}

export const usePackage = (id: string, options: UsePackageOptions = {}) => {
  return useQuery({
    queryKey: ['package', id],
    queryFn: () => getPackageById(id),
    enabled: options.enabled !== undefined ? options.enabled : !!id,
    staleTime: 5 * 60 * 1000,
  })
}
