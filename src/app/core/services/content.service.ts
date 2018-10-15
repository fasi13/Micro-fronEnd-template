import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataPaginated, ApiResponse, ApplicationContent } from '../models';
import { Observable } from 'rxjs';

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
}
