/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';
import {FilterSettingModel, ResponseParameter } from '../../models';
export const ReportTypes = {
  FETCH_AUDIT_DATA: ActionType('FETCH_AUDIT_DATA'),
  FETCH_AUDIT_REPORTS_SUCCESS: ActionType('FETCH_AUDIT_REPORTS_SUCCESS'),
  FETCH_AUDIT_REPORTS_ERROR: ActionType('FETCH_AUDIT_REPORTS_ERROR'),
  EXPORT_AUDIT_DATA: ActionType('EXPORT_AUDIT_DATA'),
};

export class FetchAuditData extends ResponseParameter implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_DATA;
  constructor(public model?: FilterSettingModel) {
    super(model,  {limit: 12, offset: 0 });
  }
}

export class ExportAuditData extends ResponseParameter implements Action {
  public type: string = ReportTypes.EXPORT_AUDIT_DATA;
  constructor(public model?: FilterSettingModel) {
    super(model, { sortby: 'login', sortdirection: 'asc' });
  }
}

export class FetchAuditReportSuccess extends ResponseParameter implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_REPORTS_SUCCESS;
  constructor(public model?: FilterSettingModel) {
    super(model, {});
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
