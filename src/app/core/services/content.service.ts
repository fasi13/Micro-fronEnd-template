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

  getContentGroups(fetchContent: boolean = false): Observable<ApiResponse<DataPaginated<ApplicationContent>>> {
    return this.http.get<ApiResponse<DataPaginated<ApplicationContent>>>(`application/1/contentGroups?content=${fetchContent}`)
  }
}
