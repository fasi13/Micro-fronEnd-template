import { Action } from '@ngrx/store';

import { ActionType } from '../util';

export const ActionTypes = {
    FETCH_APPLICATION_DATA: ActionType('FETCH_APPLICATION_DATA'),
    FETCH_APPLICATION_DATA_SUCCESS: ActionType('FETCH_APPLICATION_DATA_SUCCESS'),
    FETCH_APPLICATION_DATA_ERROR: ActionType('FETCH_APPLICATION_DATA_ERROR')
}

export class FetchApplicationData implements Action {
    public type: string = ActionTypes.FETCH_APPLICATION_DATA;
    constructor(public payload?: any) {}
}

export class FetchApplicationDataSuccess implements Action {
  public type: string = ActionTypes.FETCH_APPLICATION_DATA_SUCCESS;
  constructor(public payload?: any) {}
}

export class FetchApplicationDataError implements Action {
  public type: string = ActionTypes.FETCH_APPLICATION_DATA_ERROR;
  constructor(public payload?: any) {}
}

export type ApplicationActions = FetchApplicationData