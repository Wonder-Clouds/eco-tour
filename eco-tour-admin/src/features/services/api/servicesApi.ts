import api from '@/config/axios'
import { Service, SummaryService, DurationUnit, TypeService } from '@/types/service.type'
import { PaginatedResponse } from '@/types/response.type'
import { Itinerary } from '@/types/itinerary.type'
import { Data } from '@/types/data.type'
import { Media } from '@/types/media.type'

export const getServices = async (): Promise<SummaryService[]> => {
  const response = await api.get<PaginatedResponse<SummaryService>>('/service/summary/')
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
  price: string
  duration_value: number
  duration_unit: DurationUnit
  data: { title: string; description: string }[]
  itinerary: { title: string; description: string }[]
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
  formData.append('price', data.price)
  formData.append('duration_value', data.duration_value.toString())
  formData.append('duration_unit', data.duration_unit)
  formData.append('data', JSON.stringify(data.data))
  formData.append('itinerary', JSON.stringify(data.itinerary))

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
  price?: string
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

