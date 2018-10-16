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

  getContentGroups(applicationId: string | number, fetchContent: boolean = false): Observable<ApiResponse<DataPaginated<ApplicationContent>>> {
    return this.http.get<ApiResponse<DataPaginated<ApplicationContent>>>(`application/${applicationId}/contentGroups?content=${fetchContent}`)
  }

  getContentGroup(applicationId: string | number, groupId: string | number, fetchContent: boolean = true):  Observable<ApiResponse<ContentGroup>> {
    return this.http.get<ApiResponse<ContentGroup>>(`application/${applicationId}/contentGroup/${groupId}?content=${fetchContent}`);
  }
}
