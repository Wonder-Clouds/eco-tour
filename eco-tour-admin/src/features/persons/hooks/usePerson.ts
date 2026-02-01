import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { getPersonById } from '../api/personsApi'
import { Person } from '@/types/person.type'

export const usePerson = (
  id: string,
  options?: Omit<UseQueryOptions<Person, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['person', id],
    queryFn: () => getPersonById(id),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
