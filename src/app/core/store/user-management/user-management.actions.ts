/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';

export const UserManagementTypes = {
    NEW_USER: ActionType('NEW_USER'),
    NEW_USER_SUCCESS: ActionType('NEW_USER_SUCCESS'),
    NEW_USER_ERROR: ActionType('NEW_USER_ERROR')
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
export type UserManagementAcctions =
    NewUserAction |
    NewUserErrorAction |
    NewUserSuccessAction;
