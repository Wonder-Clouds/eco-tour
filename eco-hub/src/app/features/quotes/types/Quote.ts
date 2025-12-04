export interface Quote {
  id: string;
  status: string;
  version: number;
  version_display: string;
  notes: string;
  total_price: string;
  created_at: string;
  updated_at: string;
  group: string;
  group_total_people: number;
  parent_quote: string | null;
  detail_quote_by_person: any[];
}