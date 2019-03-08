import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { ReportTypes, FertchAuditReportError, FetchAuditReportSuccess } from './report.actions';
import { FgeHttpActionService } from '../../services';
import { catchError, switchMap, map, withLatestFrom } from 'rxjs/operators';
import { State, getApplicationInfo } from '../store.reducers';
import { ApiResponse, DataPaginated, Application, ApplicationLink, ReportRecord } from '../../models';

@Injectable()
export class ReportEffects {
  @Effect() public fetchAuditData: Observable<Action> = this.actions.pipe(
    ofType(ReportTypes.FETCH_AUDIT_DATA),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([action, applicationInfo]: [any, Application]) =>
      this.fgeActionService.performAction(applicationInfo, ApplicationLink.AUDIT, { params: {
        ...action.payload.filters,
        ...action.payload.sort,
        offset: action.payload.offset,
        limit: action.payload.limit
       }})
        .pipe(
          map((response: ApiResponse<DataPaginated<ReportRecord>>) =>  new FetchAuditReportSuccess(response.data)),
          catchError(error => of(new FertchAuditReportError({ error : error })))
        )
    )
  );

  constructor(
    private actions: Actions,
    private store: Store<State>,
    private fgeActionService: FgeHttpActionService
  ) {}
}
