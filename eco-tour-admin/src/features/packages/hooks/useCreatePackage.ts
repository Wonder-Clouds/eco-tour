import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreatePackageInput } from '@/types/package.type'
import { createPackage } from '../api/packagesApi'

export const useCreatePackage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePackageInput) => createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
  })
}
