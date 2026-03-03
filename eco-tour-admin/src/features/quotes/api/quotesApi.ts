import api from '@/config/axios'
import { PaginatedResponse } from '@/types/response.type'
import {
  Quote,
  QuoteSummary,
  QuoteFullDetail,
  QuoteFilters,
  BulkCreateQuoteData,
  CreateVersionData,
} from '@/types/quote.type'
import { Person } from '@/types/person.type'
import { Group } from '@/types/group.type'

// ==================== GET ====================

// Raw API response type
interface QuoteApiResponse {
  id: string
  contact_info: string
  version: number
  total_price: string
  status: string
  is_active: boolean
  valid_until?: string
  created_at: string
  is_public?: boolean
  detail_quote_by_person?: {
    person_id: string
    person_name: string
    total: number
    services: {
      service_id: string
      service_type: string
      service_name: string
      cost: number
      departure: string
    }[]
  }[]
}

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

  const response = await api.get<PaginatedResponse<QuoteApiResponse>>(url)

  // Transform API response to QuoteSummary
  return response.data.results.map((quote) => {
    // Calculate total persons from detail_quote_by_person
    const totalPersons = quote.detail_quote_by_person?.length || 0

    // Calculate total services (unique service_ids across all persons)
    const serviceIds = new Set<string>()
    quote.detail_quote_by_person?.forEach(person => {
      person.services?.forEach(service => {
        serviceIds.add(service.service_id)
      })
    })
    const totalServices = serviceIds.size

    return {
      id: quote.id,
      contact_info: quote.contact_info,
      version: quote.version,
      total_price: quote.total_price,
      status: quote.status as QuoteSummary['status'],
      is_active: quote.is_active,
      total_persons: totalPersons,
      total_services: totalServices,
      valid_until: quote.valid_until,
      created_at: quote.created_at,
    }
  })
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

export const AllInOneQuote = async (data: BulkCreateQuoteData): Promise<Quote> => {
  const response = await api.post<Quote>('/quote/all-in-one-quote/', data)
  return response.data
}

// ==================== VERSION MANAGEMENT ====================

export const createVersion = async (id: string, data: CreateVersionData): Promise<Quote> => {
  const response = await api.post<Quote>(`/quote/${id}/create-version/`, data)
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

// ==================== SERVICE QUOTE PERSON ====================

export interface ServiceQuotePersonData {
  person_id: string
  service_id: string
  quote_id: string
  departure_date: string
  departure_time?: string
  arrive_date?: string
  arrive_time?: string
  notes?: string
}

export const createServiceQuotePerson = async (data: ServiceQuotePersonData): Promise<unknown> => {
  const response = await api.post('/service-quote-person/', data)
  return response.data
}

export const updateServiceQuotePerson = async (id: string, data: Record<string, string | undefined>): Promise<unknown> => {
  const response = await api.patch(`/service-quote-person/${id}/`, data)
  return response.data
}

export const deleteServiceQuotePerson = async (id: string): Promise<void> => {
  await api.delete(`/service-quote-person/${id}/`)
}

// ==================== PERSON ====================

export interface CreatePersonData {
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  passport_number?: string
  birth_date?: string
  nationality?: string
}

export const createPerson = async (data: CreatePersonData): Promise<Person> => {
  const response = await api.post<Person>('/person/', data)
  return response.data
}

export const updatePerson = async (id: string, data: Record<string, string | boolean | undefined>): Promise<Person> => {
  const response = await api.patch<Person>(`/person/${id}/`, data)
  return response.data
}

// ==================== GROUP ====================

export interface UpdateGroupData {
  description?: string
  contact_info?: string
}

export const updateGroup = async (id: string, data: UpdateGroupData): Promise<Group> => {
  const response = await api.patch<Group>(`/group/${id}/`, data)
  return response.data
}

export const addPersonToGroup = async (groupId: string, personId: string): Promise<unknown> => {
  const response = await api.post(`/group/${groupId}/add-person/`, { person_id: personId })
  return response.data
}

export const removePersonFromGroup = async (groupId: string, personId: string): Promise<unknown> => {
  const response = await api.post(`/group/${groupId}/remove-person/`, { person_id: personId })
  return response.data
}

// ==================== PUBLIC QUOTE ====================

export interface TogglePublicResponse {
  quote_id: string
  is_public: boolean
  message: string
  public_url: string
}

export const toggleQuotePublic = async (id: string): Promise<TogglePublicResponse> => {
  const response = await api.post<TogglePublicResponse>(`/quote/${id}/toggle-public/`)
  return response.data
}

export const getQuotePublic = async (id: string): Promise<QuoteFullDetail> => {
  // Use raw axios without auth interceptor for public endpoint
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  const response = await fetch(`${baseURL}/quote/public/${id}/`)
  if (!response.ok) {
    throw new Error('Quote not found or not public')
  }
  return response.json()
}

