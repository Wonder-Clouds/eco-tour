import { Data } from './data.type'
import { Itinerary } from './itinerary.type'
import { Media } from './media.type'

export type DurationUnit = 'hours' | 'days' | 'weeks' | 'months'

export type TypeService = 'group' | 'arbitrary' | 'private'

export type CalculationType = 'multiply' | 'divide'

export interface Tag {
  id: string
  name: string
  created_at?: string
  updated_at?: string
}

export interface PriceRule {
  id: string
  service: string
  concept: string
  amount: string
  calculation_type: CalculationType
  created_at?: string
  updated_at?: string
}

export interface PricingTier {
  id: string
  service: string
  min_people: number
  max_people: number
  total_price: string
  created_at?: string
  updated_at?: string
}

export interface Service {
  id: string
  title: string
  duration_value: number
  duration_unit: DurationUnit
  duration_in_hours: number
  summary: string
  includes: string
  excludes: string
  type: TypeService
  itinerary?: Itinerary[]
  data?: Data[]
  departure_time?: string
  reference_price: string
  price_rules?: PriceRule[]
  pricing_tiers?: PricingTier[]
  tags?: Tag[]
  media?: Media[]
  created_at?: string
  updated_at?: string
}

export interface SummaryService {
  id: string
  title: string
  type: TypeService
  departure_time?: string
  reference_price?: string
  cover?: string
  duration: string
  tags?: Tag[]
}
