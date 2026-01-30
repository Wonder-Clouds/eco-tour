import { Media } from './media.type'

// Servicio simplificado dentro de un paquete
export interface PackageServiceItem {
  id: string
  title: string
  duration_in_hours: number
  duration_value: number
  duration_unit: string
  price: number
}

export interface PackageService {
  id: string
  service: PackageServiceItem
  order: number
}

export interface Package {
  id: string
  title: string
  description: string
  price: number
  total_duration: string
  total_duration_hours: number
  package_services: PackageService[]
  media?: Media[]
  created_at?: string
  updated_at?: string
}

export interface PackageSummary {
  id: string
  title: string
  description: string
  price: number
  total_duration: string
  services_count: number
}

export interface CreatePackageServiceInput {
  service_id: string
  order: number
}

export interface CreatePackageInput {
  title: string
  description: string
  services: CreatePackageServiceInput[]
}

export interface UpdatePackageInput {
  title?: string
  description?: string
  services?: CreatePackageServiceInput[]
}

