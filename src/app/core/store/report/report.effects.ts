import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom } from 'rxjs/operators';

import { EmptyAction } from '../store.actions';
import { State, getApplicationInfo } from '../store.reducers';
import { AuditService } from '../../services/audit.service';
import { ResourceService } from '../../services/resource.service';
import { FgeHttpActionService } from '../../services';
import { ApiResponse, DataPaginated, Application, ApplicationLink, ReportRecord } from '../../models';
import { ReportTypes, FetchAuditReportError, FetchAuditReportSuccess } from './report.actions';

@Injectable()
export class ReportEffects {
  @Effect() public fetchAuditData: Observable<Action> = this.actions.pipe(
    ofType(ReportTypes.FETCH_AUDIT_DATA),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([action, applicationInfo]: [any, Application]) =>
      this.fgeActionService.performAction(applicationInfo, ApplicationLink.AUDIT, { params: {
        ...action.payload.filters,
        ...action.payload.sort,
        limit: action.payload.limit,
        offset: action.payload.offset,
        }})
        .pipe(
          map((response: ApiResponse<DataPaginated<ReportRecord>>) => {
              return new FetchAuditReportSuccess(response.data);
            }),
          catchError(error => of(new FetchAuditReportError({ error : error })))
        )
    )
  );

  @Effect() public ExportAudit: Observable<Action> = this.actions.pipe(
    ofType(ReportTypes.EXPORT_AUDIT_DATA),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([action, applicationInfo]: [any, Application]) => this.auditService.getAuditReport(
      applicationInfo.id,
      action.payload.sort,
      action.payload.filters,
    ).pipe(
        map((response: HttpResponse<Blob>) => {
          const fileName = 'ExportAuditReport.csv';
          /**
          * @TODO Refactor this once that get the name (fileName) that it in the answer
          * in the header part in the Content-Disposition. For now the name will be send
          * as a date hardcode.
          */
          this.resourceService.downloadHttpResource(response, fileName);
          this.notifierService.notify('success', 'Your audit report has been successfully exported');
          return new EmptyAction();
        }),
        catchError(error => {
            this.notifierService.notify('error', 'Error while processing your request. Please try again later.');
            return of(new FetchAuditReportError({error: error}));
        })
      )
    )
  );
  constructor(
    private auditService: AuditService,
    private resourceService: ResourceService,
    private notifierService: NotifierService,
    private actions: Actions,
    private store: Store<State>,
    private fgeActionService: FgeHttpActionService
  ) {}
}
