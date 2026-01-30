import { Data } from './data.type'
import { Itinerary } from './itinerary.type'
import { Media } from './media.type'

export type DurationUnit = 'hours' | 'days' | 'weeks' | 'months'

export type TypeService = 'group' | 'arbitrary' | 'private'

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
  price: string
  media?: Media[]
  created_at?: string
  updated_at?: string
}

export interface SummaryService {
  id: string
  title: string
  type: TypeService
  price: string
  cover?: string
  duration: string
}
