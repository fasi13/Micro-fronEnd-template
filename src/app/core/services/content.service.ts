import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { DataPaginated, ApiResponse, ApplicationContent, ContentGroup } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(
    private http: HttpClient
  ) { }

  getContentGroups(applicationId: string | number,
    fetchContent: boolean = false): Observable<ApiResponse<DataPaginated<ApplicationContent>>> {
    return this.http.get<ApiResponse<DataPaginated<ApplicationContent>>>(
      `application/${applicationId}/contentGroups?content=${fetchContent}`);
  }

  getContentGroup(applicationId: string | number,
    groupId: string | number, fetchContent: boolean = true):  Observable<ApiResponse<ContentGroup>> {
    return this.http.get<ApiResponse<ContentGroup>>(`application/${applicationId}/contentGroup/${groupId}?content=${fetchContent}`);
  }

  addContentGroup(applicationId: string | number, name: string, published: boolean = true): Observable<any> {
    return this.http.post<any>(`application/${applicationId}/contentGroup`, { name, published });
  }

  updateContentGroup(applicationId: string | number, groupId: string | number, name: string, published: boolean = true): Observable<any> {
    return this.http.put<any>(`application/${applicationId}/contentGroup/${groupId}`, { name, published });
  }

  addContentToGroup(applicationId: string | number, groupId: string | number,
    { dataType, description, name, status = 'Published', value }: ApplicationContent): Observable<ApiResponse<ApplicationContent>> {
    return this.http.post<ApiResponse<ApplicationContent>>(`application/${applicationId}/contentGroup/${groupId}/content`,
    { dataType, description, name, status, value });
  }
}
