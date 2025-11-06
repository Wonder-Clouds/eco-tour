import { Person } from './Person';

export interface Group {
  id: string;
  name: string;
  description: string;
  members: Person[];
  contactInfo: string;
  totalMembers: number;
}
