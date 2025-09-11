import { Service } from './../../../../models/Service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-service-detail-card',
  standalone: true,
  templateUrl: './service-detail-card.html',
  styleUrl: './service-detail-card.scss',
})
export class ServiceDetailCard {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() description?: string;
  @Input() imageUrl?: string;
}
