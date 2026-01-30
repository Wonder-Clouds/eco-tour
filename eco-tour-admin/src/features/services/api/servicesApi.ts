import api from '@/config/axios'
import { Service, SummaryService } from '@/types/service.type'
import { PaginatedResponse } from '@/types/response.type'

export const getServices = async (): Promise<SummaryService[]> => {
  const response = await api.get<PaginatedResponse<SummaryService>>('/service/summary/')
  return response.data.results
}

export const getServiceById = async (id: string): Promise<Service> => {
  const response = await api.get<Service>(`/service/${id}`)
  return response.data
}

