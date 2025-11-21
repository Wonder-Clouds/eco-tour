import { Person } from './Person';

export interface Group {
  id: string;
  name: string;
  description: string;
  members: Person[];
  expense: string[];
  contactInfo: string;
  totalMembers: number;
}
