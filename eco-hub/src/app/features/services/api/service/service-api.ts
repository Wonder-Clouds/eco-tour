import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Service } from '../../../../models/Service';
import { PaginatedResponse } from '../../../../models/PaginatedResponse';
import { ItineraryGroup } from '../../types/Itinerary';

@Injectable({
  providedIn: 'root',
})
export class ServiceApi {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getServices(): Observable<PaginatedResponse<Service>> {
    return this.http.get<PaginatedResponse<Service>>(`${this.baseUrl}/service`);
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.baseUrl}/service/${id}`);
  }

  postService(data: Service): Observable<Service> {
    return this.http.post<Service>(`${this.baseUrl}/service/`, data);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/service/${id}`);
  }

  bulkItineraryUpload(id: string, data: ItineraryGroup): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/service/${id}/bulk-add-itineraries/`,
      data
    );
  }
}
