import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTags, createTag, updateTag, deleteTag } from '../api/servicesApi'

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })
}

export function useTagMutations() {
  const queryClient = useQueryClient()

  const invalidateTags = () => {
    queryClient.invalidateQueries({ queryKey: ['tags'] })
    queryClient.invalidateQueries({ queryKey: ['services'] })
  }

  const createTagMutation = useMutation({
    mutationFn: (name: string) => createTag(name),
    onSuccess: invalidateTags,
  })

  const updateTagMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateTag(id, name),
    onSuccess: invalidateTags,
  })

  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: invalidateTags,
  })

  return {
    createTag: createTagMutation,
    updateTag: updateTagMutation,
    deleteTag: deleteTagMutation,
  }
}
