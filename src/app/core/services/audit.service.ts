import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import _isEmpty from 'lodash/isEmpty';

import { Observable } from 'rxjs';
import { DataPaginated, ApiResponse, ReportRecord } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private baseUrl = 'application/3671/users/export';
  // private baseUrl = 'audits/export';

  constructor(private httpClient: HttpClient) { }

  getReportAudit(filters?: {[key: string]: string},
    sort?: { sortby: string, sortdirection: string }): Observable<ApiResponse<DataPaginated<ReportRecord>>> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (!_isEmpty(value)) {
          params = params.set(key, value);
        }
      });
    }
    if (sort) {
      Object.keys(sort).forEach(key => {
        const value = sort[key];
        if (!_isEmpty(value)) {
          params = params.set(key, value);
        }
      });
    }
    return this.httpClient.get<ApiResponse<DataPaginated<ReportRecord>>>(this.baseUrl, { responseType: 'blob' as 'json' });
  }
}
