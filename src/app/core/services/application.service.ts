import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { HateoasAction, ApiResponse, DataPaginated, ApplicationContent, Application } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(
    private httpClient: HttpClient
  ) { }

  performRequest<T>({ method, href }: HateoasAction, body?: any): Observable<T> {
    const httpMethod = this.httpClient[method];
    const args = body ? [ href, body ] : [ href ]; 
    return httpMethod.call(this.httpClient, ...args);
  }

  getApplicationInfo(applicationId: number): Observable<ApiResponse<Application>> {
    return this.httpClient.get<ApiResponse<Application>>(`/application/${applicationId}`);
  }

  getContentFor({ href }: HateoasAction, name: string): Observable<ApiResponse<DataPaginated<ApplicationContent>>> {
    const params = new HttpParams({
      fromObject: {
        name,
        exactMatch: 'true'
      }
    });

    return this.httpClient.get<ApiResponse<DataPaginated<ApplicationContent>>>(href, { params })
  }
}
