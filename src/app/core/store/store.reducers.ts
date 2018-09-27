import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { createSelector } from 'reselect';

import * as AuthorizationReducers from './authorization/authorization.reducers';
import * as ApplicationReducers from './application/application.reducers';
import * as ContentReducers from './content/content.reducers';

export interface State {
    router: RouterReducerState,
    authorization: AuthorizationReducers.AuthorizationState,
    application: ApplicationReducers.ApplicationState,
    content: ContentReducers.ContentState 
}

export const FgeReducers: ActionReducerMap<State> ={
  router: routerReducer,
  authorization: AuthorizationReducers.reducer,
  application: ApplicationReducers.reducer,
  content: ContentReducers.reducer
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

/**********************************************************
 * Application Reducers
 *********************************************************/
export const getApplicationState = (state: State) => {
  return state.application;
}
export const getApplicationInfo = createSelector(getApplicationState, ApplicationReducers.getApplicationInfo);
export const getApplicationBranding = createSelector(getApplicationState, ApplicationReducers.getApplicationBranding);
export const isLoadingApplicationData = createSelector(getApplicationState, ApplicationReducers.isLoadingApplicationData);

/**********************************************************
 * Content Reducers
 *********************************************************/
export const getContentState = (state: State) => {
  return state.content
}
export const isLoadingGroups = createSelector(getContentState, ContentReducers.isLoadingGroups);
export const getGroups = createSelector(getContentState, ContentReducers.getGroups);