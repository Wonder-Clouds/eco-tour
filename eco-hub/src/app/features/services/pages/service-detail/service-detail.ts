import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceDetail } from '../../../../models/ServiceDetail';
import { ServiceDetailCard } from '../../components/service-detail-card/service-detail-card';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [ServiceDetailCard],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetailPage implements OnInit {
  service!: ServiceDetail;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const serviceId = Number(this.route.snapshot.paramMap.get('id'));

    // Simulación de fetch (aquí podrías llamar a un Service con HttpClient)
    this.service = {
      title: 'Amazon Rainforest Adventure',
      subtitle:
        'Un tour de 4 días explorando la selva amazónica con guías locales.',
      duration: '3 noches y 4 días',
      data: 'string',
      summary: 'string',
    };
  }
}
