/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';

export const UserTypes = {
  USER_TRANSACTION: ActionType('USER_TRANSACTION'),
  USER_TRANSACTION_SUCCESS: ActionType('USER_TRANSACTION_SUCCESS'),
  USER_TRANSACTION_ERROR: ActionType('USER_TRANSACTION_ERROR'),
  FETCH_USERS: ActionType('FETCH_USERS'),
  FETCH_USERS_SUCCESS: ActionType('FETCH_USERS_SUCCESS'),
  FETCH_USERS_ERROR: ActionType('FETCH_USERS_ERROR')
};

export class UserTransaction implements Action {
  public type: string = UserTypes.USER_TRANSACTION;
  constructor(public payload?: any, public method?: string) {}
}

export class UserTransactionError implements Action {
  public type: string = UserTypes.USER_TRANSACTION_ERROR;
  constructor(public payload?: any) {}
}

export class UserTransactionSuccess implements Action {
  public type: string = UserTypes.USER_TRANSACTION_SUCCESS;
  constructor(public payload?: any) {}
}

export class FetchUsers implements Action {
  public type: string = UserTypes.FETCH_USERS;
  constructor(public payload?: any) {}
}

export class FetchUsersError implements Action {
  public type: string = UserTypes.FETCH_USERS_ERROR;
  constructor(public payload?: any) {}
}

export class FetchUsersSuccess implements Action {
  public type: string = UserTypes.FETCH_USERS_SUCCESS;
  constructor(public payload?: any) {}
}

export type UserActions =
  UserTransaction |
  UserTransactionSuccess |
  UserTransactionError |
  FetchUsers |
  FetchUsersError |
  FetchUsersSuccess;
