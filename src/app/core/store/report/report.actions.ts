/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';

export const ReportTypes = {
  FETCH_AUDIT_DATA: ActionType('FETCH_AUDIT_DATA'),
  // FETCH_AUDIT_DATA_COMPLETED: ActionType('FETCH_AUDIT_DATA_COMPLETED'),
  FETCH_AUDIT_REPORTS_SUCCESS: ActionType('FETCH_AUDIT_REPORTS_SUCCESS'),
  FETCH_AUDIT_REPORTS_ERROR: ActionType('FETCH_AUDIT_REPORTS_ERROR'),
};

export class FetchAuditData implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_DATA;
  constructor(public payload: {
    limit?: number,
    offset?: number,
    filters?: any,
    sort?: any
  } = {
    limit: 12,
    offset: 0,
    sort: { sortby: 'login', sortdirection: 'asc' }
  }) {}
}

/*export class FetchAuditDataCompleted implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_DATA_COMPLETED;
  constructor(public payload?: any) {}
}*/

export class FertchAuditReportSuccess implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_REPORTS_SUCCESS;
  constructor(public payload?: any) {}
}

export class FertchAuditReportError implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_REPORTS_ERROR;
  constructor(public payload?: any) {}
}

export type ReportActions =
  FetchAuditData |
  // FetchAuditDataCompleted |
  FertchAuditReportSuccess |
  FertchAuditReportError;
