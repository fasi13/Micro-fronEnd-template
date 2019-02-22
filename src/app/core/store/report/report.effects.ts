import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { ReportTypes, FertchAuditReportSuccess, FertchAuditReportError } from './report.actions';

import { catchError, switchMap, map } from 'rxjs/operators';

import { ReportService } from '../../services/report.service';
import { ReportRecord, ApiResponse, DataPaginated } from '../../models';
@Injectable()
export class ReportEffects {
  @Effect() public fetchAuditData: Observable<Action> = this.actions.pipe(
    ofType(ReportTypes.FETCH_AUDIT_DATA),
    switchMap((action: any) => this.reportService.getReportData(
      action.payload.offset,
      action.payload.limit,
      action.payload.filters,
      action.payload.sort)
      .pipe(
        map((response: ApiResponse<DataPaginated<ReportRecord>>) => {
          return new FertchAuditReportSuccess(response.data);
        }),
        catchError(error => of(new  FertchAuditReportError({ error: error })))
      )
    )
  );

  constructor(private actions: Actions, private reportService: ReportService) {}
}
