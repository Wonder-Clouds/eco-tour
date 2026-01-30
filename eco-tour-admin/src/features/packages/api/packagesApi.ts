import api from '@/config/axios'
import {
  Package,
  PackageSummary,
  CreatePackageInput,
  UpdatePackageInput,
  CreatePackageServiceInput
} from '@/types/package.type'
import { PaginatedResponse } from '@/types/response.type'

// ==================== FILTERS ====================

export interface PackageFilters {
  search?: string
  price_min?: number
  price_max?: number
  total_duration_hours_min?: number
  total_duration_hours_max?: number
}

// ==================== GET ====================

export const getPackages = async (filters?: PackageFilters): Promise<PackageSummary[]> => {
  const params = new URLSearchParams()

  if (filters) {
    if (filters.search) params.append('search', filters.search)
    if (filters.price_min !== undefined) params.append('price_min', filters.price_min.toString())
    if (filters.price_max !== undefined) params.append('price_max', filters.price_max.toString())
    if (filters.total_duration_hours_min !== undefined) params.append('total_duration_hours_min', filters.total_duration_hours_min.toString())
    if (filters.total_duration_hours_max !== undefined) params.append('total_duration_hours_max', filters.total_duration_hours_max.toString())
  }

  const queryString = params.toString()
  const url = queryString ? `/package/summary/?${queryString}` : '/package/summary/'

  const response = await api.get<PaginatedResponse<PackageSummary>>(url)
  return response.data.results
}

export const getPackageById = async (id: string): Promise<Package> => {
  const response = await api.get<Package>(`/package/${id}/`)
  return response.data
}

// ==================== CREATE ====================

export const createPackage = async (data: CreatePackageInput): Promise<Package> => {
  const response = await api.post<Package>('/package/', data)
  return response.data
}

// ==================== UPDATE ====================

export const updatePackage = async (id: string, data: UpdatePackageInput): Promise<Package> => {
  const response = await api.patch<Package>(`/package/${id}/`, data)
  return response.data
}

// ==================== DELETE ====================

export const deletePackage = async (id: string): Promise<void> => {
  await api.delete(`/package/${id}/`)
}

// ==================== SERVICES ACTIONS ====================

export const addServiceToPackage = async (
  packageId: string,
  data: CreatePackageServiceInput
): Promise<Package> => {
  const response = await api.post<Package>(`/package/${packageId}/add-service/`, data)
  return response.data
}

export const removeServiceFromPackage = async (
  packageId: string,
  serviceId: string
): Promise<void> => {
  await api.delete(`/package/${packageId}/remove-service/${serviceId}/`)
}

export const updateServicesOrder = async (
  packageId: string,
  services: CreatePackageServiceInput[]
): Promise<Package> => {
  const response = await api.patch<Package>(`/package/${packageId}/update-order/`, { services })
  return response.data
}

// ==================== DURATION ====================

export interface PackageDuration {
  total_duration_hours: number
  total_duration_formatted: string
}

export const getPackageDuration = async (id: string): Promise<PackageDuration> => {
  const response = await api.get<PackageDuration>(`/package/${id}/duration/`)
  return response.data
}
