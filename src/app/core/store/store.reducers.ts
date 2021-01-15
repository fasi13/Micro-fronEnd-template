import { RouterReducerState, routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, Action, ActionReducer } from '@ngrx/store';
import { createSelector } from 'reselect';

import * as AuthorizationReducers from './authorization/authorization.reducers';
import * as ApplicationReducers from './application/application.reducers';
import * as ContentReducers from './content/content.reducers';
import * as UserReducers from './user/user.reducers';
import * as ResetPasswordReducers from './reset-password/reset-password.reducers';
import * as ReportReducers from './report/report.reducers';

import * as CultureReducers from './culture/culture.reducers';
import { AuthorizationActionTypes } from './authorization/authorization.actions';
import { StoreActionTypes } from './store.actions';

export interface State {
  router: RouterReducerState;
  authorization: AuthorizationReducers.AuthorizationState;
  application?: ApplicationReducers.ApplicationState;
  content?: ContentReducers.ContentState;
  user?: UserReducers.UserState;
  resetPassword?: ResetPasswordReducers.ResetPasswordState;
  report?: ReportReducers.ReportState;
  culture?: CultureReducers.CultureState;
}

export const FgeReducers: ActionReducerMap<State> = {
  router: routerReducer,
  authorization: AuthorizationReducers.reducer,
  application: ApplicationReducers.reducer,
  content: ContentReducers.reducer,
  user: UserReducers.reducer,
  resetPassword: ResetPasswordReducers.reducer,
  report: ReportReducers.reducer,
  culture: CultureReducers.reducer,
};

export const TestInitialState: State = {
  authorization: {authenticated: null,
    loaded: false,
    loading: false},
  router: {state: null, navigationId: null},
  application: { current: {
    info: null,
    branding: null,
    loading: false,
  },
  search: {
    data: null,
    loading: false
  },
  types: {
    data: null,
    loading: false
  },
  path: {
    data: null,
    loading: false
  },
  preview: {
    branding: null,
    loading: false
  }},
  content: { groups: {
    loading: false,
    items: null
  },
  group: {
    loading: false,
    data: null
  },
  content: {
    loading: false,
    data: null
  },
  record: {
    loading: false,
    error: null
  },
  action: {
    loading: false,
    error: null
  },
  contentGroup: {
    loading: false,
    error: null
  }},
  report: {audit: {
    loading: false,
    items: null,
    filters: null,
    sort: null
  }},
  resetPassword: { resetPassword: {
    loading: false,
    error: null
  }},

  user: { users: {
    loading: false,
    items: null,
    error: null
  },
  user: {
    loading: false,
    data: null,
    error: null
  },
  roles: {
    loading: false,
    items: null,
    error: null,
    selected: {
      loading: true
    }
  }},

  };

/**********************************************************
 * Meta Reducers
 *********************************************************/
export function clearStateOnLogout(
  reducer: ActionReducer<State>
): ActionReducer<State> {
  return function(state: State, action: Action): State {
    if (action.type === AuthorizationActionTypes.LOGOUT_SUCCESS) {
      state = undefined;
    }
    return reducer(state, action);
  };
}

export function clearStoredData(
  reducer: ActionReducer<State>
): ActionReducer<State> {
  return function(state: State, action: Action): State {
    if (action.type === StoreActionTypes.CLEAR_STORED_DATA) {
      state = Object.assign(state, {
        content: ContentReducers.initialState,
        user: UserReducers.initialState,
        culture: CultureReducers.initialState
      });
    }
    return reducer(state, action);
  };
}

/**********************************************************
 * Authorization Reducers
 *********************************************************/
export const getAuthorizationState = (state: State) => {
  return state.authorization;
};
export const getAuthenticatedUser = createSelector(
  getAuthorizationState,
  AuthorizationReducers.getAuthenticatedUser
);
export const getAuthenticationError = createSelector(
  getAuthorizationState,
  AuthorizationReducers.getAuthenticationError
);
export const isAuthenticated = createSelector(
  getAuthorizationState,
  AuthorizationReducers.isAuthenticated
);
export const isAuthenticatedLoaded = createSelector(
  getAuthorizationState,
  AuthorizationReducers.isAuthenticatedLoaded
);
export const isAuthenticationLoading = createSelector(
  getAuthorizationState,
  AuthorizationReducers.isLoading
);
export const getLogoutError = createSelector(
  getAuthorizationState,
  AuthorizationReducers.getLogoutError
);

