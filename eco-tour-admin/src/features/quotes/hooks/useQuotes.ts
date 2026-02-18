import { useQuery } from '@tanstack/react-query'
import { getQuotes, getQuoteById, getQuoteFullDetail } from '../api/quotesApi'
import { QuoteFilters } from '@/types/quote.type'

export const useQuotes = (filters?: QuoteFilters) => {
  return useQuery({
    queryKey: ['quotes', filters],
    queryFn: () => getQuotes(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useQuote = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['quote', id],
    queryFn: () => getQuoteById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useQuoteFullDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['quote', id, 'full-detail'],
    queryFn: () => getQuoteFullDetail(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  })
}

