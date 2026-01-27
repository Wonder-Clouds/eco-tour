import { Group } from './group.type'
import { Media } from './media.type'

export interface Person {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  media?: Media[]
  passport_number: string
  group?: Group[]
  birth_date: string
  nationality: string
  is_generic: boolean
}
