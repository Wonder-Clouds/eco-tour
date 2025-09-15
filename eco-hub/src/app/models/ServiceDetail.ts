import { Itinerary } from './Itinerary';
import { Media } from './Media';

export interface ServiceDetail {
  title: string;
  duration: string;
  data: ServiceData[];
  summary: string;
  media: Media[];
  itinerary: Itinerary[];
  includes: string;
  notIncludes: string;
}
