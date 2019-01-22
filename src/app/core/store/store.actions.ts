/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from './util';

export const StoreActionTypes = {
  CLEAR_STORED_DATA: ActionType('CLEAR_STORED_DATA'),
};

export class ClearStoredData implements Action {
  public type: string = StoreActionTypes.CLEAR_STORED_DATA;
  constructor(public payload?: any, public method?: string) {}
}