/**********************************************************
 * Application Reducers
 *********************************************************/
export const getApplicationState = (state: State) => {
  return state.application;
};
export const getApplicationInfo = createSelector(
  getApplicationState,
  ApplicationReducers.getApplicationInfo
);
export const getApplicationBranding = createSelector(
  getApplicationState,
  ApplicationReducers.getApplicationBranding
);
export const getApplicationPath = createSelector(
  getApplicationState,
  ApplicationReducers.getApplicationPath
);
export const isLoadingApplicationData = createSelector(
  getApplicationState,
  ApplicationReducers.isLoadingApplicationData
);
export const isLoadingSearchApplication = createSelector(
  getApplicationState,
  ApplicationReducers.isLoadingSearchApplication
);
export const getSearchApplicationList = createSelector(
  getApplicationState,
  ApplicationReducers.getSearchApplicationList
);
export const isLoadingDataTypes = createSelector(
  getApplicationState,
  ApplicationReducers.isLoadingDataTypes
);
export const getDataTypes = createSelector(
  getApplicationState,
  ApplicationReducers.getDataTypes
);
export const getApplicationPreview = createSelector(
  getApplicationState,
  ApplicationReducers.getApplicationPreview
);

/**********************************************************
 * Content Reducers
 *********************************************************/
export const getContentState = (state: State) => {
  return state.content;
};
export const isLoadingGroups = createSelector(
  getContentState,
  ContentReducers.isLoadingGroups
);
export const getGroups = createSelector(
  getContentState,
  ContentReducers.getGroups
);
export const isLoadingGroup = createSelector(
  getContentState,
  ContentReducers.isLoadingGroup
);
export const getGroup = createSelector(
  getContentState,
  ContentReducers.getGroup
);
export const isLoadingContent = createSelector(
  getContentState,
  ContentReducers.isLoadingContent
);
export const getContent = createSelector(
  getContentState,
  ContentReducers.getContent
);
export const getContentRecordState = createSelector(
  getContentState,
  ContentReducers.getRecordState
);
export const getContentActionState = createSelector(
  getContentState,
  ContentReducers.getActionState
);
export const getContentGroupState = createSelector(
  getContentState,
  ContentReducers.getContentGroupState
);

/**********************************************************
 * User Reducers
 *********************************************************/
export const getUserState = (state: State) => {
  return state.user;
};
export const isLoadingUser = createSelector(
  getUserState,
  UserReducers.isLoadingUser
);
export const getUsersState = createSelector(
  getUserState,
  UserReducers.getUsersState
);
export const getUsers = createSelector(
  getUserState,
  UserReducers.getUsers
);
export const getUserRecordState = createSelector(
  getUserState,
  UserReducers.getUserState
);
export const getRoles = createSelector(
  getUserState,
  UserReducers.getRoles
);
export const getRoleActionState = createSelector(
  getUserState,
  UserReducers.getRoleActionState
);

/**********************************************************
 * Reset password Reducers
 *********************************************************/
export const getResetPasswordState = (state: State) => {
  return state.resetPassword;
};
export const isResetPasswordLoading = createSelector(
  getResetPasswordState,
  ResetPasswordReducers.isResetPasswordLoading
);
export const getResetedPassword = createSelector(
  getResetPasswordState,
  ResetPasswordReducers.getResetPassword
);

/**********************************************************
 * Report Reducers
 *********************************************************/
export const getReportState = (state: State) => state.report;
export const isAuditLoading = createSelector(
  getReportState,
  ReportReducers.isAuditLoading
);
export const getAuditData = createSelector(
  getReportState,
  ReportReducers.getAuditData
);
export const getAuditState = createSelector(
  getReportState,
  ReportReducers.getAuditState
);



/**********************************************************
 * Culture Reducers
 *********************************************************/
export const getCultureState = (state: State) => state.culture;
export const getCurrentCulture = createSelector(
   getCultureState,
   CultureReducers.getCurrentCulture
);

export const getAvailableCultures = createSelector(
   getCultureState,
   CultureReducers.getAvailableCultures
);

