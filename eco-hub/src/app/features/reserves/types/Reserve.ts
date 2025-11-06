import { StatusReserve } from './StatusReserve';

export interface Reserve {
  id: string;
  quote: string;
  group: string;
  start_date: string;
  end_date: string;
  status: StatusReserve;
  currency: string;
  price: number;
  notes: string;
}
