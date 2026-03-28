import api from '@/config/axios'
import { PaginatedResponse } from '@/types/response.type'
import { Group } from '@/types/group.type'


// ==================== TYPES ====================

export interface GroupFilters {
  search?: string
}

export interface CreateGroupData {
  description?: string
  contact_info?: string
}

export interface UpdateGroupData {
  description?: string
  contact_info?: string
}

export interface GroupSummary {
  id: string
  name: string
  contact_info: string
  total_people: number
  description?: string
}

// ==================== GET ====================

export const getGroups = async (filters?: GroupFilters): Promise<Group[]> => {
  const params = new URLSearchParams()
  params.append('limit', '1000')

  if (filters?.search) {
    params.append('search', filters.search)
  }

  const queryString = params.toString()
  const url = `/group/?${queryString}`

  const response = await api.get<PaginatedResponse<Group>>(url)
  return response.data.results
}

export const getGroupById = async (id: string): Promise<Group> => {
  const response = await api.get<Group>(`/group/${id}/`)
  return response.data
}

// ==================== CREATE ====================

export const createGroup = async (data: CreateGroupData): Promise<Group> => {
  const response = await api.post<Group>('/group/', data)
  return response.data
}

// ==================== UPDATE ====================

export const updateGroup = async (id: string, data: UpdateGroupData): Promise<Group> => {
  const response = await api.patch<Group>(`/group/${id}/`, data)
  return response.data
}

// ==================== DELETE ====================

export const deleteGroup = async (id: string): Promise<void> => {
  await api.delete(`/group/${id}/`)
}

// ==================== ACTIONS ====================

export const addPersonToGroup = async (groupId: string, personId: string): Promise<{ message: string; group: Group }> => {
  const response = await api.post<{ message: string; group: Group }>(`/group/${groupId}/add-person/`, {
    person_id: personId,
  })
  return response.data
}

export const removePersonFromGroup = async (groupId: string, personId: string): Promise<{ message: string; group: Group }> => {
  const response = await api.post<{ message: string; group: Group }>(`/group/${groupId}/remove-person/`, {
    person_id: personId,
  })
  return response.data
}

