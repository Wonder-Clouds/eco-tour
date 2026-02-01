import { useQuery } from '@tanstack/react-query'
import { getPersonsSummary, PersonFilters } from '../api/personsApi'

export const usePersonsSummary = (filters?: PersonFilters) => {
  return useQuery({
    queryKey: ['persons-summary', filters],
    queryFn: () => getPersonsSummary(filters),
    staleTime: 5 * 60 * 1000,
  })
}
