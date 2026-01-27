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
  price: number
  media?: Media[]
}
