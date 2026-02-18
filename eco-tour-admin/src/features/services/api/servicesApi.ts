import api from '@/config/axios'
import { Service, SummaryService, DurationUnit, TypeService } from '@/types/service.type'
import { PaginatedResponse } from '@/types/response.type'
import { Itinerary } from '@/types/itinerary.type'
import { Data } from '@/types/data.type'
import { Media } from '@/types/media.type'

// ==================== FILTERS ====================

export interface ServiceFilters {
  search?: string
  reference_price_min?: number
  reference_price_max?: number
  type?: TypeService
  duration_min?: number
  duration_max?: number
  tags?: string
}

export const getServices = async (filters?: ServiceFilters): Promise<SummaryService[]> => {
  const params = new URLSearchParams()

  // Obtener todos los resultados (limit alto para evitar paginación del servidor)
  params.append('limit', '1000')

  if (filters) {
    if (filters.search) params.append('search', filters.search)
    if (filters.reference_price_min !== undefined) params.append('reference_price_min', filters.reference_price_min.toString())
    if (filters.reference_price_max !== undefined) params.append('reference_price_max', filters.reference_price_max.toString())
    if (filters.type) params.append('type', filters.type)
    if (filters.duration_min !== undefined) params.append('duration_min', filters.duration_min.toString())
    if (filters.duration_max !== undefined) params.append('duration_max', filters.duration_max.toString())
    if (filters.tags) params.append('tags', filters.tags)
  }

  const queryString = params.toString()
  const url = `/service/summary/?${queryString}`

  const response = await api.get<PaginatedResponse<SummaryService>>(url)
  return response.data.results
}

export const getServiceById = async (id: string): Promise<Service> => {
  const response = await api.get<Service>(`/service/${id}`)
  return response.data
}

export interface CreateServiceData {
  title: string
  summary: string
  includes: string
  excludes: string
  type: TypeService
  reference_price: string
  departure_time?: string
  duration_value: number
  duration_unit: DurationUnit
  data: { title: string; description: string }[]
  itinerary: { title: string; description: string }[]
  price_rules?: { concept: string; amount: number; calculation_type: 'multiply' | 'divide' }[]
  pricing_tiers?: { min_people: number; max_people: number; total_price: number }[]
  tags?: string[]
  media: File[]
  cover: File | null
}

export const createService = async (data: CreateServiceData): Promise<Service> => {
  const formData = new FormData()

  formData.append('title', data.title)
  formData.append('summary', data.summary)
  formData.append('includes', data.includes)
  formData.append('excludes', data.excludes)
  formData.append('type', data.type)
  formData.append('reference_price', data.reference_price)
  if (data.departure_time) formData.append('departure_time', data.departure_time)
  formData.append('duration_value', data.duration_value.toString())
  formData.append('duration_unit', data.duration_unit)
  formData.append('data', JSON.stringify(data.data))
  formData.append('itinerary', JSON.stringify(data.itinerary))
  if (data.price_rules) formData.append('price_rules', JSON.stringify(data.price_rules))
  if (data.pricing_tiers) formData.append('pricing_tiers', JSON.stringify(data.pricing_tiers))
  if (data.tags) formData.append('tags', JSON.stringify(data.tags))

  data.media.forEach((file) => {
    formData.append('media', file)
  })

  if (data.cover) {
    formData.append('cover', data.cover)
  }

  const response = await api.post<Service>('/service/all-in-one-service/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

// ==================== UPDATE SERVICE ====================

export interface UpdateServiceBasicData {
  title?: string
  summary?: string
  includes?: string
  excludes?: string
  type?: TypeService
  reference_price?: string
  departure_time?: string
  duration_value?: number
  duration_unit?: DurationUnit
}

export const updateService = async (id: string, data: UpdateServiceBasicData): Promise<Service> => {
  const response = await api.patch<Service>(`/service/${id}/`, data)
  return response.data
}

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`/service/${id}/`)
}

// ==================== ITINERARY ====================

export interface ItineraryInput {
  title: string
  description: string
}

export const addItinerary = async (serviceId: string, data: ItineraryInput): Promise<Itinerary> => {
  const response = await api.post<Itinerary>(`/itinerary/${serviceId}/add-itinerary/`, data)
  return response.data
}

