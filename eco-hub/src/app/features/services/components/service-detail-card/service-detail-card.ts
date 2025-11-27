import { Router } from '@angular/router';
import { ServiceDetail } from '../../../../models/ServiceDetail';
import { Service } from './../../../../models/Service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-detail-card',
  standalone: true,
  templateUrl: './service-detail-card.html',
  styleUrl: './service-detail-card.scss',
})
export class ServiceDetailCard {
  @Input() service!: Service;

  constructor(private router: Router) {}

  // get coverImage(): string | undefined {
  //   return this.service?.media?.find((media) => media.isCover)?.url;
  // }

  // get totalPrice(): number | undefined {
  //   if (!this.service) return 0;
  //   return (
  //     this.service.feeSupplier +
  //     this.service.commissionByService +
  //     this.service.commissionCard
  //   );
  // }

  viewDetails(id: string) {
    this.router.navigate(['servicios', id]);
  }
}
