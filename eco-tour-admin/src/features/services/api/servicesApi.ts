import api from '@/config/axios'
import { Service } from '@/types/service.type'
import { PaginatedResponse } from '@/types/response.type'

export const getServices = async (): Promise<Service[]> => {
  const response = await api.get<PaginatedResponse<Service>>('/service/')
  return response.data.results
}
