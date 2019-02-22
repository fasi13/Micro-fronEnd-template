import { Injectable } from '@angular/core';
import _isEmpty from 'lodash/isEmpty';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, DataPaginated, ReportRecord } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient) {}

  getReportData(): Observable<ApiResponse<DataPaginated<ReportRecord>>> {
    return this.httpClient.get<ApiResponse<DataPaginated<ReportRecord>>>(
      'audits?sortby=name&sortdirection=desc'
    );
  }
}
