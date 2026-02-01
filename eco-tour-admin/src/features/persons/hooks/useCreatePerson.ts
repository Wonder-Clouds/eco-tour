import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPerson, CreatePersonData } from '../api/personsApi'

export const useCreatePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePersonData) => createPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] })
      queryClient.invalidateQueries({ queryKey: ['persons-summary'] })
    },
  })
}
