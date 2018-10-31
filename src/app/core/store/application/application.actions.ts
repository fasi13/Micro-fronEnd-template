/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';

import { ActionType } from '../util';
import { ApiResponse, DataPaginated, ApplicationContent } from '../../models';

export const ApplicationActionTypes = {
    FETCH_APPLICATION_DATA: ActionType('FETCH_APPLICATION_DATA'),
    FETCH_APPLICATION_DATA_SUCCESS: ActionType('FETCH_APPLICATION_DATA_SUCCESS'),
    FETCH_APPLICATION_DATA_ERROR: ActionType('FETCH_APPLICATION_DATA_ERROR'),
    SEARCH_APPLICATION: ActionType('SEARCH_APPLICATION'),
    SEARCH_APPLICATION_SUCCESS: ActionType('SEARCH_APPLICATION_SUCCESS'),
    SEARCH_APPLICATION_ERROR: ActionType('SEARCH_APPLICATION_ERROR'),
    FETCH_DATA_TYPES: ActionType('FETCH_DATA_TYPES'),
    FETCH_DATA_TYPES_SUCCESS: ActionType('FETCH_DATA_TYPES_SUCCESS'),
    FETCH_DATA_TYPES_ERROR: ActionType('FETCH_DATA_TYPES_ERROR')
};

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

export class SearchApplication implements Action {
  public type: string = ApplicationActionTypes.SEARCH_APPLICATION;
  constructor(public payload?: any) {}
}

export class SearchApplicationSuccess implements Action {
  public type: string = ApplicationActionTypes.SEARCH_APPLICATION_SUCCESS;
  constructor(public payload?: any) {}
}

export class SearchApplicationError implements Action {
  public type: string = ApplicationActionTypes.SEARCH_APPLICATION_ERROR;
  constructor(public payload?: any) {}
}

export class FetchDataTypes implements Action {
  public type: string = ApplicationActionTypes.FETCH_DATA_TYPES;
  constructor(public payload?: any) {}
}

export class FetchDataTypesSuccess implements Action {
  public type: string = ApplicationActionTypes.FETCH_DATA_TYPES_SUCCESS;
  constructor(public payload?: any) {}
}

export class FetchDataTypesError implements Action {
  public type: string = ApplicationActionTypes.FETCH_DATA_TYPES_ERROR;
  constructor(public payload?: any) {}
}

export type ApplicationAction =
  FetchApplicationData |
  FetchApplicationDataSuccess |
  FetchApplicationDataError |
  SearchApplication |
  SearchApplicationSuccess |
  SearchApplicationError |
  FetchDataTypes |
  FetchDataTypesSuccess |
  FetchDataTypesError;
