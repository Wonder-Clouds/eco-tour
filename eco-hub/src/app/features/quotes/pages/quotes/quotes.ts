import { Component, OnInit } from '@angular/core';
import { Header } from '../../../../layouts/header/header';
import { Quote } from '../../types/Quote';
import { Group } from '../../../clients/types/Group';
import { GroupApi } from '../../../groups/api/groups/group-api';
import { QuoteApi } from '../../api/quotes/quote-api';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { LucideAngularModule, Eye } from 'lucide-angular';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-quotes',
  imports: [
    LucideAngularModule,
    Header,
    MatTableModule,
    MatTabsModule,
    DatePipe,
    MatTooltipModule,
  ],
  templateUrl: './quotes.html',
  styleUrl: './quotes.scss',
})
export class Quotes implements OnInit {
  quotes: Quote[] = [];
  groups: Group[] = [];
  loading = true;
  displayedColumns: string[] = [
    'status',
    'version_display',
    'notes',
    'total_price',
    'created_at',
    'group',
    'actions',
  ];

  constructor(
    private quoteApi: QuoteApi,
    private groupApi: GroupApi,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllGroups();
    this.getAllQuotes();
  }

  getAllGroups() {
    this.groupApi.getGroups().subscribe({
      next: (data: Group[]) => {
        this.groups = data ?? [];
      },
      error: (err) => {
        console.error('Error al cargar grupos', err);
      },
    });
  }

  getAllQuotes() {
    this.quoteApi.getQuotes().subscribe({
      next: (data: Quote[]) => {
        this.quotes = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar cotizaciones', err);
        this.loading = false;
      },
    });
  }

  getGroupName(groupId: string): string {
    const group = this.groups.find((g) => g.id === groupId);
    return group ? group.name : groupId;
  }

  goToCreateQuote() {
    this.router.navigate(['cotizaciones/crear-cotizacion']);
  }

  goToQuoteDetail(id: string) {
    this.router.navigate(['cotizaciones/detalle', id]);
  }
}
