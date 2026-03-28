import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createGroup,
  updateGroup,
  deleteGroup,
  addPersonToGroup,
  removePersonFromGroup,
  CreateGroupData,
  UpdateGroupData,
} from '../api/groupsApi'

export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateGroupData) => createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export const useUpdateGroup = (groupId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateGroupData) => updateGroup(groupId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['group', groupId] })
    },
  })
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export const useAddPersonToGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, personId }: { groupId: string; personId: string }) =>
      addPersonToGroup(groupId, personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['group'] })
    },
  })
}

export const useRemovePersonFromGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, personId }: { groupId: string; personId: string }) =>
      removePersonFromGroup(groupId, personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['group'] })
    },
  })
}

