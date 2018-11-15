/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';

export const UserTypes = {
  NEW_USER: ActionType('NEW_USER'),
  NEW_USER_SUCCESS: ActionType('NEW_USER_SUCCESS'),
  NEW_USER_ERROR: ActionType('NEW_USER_ERROR'),
  UPDATE_USER: ActionType('UPDATE_USER'),
  UPDATE_USER_SUCCESS: ActionType('UPDATE_USER_SUCCESS'),
  UPDATE_USER_ERROR: ActionType('UPDATE_USER_ERROR'),
  FETCH_USERS: ActionType('FETCH_USERS'),
  FETCH_USERS_SUCCESS: ActionType('FETCH_USERS_SUCCESS'),
  FETCH_USERS_ERROR: ActionType('FETCH_USERS_ERROR')
};

export class NewUserAction implements Action {
  public type: string = UserTypes.NEW_USER;
  constructor(public payload?: any) {}
}

export class NewUserErrorAction implements Action {
  public type: string = UserTypes.NEW_USER_ERROR;
  constructor(public payload?: any) {}
}

export class NewUserSuccessAction implements Action {
  public type: string = UserTypes.NEW_USER_SUCCESS;
  constructor(public payload?: any) {}
}

export class UpdateUserAction implements Action {
  public type: string = UserTypes.UPDATE_USER;
  constructor(public payload?: any) {}
}

export class UpdateUserErrorAction implements Action {
  public type: string = UserTypes.UPDATE_USER_ERROR;
  constructor(public payload?: any) {}
}

export class UpdateUserSuccessAction implements Action {
  public type: string = UserTypes.UPDATE_USER_SUCCESS;
  constructor(public payload?: any) {}
}

export class FetchUsersAction implements Action {
  public type: string = UserTypes.FETCH_USERS;
  constructor(public payload?: any) {}
}

export class FetchUsersErrorAction implements Action {
  public type: string = UserTypes.FETCH_USERS_ERROR;
  constructor(public payload?: any) {}
}

export class FetchUsersSuccessAction implements Action {
  public type: string = UserTypes.FETCH_USERS_SUCCESS;
  constructor(public payload?: any) {}
}

export type UserActions =
  NewUserAction |
  NewUserErrorAction |
  NewUserSuccessAction |
  UpdateUserAction |
  UpdateUserErrorAction |
  UpdateUserSuccessAction |
  FetchUsersAction |
  FetchUsersErrorAction |
  FetchUsersSuccessAction;
