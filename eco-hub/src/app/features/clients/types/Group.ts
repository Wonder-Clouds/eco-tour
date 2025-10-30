import { Person } from './Person';

export interface Group {
  id: string;
  name: string;
  members: Person[];
  contactInfo: string;
  totalMembers: number;
}
