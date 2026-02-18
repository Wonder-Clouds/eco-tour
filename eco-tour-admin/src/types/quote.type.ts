import { Media } from './media.type'

export type QuoteStatus = 'draft' | 'pending' | 'approved' | 'rejected'

// ==================== QUOTE BÁSICO ====================
export interface Quote {
  id: string
  group: string
  version: number
  notes?: string
  contact_info: string
  total_price: string
  valid_until?: string
  status: QuoteStatus
  is_active: boolean
  created_at: string
  updated_at: string
}

// ==================== QUOTE SUMMARY (Lista) ====================
export interface QuoteSummary {
  id: string
  contact_info: string
  version: number
  total_price: string
  status: QuoteStatus
  is_active: boolean
  total_persons: number
  total_services: number
  valid_until?: string
  created_at: string
}

// ==================== FULL DETAIL TYPES ====================

// Versión de quote
export interface QuoteVersion {
  id: string
  version: string
  total_price: string
  status: QuoteStatus
  created_at: string
}

// Servicio asignado a una persona
export interface PersonServiceAssignment {
  service_quote_person_id: string
  service_id: string
  service_name: string
  service_type: string
  individual_cost: number
  departure_date: string
  departure_time?: string
  arrive_date?: string
  arrive_time?: string
  notes?: string
}

// Detalle de persona con sus servicios
export interface PersonDetail {
  id: string
  full_name: string
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  passport_number?: string
  birth_date?: string
  nationality?: string
  is_generic: boolean
  total_cost: number
  services_count: number
  services: PersonServiceAssignment[]
  media: Media[]
}

// Persona asignada a un servicio
export interface ServicePersonAssignment {
  service_quote_person_id: string
  person_id: string
  person_name: string
  individual_cost: number
  departure_date: string
  departure_time?: string
  arrive_date?: string
  arrive_time?: string
  notes?: string
}

// Regla de precio
export interface PricingRule {
  id: string
  concept: string
  amount: number
  calculation_type: 'multiply' | 'divide'
}

// Tier de precio
export interface PricingTier {
  id: string
  min_people: number
  max_people: number
  total_price: number
}

// Info de pricing
export interface PricingInfo {
  type: string
  reference_price?: number
  rules?: PricingRule[]
  tiers?: PricingTier[]
}

// Itinerario
export interface ServiceItinerary {
  id: string
  title: string
  description: string
}

// Tag
export interface ServiceTag {
  id: string
  name: string
}

// Detalle de servicio
export interface ServiceDetail {
  id: string
  title: string
  type: string
  duration_value: number
  duration_unit: string
  summary: string
  includes: string
  excludes: string
  departure_time?: string
  reference_price: number
  pricing_info: PricingInfo
  persons_in_service: ServicePersonAssignment[]
  total_cost_for_service: number
  itineraries: ServiceItinerary[]
  media: Media[]
  tags: ServiceTag[]
}

// Item del cronograma
export interface ItineraryScheduleItem {
  service_quote_person_id: string
  departure_date: string
  departure_time?: string
  arrive_date?: string
  arrive_time?: string
  service: {
    id: string
    title: string
    type: string
    duration_value: number
    duration_unit: string
  }
  person: {
    id: string
    full_name: string
  }
  cost: number
  notes?: string
  itinerary_details: ServiceItinerary[]
}

// Resumen de costos por tipo de servicio
export interface CostByServiceType {
  count: number
  total: number
}

// Resumen de costos por persona
export interface CostByPerson {
  person_id: string
  person_name: string
  total: number
  services_count: number
}

// Resumen de costos por servicio
export interface CostByService {
  service_id: string
  service_name: string
  service_type: string
  total: number
  persons_count: number
}

// Resumen de costos
export interface CostSummary {
  total_price: number
  total_services: number
  total_persons: number
  by_service_type: {
    group?: CostByServiceType
    private?: CostByServiceType
    arbitrary?: CostByServiceType
  }
  by_person: CostByPerson[]
  by_service: CostByService[]
}

// Media de servicios
export interface ServiceMedia extends Media {
  service_id: string
  service_title: string
}

// Media files
export interface MediaFiles {
  services_media: ServiceMedia[]
  persons_media: Media[]
}

// Group info
export interface GroupInfo {
  id: string
  name: string
  description?: string
  contact_info: string
  total_people: number
  created_at: string
}

// Quote Full Detail (respuesta del endpoint full-detail)
export interface QuoteFullDetail {
  id: string
  status: QuoteStatus
  version: number
  version_display: string
  contact_info: string
  valid_until?: string
  total_price: string
  notes?: string
  created_at: string
  updated_at: string
  parent_quote?: string
  all_versions: QuoteVersion[]
  group_info: GroupInfo
  persons_detail: PersonDetail[]
  services_detail: ServiceDetail[]
  itinerary_schedule: ItineraryScheduleItem[]
  media_files: MediaFiles
  cost_summary: CostSummary
}

// ==================== CREATE/UPDATE TYPES ====================

// Servicio para bulk create
export interface BulkServiceInput {
  service_id: string
  person_temp_id?: string  // Para nuevas personas
  person_id?: string       // Para personas existentes
  departure_date: string
  departure_time?: string
  notes?: string
}

// Datos para crear quote bulk
export interface BulkCreateQuoteData {
  contact_info: string
  notes?: string
  valid_until?: string
  services: BulkServiceInput[]
}

// Nueva persona con servicios
export interface NewPersonWithServices {
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  passport_number?: string
  birth_date?: string
  nationality?: string
  services: {
    service_id: string
    departure_date: string
    departure_time?: string
    notes?: string
  }[]
}

// Actualizar service person existente
export interface UpdateServicePersonInput {
  id: string
  departure_date?: string
  departure_time?: string
  notes?: string
}

// Datos para create-version
export interface CreateVersionData {
  services?: BulkServiceInput[]
  add_services?: BulkServiceInput[]
  remove_service_persons?: string[]
  update_service_persons?: UpdateServicePersonInput[]
  add_persons?: NewPersonWithServices[]
  notes?: string
  contact_info?: string
  valid_until?: string
  status?: QuoteStatus
}

// Datos para edit-version
export interface EditVersionData {
  services?: BulkServiceInput[]
  remove_service_persons?: string[]
  update_service_persons?: UpdateServicePersonInput[]
  add_persons?: NewPersonWithServices[]
  notes?: string
  contact_info?: string
  valid_until?: string
  status?: QuoteStatus
}

// ==================== FILTERS ====================
export interface QuoteFilters {
  search?: string
  status?: QuoteStatus
  contact_info?: string
  date_from?: string
  date_to?: string
  is_active?: boolean
}
