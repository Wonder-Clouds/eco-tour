import { Component } from '@angular/core';
import { ServiceApi } from '../../api/service/service-api';
import { Router } from '@angular/router';
import { Service } from '../../../../models/Service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-service',
  imports: [ReactiveFormsModule],
  templateUrl: './create-service.html',
  styleUrl: './create-service.scss',
})
export class CreateServicePage {
  serviceForm: FormGroup = new FormGroup({
    detailService: new FormGroup({
      title: new FormControl(''),
      duration: new FormControl(''),
      summary: new FormControl(''),
      includes: new FormControl(''),
      notIncludes: new FormControl(''),
    }),
    feeSupplier: new FormControl(0),
    commissionByService: new FormControl(0),
    commissionCard: new FormControl(0),
    isActive: new FormControl(false),
    serviceType: new FormControl(''),
  });

  service: Service = {
    id: '',
    finalPrice: 0,
    serviceType: 'GROUP',
    feeSupplier: 0,
    commissionByService: 0,
    commissionCard: 0,
    isActive: true,
    detailService: {
      title: '',
      duration: '',
      summary: '',
      includes: '',
      notIncludes: '',
      data: [],
      itinerary: [],
      media: [],
    },
  };

  loading = false;

  constructor(private serviceApi: ServiceApi, private router: Router) {}

  addDetailItem() {
    this.service.detailService.data.push({
      id: '',
      title: '',
      description: '',
    });
  }

  addItineraryItem() {
    this.service.detailService.itinerary.push({
      id: '',
      title: '',
      description: '',
    });
  }

  addMediaItem() {
    this.service.detailService.media.push({
      id: 0,
      type: 'image',
      url: '',
      isCover: false,
    });
  }

  removeDetailItem(index: number) {
    this.service.detailService.data.splice(index, 1);
  }

  removeItineraryItem(index: number) {
    this.service.detailService.itinerary.splice(index, 1);
  }

  removeMediaItem(index: number) {
    this.service.detailService.media.splice(index, 1);
  }

  onSaveService() {
    this.loading = true;
    console.log('WORKS!');
    // this.serviceApi.postService(this.service).subscribe({
    //   next: () => {
    //     this.loading = false;
    //     this.router.navigate(['/servicios']);
    //   },
    //   error: (err) => {
    //     console.error('Error creando servicio', err);
    //     this.loading = false;
    //   },
    // });
  }
}
