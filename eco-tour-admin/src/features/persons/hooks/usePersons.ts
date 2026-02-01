import { useQuery } from '@tanstack/react-query'
import { getPersons, PersonFilters } from '../api/personsApi'

export const usePersons = (filters?: PersonFilters) => {
  return useQuery({
    queryKey: ['persons', filters],
    queryFn: () => getPersons(filters),
    staleTime: 5 * 60 * 1000,
  })
}
