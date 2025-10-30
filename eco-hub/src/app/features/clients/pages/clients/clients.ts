import { Component, OnInit } from '@angular/core';
import { Header } from '../../../../layouts/header/header';
import { MatTableModule } from '@angular/material/table';
import { ClientApi } from '../../api/clients/client-api';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { Person } from '../../types/Person';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [Header, MatTableModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class Clients implements OnInit {
  clients: Person[] = [];
  loading = true;

  displayedColumns: string[] = [
    'position',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'birthDate',
    'nationality',
  ];

  constructor(private clientApi: ClientApi) {}

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.clientApi.getClients().subscribe({
      next: (data: PaginatedResponse<Person>) => {
        this.clients = data.results ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios', err);
        this.loading = false;
      },
    });
  }
}
