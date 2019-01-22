/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';

import { ActionType } from '../util';
import { ApiResponse, DataPaginated, ApplicationContent } from '../../models';

export const ApplicationActionTypes = {
  UPDATE_APPLICATION_DATA: ActionType('UPDATE_APPLICATION_DATA'),
  UPDATE_APPLICATION_DATA_SUCCESS: ActionType('UPDATE_APPLICATION_DATA_SUCCESS'),
  FETCH_APPLICATION_DATA: ActionType('FETCH_APPLICATION_DATA'),
  FETCH_APPLICATION_DATA_SUCCESS: ActionType('FETCH_APPLICATION_DATA_SUCCESS'),
  FETCH_APPLICATION_DATA_ERROR: ActionType('FETCH_APPLICATION_DATA_ERROR'),
  FETCH_APPLICATION_PATH: ActionType('FETCH_APPLICATION_PATH'),
  FETCH_APPLICATION_PATH_SUCCESS: ActionType('FETCH_APPLICATION_PATH_SUCCESS'),
  FETCH_APPLICATION_PATH_ERROR: ActionType('FETCH_APPLICATION_PATH_ERROR'),
  SEARCH_APPLICATION: ActionType('SEARCH_APPLICATION'),
  SEARCH_APPLICATION_SUCCESS: ActionType('SEARCH_APPLICATION_SUCCESS'),
  SEARCH_APPLICATION_ERROR: ActionType('SEARCH_APPLICATION_ERROR'),
  FETCH_DATA_TYPES: ActionType('FETCH_DATA_TYPES'),
  FETCH_DATA_TYPES_SUCCESS: ActionType('FETCH_DATA_TYPES_SUCCESS'),
  FETCH_DATA_TYPES_ERROR: ActionType('FETCH_DATA_TYPES_ERROR'),
  FETCH_APPLICATION_PREVIEW: ActionType('FETCH_APPLICATION_PREVIEW'),
  FETCH_APPLICATION_PREVIEW_SUCCESS: ActionType('FETCH_APPLICATION_PREVIEW_SUCCESS'),
  FETCH_APPLICATION_PREVIEW_ERROR: ActionType('FETCH_APPLICATION_PREVIEW_ERROR')
};

export class UpdateApplicationData implements Action {
  public type: string = ApplicationActionTypes.UPDATE_APPLICATION_DATA;
  constructor(public payload?: any) {}
}

export class UpdateApplicationDataSuccess implements Action {
  public type: string = ApplicationActionTypes.UPDATE_APPLICATION_DATA_SUCCESS;
  constructor(public payload?: any) {}
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

export class FetchApplicationPath implements Action {
    public type: string = ApplicationActionTypes.FETCH_APPLICATION_PATH;
    constructor(public payload?: any) {}
}

export class FetchApplicationPathSuccess implements Action {
  public type: string = ApplicationActionTypes.FETCH_APPLICATION_PATH_SUCCESS;
  constructor(public payload?: any) {}
}

export class FetchApplicationPathError implements Action {
  public type: string = ApplicationActionTypes.FETCH_APPLICATION_PATH_ERROR;
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

export class FetchApplicationPreview implements Action {
  public type: string = ApplicationActionTypes.FETCH_APPLICATION_PREVIEW;
  constructor(public payload?: any) {}
}

export class FetchApplicationPreviewSuccess implements Action {
  public type: string = ApplicationActionTypes.FETCH_APPLICATION_PREVIEW_SUCCESS;
  constructor(public payload?: any) {}
}

export class FetchApplicationPreviewError implements Action {
  public type: string = ApplicationActionTypes.FETCH_APPLICATION_PREVIEW_ERROR;
  constructor(public payload?: any) {}
}

export type ApplicationAction =
  FetchApplicationData |
  FetchApplicationDataSuccess |
  FetchApplicationDataError |
  FetchApplicationPath |
  FetchApplicationPathSuccess |
  FetchApplicationPathError |
  SearchApplication |
  SearchApplicationSuccess |
  SearchApplicationError |
  FetchDataTypes |
  FetchDataTypesSuccess |
  FetchDataTypesError |
  FetchApplicationPreview |
  FetchApplicationPreviewSuccess |
  FetchApplicationPreviewError;
