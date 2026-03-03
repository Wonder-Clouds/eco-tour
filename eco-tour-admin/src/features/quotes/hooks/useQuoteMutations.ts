import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AllInOneQuote,
  createVersion,
  updateQuote,
  deleteQuote,
  updateQuoteStatus,
  createServiceQuotePerson,
  updateServiceQuotePerson,
  deleteServiceQuotePerson,
  createPerson,
  updatePerson,
  updateGroup,
  addPersonToGroup,
  removePersonFromGroup,
  toggleQuotePublic,
  ServiceQuotePersonData,
  UpdateGroupData,
  CreatePersonData,
} from '../api/quotesApi'
import {
  BulkCreateQuoteData,
  CreateVersionData,
  Quote,
} from '@/types/quote.type'

export const useBulkCreateQuote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkCreateQuoteData) => AllInOneQuote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
}

export const useCreateVersion = (quoteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVersionData) => createVersion(quoteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['quote', quoteId] })
    },
  })
}

export const useUpdateQuote = (quoteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Quote>) => updateQuote(quoteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['quote', quoteId] })
    },
  })
}

export const useDeleteQuote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteQuote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
    },
  })
}

export const useUpdateQuoteStatus = (quoteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: string) => updateQuoteStatus(quoteId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['quote', quoteId] })
    },
  })
}

// ==================== SERVICE QUOTE PERSON ====================

export const useCreateServiceQuotePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ServiceQuotePersonData) => createServiceQuotePerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })
}

export const useUpdateServiceQuotePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, string | undefined> }) =>
      updateServiceQuotePerson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })
}

export const useDeleteServiceQuotePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteServiceQuotePerson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })
}

// ==================== PERSON ====================

export const useCreatePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePersonData) => createPerson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] })
    },
  })
}

export const useUpdatePerson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, string | boolean | undefined> }) =>
      updatePerson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['persons'] })
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })
}

// ==================== GROUP ====================

export const useUpdateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupData }) => updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['quote'] })
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
      queryClient.invalidateQueries({ queryKey: ['quote'] })
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
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })
}

// ==================== PUBLIC QUOTE ====================

export const useToggleQuotePublic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (quoteId: string) => toggleQuotePublic(quoteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] })
      queryClient.invalidateQueries({ queryKey: ['quote'] })
    },
  })
}

