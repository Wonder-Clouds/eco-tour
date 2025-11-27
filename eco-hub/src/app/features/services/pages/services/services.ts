import { Component, OnInit } from '@angular/core';
import { Header } from '../../../../layouts/header/header';
import { ServiceDetailCard } from '../../components/service-detail-card/service-detail-card';
import { Service } from '../../../../models/Service';
import { ServiceApi } from '../../api/service/service-api';
import { Router } from '@angular/router';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';

@Component({
  selector: 'app-services',
  imports: [ServiceDetailCard, Header],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services implements OnInit {
  services: Service[] = [];
  loading = true;

  constructor(private router: Router, private serviceApi: ServiceApi) {}

  ngOnInit(): void {
    this.getAllServices();
  }

  getAllServices() {
    this.serviceApi.getServices().subscribe({
      next: (data: PaginatedResponse<Service>) => {
        this.services = data.results ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios', err);
        this.loading = false;
      },
    });
  }

  goToAddService() {
    this.router.navigate(['servicios/crear-servicio']);
  }
}
