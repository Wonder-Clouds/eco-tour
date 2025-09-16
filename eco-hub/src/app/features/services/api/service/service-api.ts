import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Service } from '../../../../models/Service';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/services`);
  }

  getServiceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/services/${id}`);
  }

  postService(data: Service): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/services/`, data);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/services/${id}`);
  }
}
