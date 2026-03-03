import { useQuery } from '@tanstack/react-query'
import { getGroups, getGroupById, GroupFilters } from '../api/groupsApi'

export const useGroups = (filters?: GroupFilters) => {
  return useQuery({
    queryKey: ['groups', filters],
    queryFn: () => getGroups(filters),
  })
}

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroupById(id),
    enabled: !!id,
  })
}

