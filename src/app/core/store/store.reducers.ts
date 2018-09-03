import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { createSelector } from 'reselect';

import * as AuthorizationReducers from './authorization/authorization.reducers';

export interface State {
    router: RouterReducerState,
    authorization: AuthorizationReducers.AuthorizationState
}

export const FgeReducers: ActionReducerMap<State> ={
  router: routerReducer,
  authorization: AuthorizationReducers.reducer
}

/**********************************************************
 * Authorization Reducers
 *********************************************************/
export const getAuthorizationState = (state: State) => {
  return state.authorization;
}
export const getAuthenticatedUser = createSelector(getAuthorizationState, AuthorizationReducers.getAuthenticatedUser);
export const getAuthenticationError = createSelector(getAuthorizationState, AuthorizationReducers.getAuthenticationError);
export const isAuthenticated = createSelector(getAuthorizationState, AuthorizationReducers.isAuthenticated);
export const isAuthenticatedLoaded = createSelector(getAuthorizationState, AuthorizationReducers.isAuthenticatedLoaded);
export const isAuthenticationLoading = createSelector(getAuthorizationState, AuthorizationReducers.isLoading);
export const getLogoutError = createSelector(getAuthorizationState, AuthorizationReducers.getLogoutError);
