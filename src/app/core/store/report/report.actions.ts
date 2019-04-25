/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';
import { ListingParams, FgeStoreAction } from '../../models';
export const ReportTypes = {
  FETCH_AUDIT_DATA: ActionType('FETCH_AUDIT_DATA'),
  FETCH_AUDIT_REPORTS_SUCCESS: ActionType('FETCH_AUDIT_REPORTS_SUCCESS'),
  FETCH_AUDIT_REPORTS_ERROR: ActionType('FETCH_AUDIT_REPORTS_ERROR'),
  EXPORT_AUDIT_DATA: ActionType('EXPORT_AUDIT_DATA'),
};

export class FetchAuditData extends FgeStoreAction {
  constructor(public model?: ListingParams) {
    super(ReportTypes.FETCH_AUDIT_DATA, model,  {limit: 12, offset: 0 });
  }
}

export class ExportAuditData extends FgeStoreAction {
  constructor(public model?: ListingParams) {
    super(ReportTypes.EXPORT_AUDIT_DATA, model, { sortby: 'login', sortdirection: 'asc' });
  }
}

export class FetchAuditReportSuccess extends FgeStoreAction {
  constructor(public model?: ListingParams) {
    super(ReportTypes.FETCH_AUDIT_REPORTS_SUCCESS, model);
  }
}

export class FetchAuditReportError implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_REPORTS_ERROR;
  constructor(public payload?: any) {}
}

export type ReportActions =
  ExportAuditData |
  FetchAuditData |
  FetchAuditReportSuccess |
  FetchAuditReportError;
