import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceDetail } from '../../../../models/ServiceDetail';
import { ServiceDetailCard } from '../../components/service-detail-card/service-detail-card';
import { ServiceApi } from '../../api/service-api';
import { Service } from '../../../../models/Service';
import { Header } from '../../../../layouts/header/header';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [ServiceDetailCard, Header],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetailPage implements OnInit {
  services: Service[] = [];
  loading = true;

  constructor(private serviceApi: ServiceApi) {}

  ngOnInit(): void {
    this.getAllServicesDetail();
  }

  getAllServicesDetail() {
    this.serviceApi.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios', err);
        this.loading = false;
      },
    });
  }
}
