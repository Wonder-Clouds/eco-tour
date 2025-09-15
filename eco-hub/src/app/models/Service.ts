import { DetailPrice } from './DetailPrice';
import { ServiceDetail } from './ServiceDetail';

export interface Service {
  id: string;
  detailService: ServiceDetail;
  feeSupplier: number;
  commissionByService: number;
  commissionCard: number;
  finalPrice: 0;
  isActive: boolean;
  serviceType: string;
}
