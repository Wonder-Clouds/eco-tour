import api from '@/config/axios'
import { Person } from '@/types/person.type'
import { PaginatedResponse } from '@/types/response.type'

// ==================== TYPES ====================

export interface Country {
  value: string
  label: string
}

export interface SummaryPerson {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  nationality: string
  created_at: string
  updated_at: string
}

export interface PersonFilters {
  q?: string
  nationality?: string
}

export interface CreatePersonData {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  passport_number: string
  birth_date: string
  nationality: string
}

export interface UpdatePersonData {
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  passport_number?: string
  birth_date?: string
  nationality?: string
  is_generic?: boolean
}

// ==================== GET ====================

export const getPersonsSummary = async (filters?: PersonFilters): Promise<SummaryPerson[]> => {
  const params = new URLSearchParams()
  params.append('limit', '1000')

  if (filters) {
    if (filters.q) params.append('q', filters.q)
    if (filters.nationality) params.append('nationality', filters.nationality)
  }

  const queryString = params.toString()
  const url = `/person/summary/?${queryString}`

  const response = await api.get<PaginatedResponse<SummaryPerson>>(url)
  return response.data.results
}

export const getPersons = async (filters?: PersonFilters): Promise<Person[]> => {
  const params = new URLSearchParams()
  params.append('limit', '1000')

  if (filters) {
    if (filters.q) params.append('q', filters.q)
    if (filters.nationality) params.append('nationality', filters.nationality)
  }

  const queryString = params.toString()
  const url = `/person/?${queryString}`

  const response = await api.get<PaginatedResponse<Person>>(url)
  return response.data.results
}

export const getPersonById = async (id: string): Promise<Person> => {
  const response = await api.get<Person>(`/person/${id}`)
  return response.data
}

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get<Country[]>('/countries/')
  return response.data
}

// ==================== CREATE ====================

export const createPerson = async (data: CreatePersonData): Promise<Person> => {
  const response = await api.post<Person>('/person/', data)
  return response.data
}

// ==================== UPDATE ====================

export const updatePerson = async (id: string, data: UpdatePersonData): Promise<Person> => {
  const response = await api.patch<Person>(`/person/${id}/`, data)
  return response.data
}

// ==================== DELETE ====================

export const deletePerson = async (id: string): Promise<void> => {
  await api.delete(`/person/${id}/`)
}

// ==================== MEDIA UPLOAD ====================

export interface UploadMediaData {
  title: string
  description: string
  file: File
}

export interface UpdateMediaData {
  title?: string
  description?: string
}

export const uploadPersonDocument = async (personId: string, data: UploadMediaData): Promise<void> => {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('file', data.file)

  await api.post(`/person/${personId}/upload-document/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const uploadPersonImage = async (personId: string, data: UploadMediaData): Promise<void> => {
  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('file', data.file)

  await api.post(`/person/${personId}/upload-media/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// ==================== MEDIA MANAGEMENT ====================

export const deleteMedia = async (mediaId: string): Promise<void> => {
  await api.delete(`/media/${mediaId}/`)
}

export const updateMedia = async (mediaId: string, data: UpdateMediaData): Promise<void> => {
  await api.patch(`/media/${mediaId}/`, data)
}
