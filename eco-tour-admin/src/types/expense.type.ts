export type COIN = 'usd' | 'pen'

export interface Expense {
  id: string
  description: string
  amount: number
  currency: COIN
  paid: boolean
  date_incurred: string
}
