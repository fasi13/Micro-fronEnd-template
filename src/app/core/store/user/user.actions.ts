/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';
import { ListingParams, FgeStoreAction } from '../../models';
import { UserRole } from '../../models/user/user-role.model';

export const UserTypes = {
  USER_TRANSACTION: ActionType('USER_TRANSACTION'),
  USER_TRANSACTION_SUCCESS: ActionType('USER_TRANSACTION_SUCCESS'),
  USER_TRANSACTION_ERROR: ActionType('USER_TRANSACTION_ERROR'),
  FETCH_USERS: ActionType('FETCH_USERS'),
  FETCH_USERS_SUCCESS: ActionType('FETCH_USERS_SUCCESS'),
  EXPORT_USER_DATA: ActionType('EXPORT_USER_DATA'),
  FETCH_USERS_ERROR: ActionType('FETCH_USERS_ERROR'),
  FETCH_ROLES: ActionType('FETCH_ROLES'),
  FETCH_ROLES_SUCCESS: ActionType('FETCH_ROLES_SUCCESS'),
  FETCH_ROLES_ERROR: ActionType('FETCH_ROLES_ERROR'),
  FETCH_ROLE_PERMISSIONS: ActionType('FETCH_ROLE_PERMISSIONS'),
  FETCH_ROLE_PERMISSIONS_SUCCESS: ActionType('FETCH_ROLE_PERMISSIONS_SUCCESS'),
  FETCH_ROLE_USERS: ActionType('FETCH_ROLE_USERS'),
  FETCH_ROLE_USERS_SUCCESS: ActionType('FETCH_ROLE_USERS_SUCCESS')
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

export class FetchUsers extends FgeStoreAction {
  constructor(public model?: ListingParams) {
    super(UserTypes.FETCH_USERS, model, {limit: 12, offset: 0, sort: { sortby: 'login', sortdirection: 'asc' } });
  }
}

export class FetchUsersError implements Action {
  public type: string = UserTypes.FETCH_USERS_ERROR;
  constructor(public payload?: any) {}
}

export class FetchUsersSuccess implements Action {
  public type: string = UserTypes.FETCH_USERS_SUCCESS;
  constructor(public payload?: any) {}
}

export class ExportUserData implements Action {
  public type: string = UserTypes.EXPORT_USER_DATA;
  constructor(public payload?: any) {}
}

export class FetchRoles implements Action {
  public type: string = UserTypes.FETCH_ROLES;
  constructor(public payload: {
    limit?: number,
    offset?: number,
    filters?: any,
    sort?: any
  } = { limit: 12, offset: 0 }) {}
}

export class FetchRolesError implements Action {
  public type: string = UserTypes.FETCH_ROLES_ERROR;
  constructor(public payload?: any) {}
}

export class FetchRolesSuccess implements Action {
  public type: string = UserTypes.FETCH_ROLES_SUCCESS;
  constructor(public payload?: any) {}
}

export class FetchRolePermissions implements Action {
  public type: string = UserTypes.FETCH_ROLE_PERMISSIONS;
  constructor(public payload: UserRole) {}
}

export class FetchRolePermissionsSuccess implements Action {
  public type: string = UserTypes.FETCH_ROLE_PERMISSIONS_SUCCESS;
  constructor(public payload: UserRole) {}
}

export class FetchRoleUsers implements Action {
  public type: string = UserTypes.FETCH_ROLE_USERS;
  constructor(public payload: UserRole) {}
}

export class FetchRoleUsersSuccess implements Action {
  public type: string = UserTypes.FETCH_ROLE_USERS_SUCCESS;
  constructor(public payload: UserRole) {}
}

export type UserActions =
  UserTransaction |
  UserTransactionSuccess |
  UserTransactionError |
  FetchUsers |
  FetchUsersError |
  FetchUsersSuccess |
  FetchRoles |
  FetchRolesSuccess |
  FetchRolesError |
  FetchRolePermissions |
  FetchRolePermissionsSuccess |
  FetchRoleUsers |
  FetchRoleUsersSuccess;
