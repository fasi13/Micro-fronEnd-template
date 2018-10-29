import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';
import { createSelector } from 'reselect';

import * as AuthorizationReducers from './authorization/authorization.reducers';
import * as ApplicationReducers from './application/application.reducers';
import * as ContentReducers from './content/content.reducers';
import * as UserManagementReducers from './user-management/user.management.reducers';

export interface State {
    router: RouterReducerState;
    authorization: AuthorizationReducers.AuthorizationState;
    application: ApplicationReducers.ApplicationState;
    content: ContentReducers.ContentState;
    userManagement: UserManagementReducers.UserManagementStade;
}

export const FgeReducers: ActionReducerMap<State> = {
  router: routerReducer,
  authorization: AuthorizationReducers.reducer,
  application: ApplicationReducers.reducer,
  content: ContentReducers.reducer,
  userManagement: UserManagementReducers.reducer
};

/**********************************\
 * ************************
 * Authorization Reducers
 *********************************************************/
export const getAuthorizationState = (state: State) => {
  return state.authorization;
};
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
};
export const getApplicationInfo = createSelector(getApplicationState, ApplicationReducers.getApplicationInfo);
export const getApplicationBranding = createSelector(getApplicationState, ApplicationReducers.getApplicationBranding);
export const getApplicationPath = createSelector(getApplicationState, ApplicationReducers.getApplicationPath);
export const isLoadingApplicationData = createSelector(getApplicationState, ApplicationReducers.isLoadingApplicationData);
export const isLoadingSearchApplication = createSelector(getApplicationState, ApplicationReducers.isLoadingSearchApplication);
export const getSearchApplicationList = createSelector(getApplicationState, ApplicationReducers.getSearchApplicationList);
export const isLoadingDataTypes = createSelector(getApplicationState, ApplicationReducers.isLoadingDataTypes);
export const getDataTypes = createSelector(getApplicationState, ApplicationReducers.getDataTypes);

/**********************************************************
 * Content Reducers
 *********************************************************/
export const getContentState = (state: State) => {
  return state.content;
}
export const isLoadingGroups = createSelector(getContentState, ContentReducers.isLoadingGroups);
export const getGroups = createSelector(getContentState, ContentReducers.getGroups);
export const isLoadingGroup = createSelector(getContentState, ContentReducers.isLoadingGroup);
export const getGroup = createSelector(getContentState, ContentReducers.getGroup);
export const getContentRecordState = createSelector(getContentState, ContentReducers.getRecordState);

/**********************************************************
 * User Management Reducers
 *********************************************************/
export const isNewUserCreating = createSelector(getAuthorizationState, UserManagementReducers.isNewUserCreating);
export const isNewUserCreated = createSelector(getAuthorizationState, UserManagementReducers.isNewUserCreated);
export const getNewUserError = createSelector(getAuthorizationState, UserManagementReducers.getNewUserError);
