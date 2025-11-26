import { Component, OnInit } from '@angular/core';
import { ServiceApi } from '../../api/service/service-api';
import { Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Header } from '../../../../layouts/header/header';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FileUpload } from '../../../../shared/components/file-upload/file-upload';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-create-service',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    Header,
    FileUpload,
    MatProgressBarModule,
  ],
  templateUrl: './create-service.html',
  styleUrl: './create-service.scss',
})
export class CreateServicePage implements OnInit {
  serviceForm!: FormGroup;
  itineraryForm!: FormGroup;

  serviceTypes = [
    { value: 'GROUP', viewValue: 'Grupo' },
    { value: 'PRIVATE', viewValue: 'Privado' },
  ];

  loading = false;

  constructor(
    private fb: FormBuilder,
    private serviceApi: ServiceApi,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      title: [''],
      duration: [''],
      summary: new FormControl(''),
      includes: new FormControl(''),
      excludes: new FormControl(''),
      isActive: [false],
      type: ['group'],
    });

    this.itineraryForm = this.fb.group({
      title: [''],
      description: [''],
    });
  }

  createItineraryItem(): FormGroup {
    return this.fb.group({
      id: [''],
      title: [''],
      description: [''],
    });
  }

  get itinerary(): FormArray {
    return this.serviceForm.get('detailService.itinerary') as FormArray;
  }

  get media(): FormArray {
    return this.serviceForm.get('detailService.media') as FormArray;
  }

  get data(): FormArray {
    return this.serviceForm.get('detailService.data') as FormArray;
  }

  addItineraryItem(): void {
    this.itinerary.push(
      this.fb.group({
        title: [''],
        description: [''],
      })
    );
  }

  addMediaItem(): void {
    this.media.push(
      this.fb.group({
        type: ['image'],
        url: [''],
        isCover: [false],
      })
    );
  }

  addDetailItem(): void {
    this.data.push(
      this.fb.group({
        title: [''],
        description: [''],
      })
    );
  }

  removeItineraryItem(index: number): void {
    this.itinerary.removeAt(index);
  }

  removeMediaItem(index: number): void {
    this.media.removeAt(index);
  }

  removeDetailItem(index: number): void {
    this.data.removeAt(index);
  }

  onSaveService(): void {
    this.loading = true;
    this.serviceApi.postService(this.serviceForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/servicios']);
      },
      error: (err) => {
        console.error('Error creando servicio', err);
        this.loading = false;
      },
    });
  }

  onFilesSelected(files: File[]): void {
    console.log('Archivos seleccionados:', files);

    files.forEach((file) => {
      console.log(`Archivo: ${file.name}, Tamaño: ${file.size}`);
    });
  }
}
