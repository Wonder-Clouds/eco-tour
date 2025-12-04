import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { Observable } from 'rxjs';
import { Quote } from '../../types/Quote';

@Injectable({
  providedIn: 'root',
})
export class QuoteApi {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.baseUrl}/quote/`);
  }

  getQuoteById(id: string): Observable<Quote> {
    return this.http.get<Quote>(`${this.baseUrl}/quote/${id}`);
  }

}
