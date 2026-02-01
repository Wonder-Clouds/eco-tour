import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePerson, UpdatePersonData } from '../api/personsApi'

export const useUpdatePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePersonData }) => updatePerson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] })
      queryClient.invalidateQueries({ queryKey: ['persons-summary'] })
      queryClient.invalidateQueries({ queryKey: ['person'] })
    },
  })
}
