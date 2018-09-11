import { Action } from '@ngrx/store';

import { ActionType } from '../util';
import { ApiResponse, DataPaginated, ApplicationContent, ApplicationBranding } from '../../models';

export const ApplicationActionTypes = {
    FETCH_APPLICATION_DATA: ActionType('FETCH_APPLICATION_DATA'),
    FETCH_APPLICATION_DATA_SUCCESS: ActionType('FETCH_APPLICATION_DATA_SUCCESS'),
    FETCH_APPLICATION_DATA_ERROR: ActionType('FETCH_APPLICATION_DATA_ERROR')
}

export class FetchApplicationData implements Action {
    public type: string = ApplicationActionTypes.FETCH_APPLICATION_DATA;
    constructor(public payload?: any) {}
}

export class FetchApplicationDataSuccess implements Action {
  public type: string = ApplicationActionTypes.FETCH_APPLICATION_DATA_SUCCESS;
  constructor(public payload?: {
    info: ApiResponse<DataPaginated<ApplicationContent>>,
    branding: { [key: string]: ApiResponse<DataPaginated<ApplicationContent>> }
  }) {}
}

export class FetchApplicationDataError implements Action {
  public type: string = ApplicationActionTypes.FETCH_APPLICATION_DATA_ERROR;
  constructor(public payload?: any) {}
}

export type ApplicationActions = FetchApplicationData