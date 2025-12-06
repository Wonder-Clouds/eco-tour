import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteApi } from '../../api/quotes/quote-api';
import { GroupApi } from '../../../groups/api/groups/group-api';
import { Group } from '../../../clients/types/Group';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.html',
  styleUrl: './quote-detail.scss',
  imports: [CommonModule],
})
export class QuoteDetail implements OnInit {
  quoteId: string | null = null;
  quote: any = null;
  loading = true;
  error: string | null = null;
  groups: Group[] = [];

  constructor(
    private route: ActivatedRoute,
    private quoteApi: QuoteApi,
    private groupApi: GroupApi
  ) {
    this.quoteId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.groupApi.getGroups().subscribe({
      next: (data: Group[]) => {
        this.groups = data ?? [];
        this.loadQuote();
      },
      error: () => {
        this.groups = [];
        this.loadQuote();
      }
    });
  }

  loadQuote() {
    if (this.quoteId) {
      this.quoteApi.getQuoteById(this.quoteId).subscribe({
        next: (data) => {
          this.quote = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar la cotización';
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
      this.error = 'ID de cotización no válido';
    }
  }

  getGroupName(groupId: string): string {
    const group = this.groups.find(g => g.id === groupId);
    return group ? group.name : groupId;
  }
}
