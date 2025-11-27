import { Person } from './Person';

export interface Group {
  id: string;
  name: string;
  description: string;
  person: Person[];
  expense: string[];
  contactInfo: string;
  totalMembers: number;
}
