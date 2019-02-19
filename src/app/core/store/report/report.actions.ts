/* tslint:disable:max-classes-per-file */
import { ActionType } from '../util';
import { Action } from '@ngrx/store';

export const ReportTypes = {
  FETCH_AUDIT_DATA: ActionType('FETCH_AUDIT_DATA'),
  FETCH_AUDIT_DATA_COMPLETED: ActionType('FETCH_AUDIT_DATA_COMPLETED')
};

export class FetchAuditData implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_DATA;
  constructor(public payload?: any) {}
}

export class FetchAuditDataCompleted implements Action {
  public type: string = ReportTypes.FETCH_AUDIT_DATA_COMPLETED;
  constructor(public payload?: any) {}
}

export type ReportActions = FetchAuditData | FetchAuditDataCompleted;
