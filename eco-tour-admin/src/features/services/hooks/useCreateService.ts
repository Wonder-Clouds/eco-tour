import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createService, CreateServiceData } from '../api/servicesApi'

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateServiceData) => createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
