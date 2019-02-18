import { Injectable } from '@angular/core';
import { Report } from '../../models/report';
import { REPORTS } from '../../models/mock-report';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor() {}

  getReports(): Observable<Report[]> {
    return of(REPORTS);
  }
}
