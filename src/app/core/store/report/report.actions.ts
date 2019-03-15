/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';
import { ReportRecord } from '../../models';

export const ReportTypes = {
  FETCH_AUDIT_DATA: ActionType('FETCH_AUDIT_DATA'),
  FETCH_AUDIT_REPORTS_SUCCESS: ActionType('FETCH_AUDIT_REPORTS_SUCCESS'),
  FETCH_AUDIT_REPORTS_ERROR: ActionType('FETCH_AUDIT_REPORTS_ERROR'),
  EXPORT_AUDIT_DATA: ActionType('EXPORT_AUDIT_DATA'),
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

export class ExportAuditData implements Action {
  public type: string = ReportTypes.EXPORT_AUDIT_DATA;
  constructor(public payload: {
    filters?: any;
    sort?: any
  } = {
    sort: { sortby: 'login', sortdirection: 'asc' }
  }) {}
}

export class FetchAuditReportSuccess implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_REPORTS_SUCCESS;
  constructor(public payload?: {
    items: ReportRecord[],
    limit?: number,
    offset?: number,
    totalCount?: any,
  }) {}
}

export class FertchAuditReportError implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_REPORTS_ERROR;
  constructor(public payload?: any) {}
}

export type ReportActions =
  ExportAuditData |
  FetchAuditData |
  FetchAuditReportSuccess |
  FertchAuditReportError;
