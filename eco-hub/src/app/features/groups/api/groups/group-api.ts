import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { Observable } from 'rxjs';
import { Group } from '../../../clients/types/Group';

@Injectable({
  providedIn: 'root',
})
export class GroupApi {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGroups(): Observable<PaginatedResponse<Group>> {
    return this.http.get<PaginatedResponse<Group>>(`${this.baseUrl}/group`);
  }
}
