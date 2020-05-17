import { Action } from '@ngrx/store';
import { ActionType } from '../util';
/* tslint:disable:max-classes-per-file */

export const CultureActionTypes = {
  SWITCH_CULTURE: ActionType('SWITCH_CULTURE'),
  READ_CULTURE: ActionType('READ_CULTURE'),
  READ_CULTURE_SUCCESS: ActionType('READ_CULTURE_SUCCES'),
  READ_AVAILABLE_CULTURES: ActionType('READ_AVAILABLE_CULTURES'),
  READ_AVAILABLE_CULTURES_SUCCESS: ActionType(
    'READ_AVAILABLE_CULTURES_SUCCESS'
  ),
  RESET_CULTURE: ActionType('RESET_CULTURE'),
};

export class SwitchCultureAction implements Action {
  readonly type = CultureActionTypes.SWITCH_CULTURE;
  constructor(public payload?: any) {}
}

export class ReadCultureAction implements Action {
  readonly type = CultureActionTypes.READ_CULTURE;
  constructor(public payload?: any) {}
}

export class ReadCultureSuccessAction implements Action {
  readonly type = CultureActionTypes.READ_CULTURE_SUCCESS;
  constructor(public payload?: any) {}
}

export class ReadAvailableCulturesAction implements Action {
  readonly type = CultureActionTypes.READ_AVAILABLE_CULTURES;
  constructor(public payload?: any) {}
}

export class ReadAvailableCulturesSuccessAction implements Action {
  readonly type = CultureActionTypes.READ_AVAILABLE_CULTURES_SUCCESS;
  constructor(public payload?: any) {}
}

export class ResetCultureAction implements Action {
  readonly type = CultureActionTypes.RESET_CULTURE;
  constructor(public payload?: any) {}
}

export type CultureAction =
  | SwitchCultureAction
  | ReadCultureAction
  | ReadCultureSuccessAction
  | ReadAvailableCulturesAction
  | ReadAvailableCulturesSuccessAction
  | ResetCultureAction;
