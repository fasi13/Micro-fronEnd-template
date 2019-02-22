import { Injectable } from '@angular/core';
import _isEmpty from 'lodash/isEmpty';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, DataPaginated, ReportRecord } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = 'audits?sortby=name&sortdirection=desc';

  constructor(private httpClient: HttpClient) {}

  /*getReportData(): Observable<ApiResponse<DataPaginated<ReportRecord>>> {
    return this.httpClient.get<ApiResponse<DataPaginated<ReportRecord>>>(
      'audits?sortby=name&sortdirection=desc'
    );
  }*/

  getReportData(offset?: number, limit?: number, filters?: {[key: string]: string},
    sort?: { sortby: string, sortdirection: string }): Observable<ApiResponse<DataPaginated<ReportRecord>>> {
    let params = new HttpParams();

    if (offset >= 0) {
      params = params.set('offset', `${offset}`);
    }

    if (limit) {
      params = params.set('limit', `${limit}`);
    }

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

    return this.httpClient.get<ApiResponse<DataPaginated<ReportRecord>>>(this.baseUrl, { params });
  }
}
