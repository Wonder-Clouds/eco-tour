import api from '@/config/axios'
import { PaginatedResponse } from '@/types/response.type'
import {
  Quote,
  QuoteSummary,
  QuoteFullDetail,
  QuoteFilters,
  BulkCreateQuoteData,
  CreateVersionData,
  EditVersionData,
} from '@/types/quote.type'

// ==================== GET ====================

export const getQuotes = async (filters?: QuoteFilters): Promise<QuoteSummary[]> => {
  const params = new URLSearchParams()
  params.append('limit', '1000')

  if (filters) {
    if (filters.search) params.append('search', filters.search)
    if (filters.status) params.append('status', filters.status)
    if (filters.contact_info) params.append('contact_info', filters.contact_info)
    if (filters.date_from) params.append('date_from', filters.date_from)
    if (filters.date_to) params.append('date_to', filters.date_to)
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString())
  }

  const queryString = params.toString()
  const url = `/quote/?${queryString}`

  const response = await api.get<PaginatedResponse<QuoteSummary>>(url)
  return response.data.results
}

export const getQuoteById = async (id: string): Promise<Quote> => {
  const response = await api.get<Quote>(`/quote/${id}/`)
  return response.data
}

export const getQuoteFullDetail = async (id: string): Promise<QuoteFullDetail> => {
  const response = await api.get<QuoteFullDetail>(`/quote/${id}/full-detail/`)
  return response.data
}

// ==================== CREATE ====================

export const bulkCreateQuote = async (data: BulkCreateQuoteData): Promise<Quote> => {
  const response = await api.post<Quote>('/quote/bulk-create-quote/', data)
  return response.data
}

// ==================== VERSION MANAGEMENT ====================

export const createVersion = async (id: string, data: CreateVersionData): Promise<Quote> => {
  const response = await api.post<Quote>(`/quote/${id}/create-version/`, data)
  return response.data
}

export const editVersion = async (id: string, data: EditVersionData): Promise<Quote> => {
  const response = await api.patch<Quote>(`/quote/${id}/edit-version/`, data)
  return response.data
}

// ==================== UPDATE ====================

export const updateQuote = async (id: string, data: Partial<Quote>): Promise<Quote> => {
  const response = await api.patch<Quote>(`/quote/${id}/`, data)
  return response.data
}

// ==================== DELETE ====================

export const deleteQuote = async (id: string): Promise<void> => {
  await api.delete(`/quote/${id}/`)
}

// ==================== STATUS ====================

export const updateQuoteStatus = async (id: string, status: string): Promise<Quote> => {
  const response = await api.patch<Quote>(`/quote/${id}/`, { status })
  return response.data
}

