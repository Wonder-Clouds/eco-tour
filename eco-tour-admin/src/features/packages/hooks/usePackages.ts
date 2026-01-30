import { useQuery } from '@tanstack/react-query'
import { getPackages, PackageFilters } from '../api/packagesApi'

export const usePackages = (filters?: PackageFilters) => {
  return useQuery({
    queryKey: ['packages', filters],
    queryFn: () => getPackages(filters),
    staleTime: 5 * 60 * 1000,
  })
}
