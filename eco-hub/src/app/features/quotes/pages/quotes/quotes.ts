import { Component, OnInit } from '@angular/core';
import { Header } from '../../../../layouts/header/header';
import {
  MatFormField,
  MatLabel,
  MatSelect,
  MatOption,
} from '@angular/material/select';
import { Group } from '../../../clients/types/Group';
import { GroupApi } from '../../../groups/api/groups/group-api';
import { ServiceApi } from '../../../services/api/service/service-api';
import { Service } from '../../../../models/Service';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { LucideAngularModule, Eye } from 'lucide-angular';

@Component({
  selector: 'app-quotes',
  imports: [
    LucideAngularModule,
    Header,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatTableModule,
    MatTabsModule,
  ],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss',
})
export class Quotes implements OnInit {
  groups: Group[] = [];
  services: Service[] = [];

  loading = true;

  selectedGroup: Group | null = null;

  displayedColumns: string[] = [
    'title',
    'type',
    'duration',
    'price',
    'actions',
  ];

  constructor(private groupsApi: GroupApi, private serviceApi: ServiceApi) {}
  ngOnInit(): void {
    this.getAllGroups();
  }

  getAllGroups() {
    this.groupsApi.getGroups().subscribe({
      next: (data: Group[]) => {
        this.groups = data ?? [];
      },
      error: (err) => {
        console.error('Error loading groups', err);
      },
    });
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

  onGroupSelected(group: Group) {
    this.selectedGroup = group;

    this.getAllServices();
  }
}