export const updateItinerary = async (id: string, data: Partial<ItineraryInput>): Promise<Itinerary> => {
  const response = await api.patch<Itinerary>(`/itinerary/${id}/`, data)
  return response.data
}

export const deleteItinerary = async (id: string): Promise<void> => {
  await api.delete(`/itinerary/${id}/`)
}

// ==================== DATA ====================

export interface DataInput {
  title: string
  description: string
}

export const addData = async (serviceId: string, data: DataInput): Promise<Data> => {
  const response = await api.post<Data>(`/data/${serviceId}/add-data/`, data)
  return response.data
}

export const updateData = async (id: string, data: Partial<DataInput>): Promise<Data> => {
  const response = await api.patch<Data>(`/data/${id}/`, data)
  return response.data
}

export const deleteData = async (id: string): Promise<void> => {
  await api.delete(`/data/${id}/`)
}

// ==================== MEDIA ====================

export interface UploadImageInput {
  title: string
  description?: string
  file: File
}

export const uploadImage = async (serviceId: string, data: UploadImageInput): Promise<Media> => {
  const formData = new FormData()
  formData.append('title', data.title)
  if (data.description) formData.append('description', data.description)
  formData.append('file', data.file)

  const response = await api.post<Media>(`/service/${serviceId}/upload-image/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const uploadCover = async (serviceId: string, data: UploadImageInput): Promise<Media> => {
  const formData = new FormData()
  formData.append('title', data.title)
  if (data.description) formData.append('description', data.description)
  formData.append('file', data.file)

  const response = await api.post<Media>(`/service/${serviceId}/upload-cover/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const setCover = async (serviceId: string, mediaId: string): Promise<void> => {
  await api.patch(`/service/${serviceId}/set-cover/${mediaId}/`)
}

export const deleteMedia = async (id: string): Promise<void> => {
  await api.delete(`/media/${id}/`)
}

export const updateMedia = async (id: string, data: { title?: string; description?: string }): Promise<Media> => {
  const response = await api.patch<Media>(`/media/${id}/`, data)
  return response.data
}

// ==================== TAGS ====================

import { Tag, PriceRule, PricingTier, CalculationType } from '@/types/service.type'

export const getTags = async (): Promise<Tag[]> => {
  const response = await api.get<{ results: Tag[] }>('/tag/')
  return response.data.results
}

export const createTag = async (name: string): Promise<Tag> => {
  const response = await api.post<Tag>('/tag/', { name })
  return response.data
}

export const updateTag = async (id: string, name: string): Promise<Tag> => {
  const response = await api.patch<Tag>(`/tag/${id}/`, { name })
  return response.data
}

export const deleteTag = async (id: string): Promise<void> => {
  await api.delete(`/tag/${id}/`)
}

export const addTagsToService = async (serviceId: string, tagIds: string[]): Promise<void> => {
  await api.post(`/service/${serviceId}/bulk-add-tags/`, { items: tagIds })
}

// ==================== PRICE RULES ====================

export interface PriceRuleInput {
  concept: string
  amount: number
  calculation_type: CalculationType
}

export const addPriceRule = async (serviceId: string, data: PriceRuleInput): Promise<PriceRule> => {
  const response = await api.post<PriceRule>(`/price-rule/${serviceId}/add-price-rule/`, data)
  return response.data
}

export const updatePriceRule = async (id: string, data: Partial<PriceRuleInput>): Promise<PriceRule> => {
  const response = await api.patch<PriceRule>(`/price-rule/${id}/`, data)
  return response.data
}

export const deletePriceRule = async (id: string): Promise<void> => {
  await api.delete(`/price-rule/${id}/`)
}

// ==================== PRICING TIERS ====================

export interface PricingTierInput {
  min_people: number
  max_people: number
  total_price: number
}

export const addPricingTier = async (serviceId: string, data: PricingTierInput): Promise<PricingTier> => {
  const response = await api.post<PricingTier>(`/pricing-tier/${serviceId}/add-pricing-tier/`, data)
  return response.data
}

export const updatePricingTier = async (id: string, data: Partial<PricingTierInput>): Promise<PricingTier> => {
  const response = await api.patch<PricingTier>(`/pricing-tier/${id}/`, data)
  return response.data
}

export const deletePricingTier = async (id: string): Promise<void> => {
  await api.delete(`/pricing-tier/${id}/`)
}
