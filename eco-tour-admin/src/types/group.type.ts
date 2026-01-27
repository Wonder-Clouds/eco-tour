import { Expense } from './expense.type'
import { Person } from './person.type'

export interface Group {
  id: string
  name: string
  description: string
  person: Person[]
  contact_info: string
  total_people: number
  expense?: Expense[]
}
