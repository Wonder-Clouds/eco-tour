import { ServiceDetail } from '../../../../models/ServiceDetail';
import { Service } from './../../../../models/Service';
import { Component, Input } from '@angular/core';

export interface ServiceCard {
  serviceType: string;
  feeSupplier: number;
  commissionByService: number;
  commissionCard: number;
  isActive: boolean;
  detailService: ServiceDetail;
}

@Component({
  selector: 'app-service-detail-card',
  standalone: true,
  templateUrl: './service-detail-card.html',
  styleUrl: './service-detail-card.scss',
})
export class ServiceDetailCard {
  @Input() service!: ServiceCard;

  get coverImage(): string | undefined {
    return (
      this.service?.detailService?.media?.find((media) => media.isCover)?.url ||
      this.service?.detailService?.media?.[0]?.url
    );
  }

  get totalPrice(): number | undefined {
    if (!this.service) return 0;
    return (
      this.service.feeSupplier +
      this.service.commissionByService +
      this.service.commissionCard
    );
  }
}
