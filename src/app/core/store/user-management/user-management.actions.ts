/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';

export const UserManagementTypes = {
    NEW_USER: ActionType('NEW_USER'),
    NEW_USER_SUCCESS: ActionType('NEW_USER_SUCCESS'),
    NEW_USER_ERROR: ActionType('NEW_USER_ERROR'),
    UPDATE_USER: ActionType('UPDATE_USER'),
    UPDATE_USER_SUCCESS: ActionType('UPDATE_USER_SUCCESS'),
    UPDATE_USER_ERROR: ActionType('UPDATE_USER_ERROR'),
    FETCH_USER: ActionType('FETCH_USER'),
    FETCH_USER_SUCCESS: ActionType('FETCH_USER_SUCCESS'),
    FETCH_USER_ERROR: ActionType('FETCH_USER_ERROR')
};

export class NewUserAction implements Action {
    public type: string = UserManagementTypes.NEW_USER;
    constructor(public payload?: any) {}
}

export class NewUserErrorAction implements Action {
    public type: string = UserManagementTypes.NEW_USER_ERROR;
    constructor(public payload?: any) {}
}

export class NewUserSuccessAction implements Action {
    public type: string = UserManagementTypes.NEW_USER_SUCCESS;
    constructor(public payload?: any) {}
}

export class UpdateUserAction implements Action {
    public type: string = UserManagementTypes.UPDATE_USER;
    constructor(public payload?: any) {}
}

export class UpdateUserErrorAction implements Action {
    public type: string = UserManagementTypes.UPDATE_USER_ERROR;
    constructor(public payload?: any) {}
}

export class UpdateUserSuccessAction implements Action {
    public type: string = UserManagementTypes.UPDATE_USER_SUCCESS;
    constructor(public payload?: any) {}
}

export class FetchUserAction implements Action {
    public type: string = UserManagementTypes.FETCH_USER;
    constructor(public payload?: any) {}
}

export class FetchUserErrorAction implements Action {
    public type: string = UserManagementTypes.FETCH_USER_ERROR;
    constructor(public payload?: any) {}
}

export class FetchUserSuccessAction implements Action {
    public type: string = UserManagementTypes.FETCH_USER_SUCCESS;
    constructor(public payload?: any) {}
}

export type UserManagementAcctions =
    NewUserAction |
    NewUserErrorAction |
    NewUserSuccessAction |
    UpdateUserAction |
    UpdateUserErrorAction |
    UpdateUserSuccessAction |
    FetchUserAction |
    FetchUserErrorAction |
    FetchUserSuccessAction;
