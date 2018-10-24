import { Action } from '@ngrx/store';

import { ActionType } from '../util';
import { User, UserCredentials, UserToken } from '../../models';

export const AuthorizationActionTypes = {
    AUTHENTICATE: ActionType('AUTHENTICATE'),
    AUTHENTICATED: ActionType('AUTHENTICATED'),
    AUTHENTICATED_SUCCESS: ActionType('AUTHENTICATED_SUCCESS'),
    AUTHENTICATED_ERROR: ActionType('AUTHENTICATED_ERROR'),
    AUTHENTICATE_ERROR: ActionType('AUTHENTICATE_ERROR'),
    AUTHENTICATE_SUCCESS: ActionType('AUTHENTICATE_SUCCESS'),
    LOGOUT: ActionType('LOGOUT'),
    LOGOUT_SUCCESS: ActionType('LOGOUT_SUCCESS'),
    NEW_USER: ActionType('NEW_USER'),
    NEW_USER_SUCCESS: ActionType('NEW_USER_SUCCESS'),
    NEW_USER_ERROR: ActionType('NEW_USER_ERROR')
}

export class AuthenticateAction implements Action {
    public type: string = AuthorizationActionTypes.AUTHENTICATE;
    constructor(public payload: UserCredentials) {}
}

export class AuthenticatedAction implements Action {
    public type: string = AuthorizationActionTypes.AUTHENTICATED;
    constructor(public payload?: { token?: UserToken }) {}
}

export class AuthenticatedSuccessAction implements Action {
    public type: string = AuthorizationActionTypes.AUTHENTICATED_SUCCESS;
    constructor(public payload: { authenticated: boolean, user: User }) {}
}

export class AuthenticatedErrorAction implements Action {
    public type: string = AuthorizationActionTypes.AUTHENTICATED_ERROR;
    constructor(public payload?: any) {}
}

export class AuthenticationErrorAction implements Action {
    public type: string = AuthorizationActionTypes.AUTHENTICATE_ERROR;
    constructor(public payload?: any) {}
}

export class AuthenticationSuccessAction implements Action {
    public type: string = AuthorizationActionTypes.AUTHENTICATE_SUCCESS;
    constructor(public payload: { user: User }) {}
}

export class LogoutAction implements Action {
    public type: string = AuthorizationActionTypes.LOGOUT;
    constructor(public payload?: any) {}
}

export class LogoutErrorAction implements Action {
    public type: string = AuthorizationActionTypes.LOGOUT_SUCCESS;
    constructor(public payload?: any) {}
}

export class LogoutSuccessAction implements Action {
    public type: string = AuthorizationActionTypes.LOGOUT_SUCCESS;
    constructor(public payload?: any) {}
}

export class NewUserAction implements Action {
    public type: string = AuthorizationActionTypes.NEW_USER;
    constructor(public payload?: any) {}
}

export class NewUserErrorAction implements Action {
    public type: string = AuthorizationActionTypes.NEW_USER_ERROR;
    constructor(public payload?: any) {}
}

export class NewUserSuccessAction implements Action {
    public type: string = AuthorizationActionTypes.NEW_USER_SUCCESS;
    constructor(public payload?: any) {}
}

export type AuthorizationActions = 
    AuthenticateAction |
    AuthenticatedAction |
    AuthenticatedSuccessAction | 
    AuthenticatedErrorAction |
    AuthenticationErrorAction |
    AuthenticationSuccessAction |
    LogoutAction |
    LogoutErrorAction |
    LogoutSuccessAction |
    NewUserAction |
    NewUserErrorAction |
    NewUserSuccessAction;