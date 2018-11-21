/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';

export const ResetPasswordTypes = {
  RESET_PASSWORD: ActionType('RESET_PASSWORD'),
  RESET_PASSWORD_SUCCESS: ActionType('RESET_PASSWORD_SUCCESS'),
  RESET_PASSWORD_ERROR: ActionType('RESET_PASSWORD_ERROR'),
};

export class ResetPassword implements Action {
  public type: string = ResetPasswordTypes.RESET_PASSWORD;
  constructor(public payload?: any) {}
}

export class ResetPasswordSuccess implements Action {
  public type: string = ResetPasswordTypes.RESET_PASSWORD_SUCCESS;
  constructor(public payload?: any) {}
}

export class ResetPasswordError implements Action {
  public type: string = ResetPasswordTypes.RESET_PASSWORD_ERROR;
  constructor(public payload?: any) {}
}

export type ResetPasswordActions =
  ResetPassword |
  ResetPasswordSuccess |
  ResetPasswordError;
