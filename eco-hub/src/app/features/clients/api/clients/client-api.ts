import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { Person } from '../../types/Person';

@Injectable({
  providedIn: 'root',
})
export class ClientApi {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClients(): Observable<PaginatedResponse<Person>> {
    return this.http.get<PaginatedResponse<Person>>(`${this.baseUrl}/person`);
  }
}
