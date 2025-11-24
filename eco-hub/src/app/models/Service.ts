import { DetailPrice } from './DetailPrice';
import { Media } from './Media';
import { ServiceDetail } from './ServiceDetail';

export interface Service {
  id: string;
  title: string;
  duration: number;
  summary: string;
  includes: string;
  excludes: string;
  type: string;
  price: number;
  itinerary: string[];
  data: string[];
  media: Media[];
}
