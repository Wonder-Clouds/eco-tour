import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceApi } from '../../api/service/service-api';
import { Service } from '../../../../models/Service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [],
  templateUrl: './service-detail.html',
  styleUrls: ['./service-detail.scss'],
})
export class ServiceDetailPage implements OnInit {
  serviceId!: string;
  serviceData: WritableSignal<Service | null> = signal(null);
  isLoading: WritableSignal<boolean> = signal(true);

  constructor(
    private serviceApi: ServiceApi,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serviceId = String(this.route.snapshot.paramMap.get('id'));
    this.getService(this.serviceId);
  }

  getService(id: string) {
    this.isLoading.set(true);
    this.serviceApi.getServiceById(id).subscribe({
      next: (data: Service) => {
        this.serviceData.set(data);
        console.log('Servicio cargado:', data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el servicio', err);
        this.isLoading.set(false);
      },
    });
  }

  deleteService(id: string) {
    this.serviceApi.deleteService(id).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/servicios']);
      },
      error: (err) => {
        console.error('Error al cargar el servicio', err);
        this.isLoading.set(false);
      },
    });
  }

  get detailService() {
    return this.serviceData();
  }

  getCoverImage(): string {
    const media = this.detailService?.media;
    if (!media) return '';
    const coverImage = media.find((m) => m.is_cover);
    console.log('Cover Image:', coverImage?.file);
    return coverImage?.file || '';
  }

  // getGalleryImages(): string[] {
  //   const media = this.detailService?.media;
  //   if (!media) return [];
  //   return media
  //     .filter((m) => !m.isCover && ['image', 'cover', 'post'].includes(m.type))
  //     .map((m) => m.url);
  // }

  formatItineraryDescription(description: string): string[] {
    return description.split('\n').filter((line) => line.trim());
  }
}
