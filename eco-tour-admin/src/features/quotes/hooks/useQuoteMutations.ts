import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  bulkCreateQuote,
  createVersion,
  editVersion,
  updateQuote,
  deleteQuote,
  updateQuoteStatus,
} from '../api/quotesApi'
import {
  BulkCreateQuoteData,
  CreateVersionData,
  EditVersionData,
  Quote,
} from '@/types/quote.type'

export const useBulkCreateQuote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkCreateQuoteData) => bulkCreateQuote(data),
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

export const useEditVersion = (quoteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: EditVersionData) => editVersion(quoteId, data),
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

