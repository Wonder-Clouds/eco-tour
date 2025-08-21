import { DetailPrice } from './DetailPrice';
import { DetailService } from './DetailService';

export interface Service {
  isActive: boolean;
  detailPrice: DetailPrice;
  detailService: DetailService;
}
