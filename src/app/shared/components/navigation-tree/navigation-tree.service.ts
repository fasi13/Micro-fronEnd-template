import { Injectable } from '@angular/core';
import { ApiResponse, DataPaginated } from '@forge/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationTreeService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getApplications(applicationId: string | number, applicationGroupId: string | number): Observable<ApiResponse<DataPaginated<any>>> {
    return this.httpClient.get<ApiResponse<DataPaginated<any>>>(
      `applications/${applicationId}/applicationGroup/${applicationGroupId}/applications`);
  }

  getApplicationGroups(applicationId: string | number): Observable<ApiResponse<DataPaginated<any>>> {
    return this.httpClient.get<ApiResponse<DataPaginated<any>>>(
      `applications/${applicationId}/applicationGroups`);
  }
}
