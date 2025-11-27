import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { Observable } from 'rxjs';
import { Group } from '../../../clients/types/Group';
import { CreateGroupRequest } from '../../types/Group';

@Injectable({
  providedIn: 'root',
})
export class GroupApi {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}/group`);
  }

  getGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.baseUrl}/group/${id}`);
  }

  createGroup(groupData: CreateGroupRequest): Observable<Group> {
    return this.http.post<Group>(`${this.baseUrl}/group/`, groupData);
  }
}
