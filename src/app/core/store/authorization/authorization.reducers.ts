import _assign from 'lodash/assign';

import { AuthorizationActions, AuthorizationActionTypes } from "./authorization.actions";
import { User } from "../../models";
import { mapLinks } from "../util";

export interface AuthorizationState {
  authenticated: boolean;
  error?: string;
  loaded: boolean;
  loading: boolean;
  user?: User;
  creatingUser: boolean;
  createdUser: boolean;
}

export interface NewUserState {
  creatingUser: boolean;
  createdUser: boolean;
  error?: string;
}

const initialState: AuthorizationState = {
  authenticated: null,
  loaded: false,
  loading: false,
  creatingUser: false,
  createdUser: false
};

export function reducer(state: any = initialState, action: AuthorizationActions): AuthorizationState {
  switch (action.type) {
    case AuthorizationActionTypes.AUTHENTICATE:
      return _assign({}, state, {
        error: undefined,
        loading: true
      });

    case AuthorizationActionTypes.AUTHENTICATED_ERROR:
      return _assign({}, state, {
        authenticated: false,
        error: action.payload.error.message,
        loaded: true
      });

    case AuthorizationActionTypes.AUTHENTICATED_SUCCESS:
      return _assign({}, state, {
        authenticated: action.payload.authenticated,
        loaded: true,
        user: action.payload.user
      });

    case AuthorizationActionTypes.AUTHENTICATE_ERROR:
      return _assign({}, state, {
        authenticated: false,
        error: action.payload.error.message,
        loading: false
      });

    case AuthorizationActionTypes.AUTHENTICATE_SUCCESS:
      const user: User = action.payload.user;

      if (user === null) {
        return state;
      }
      return _assign({}, state, {
        authenticated: true,
        error: undefined,
        loading: false,
        user: { ...user, actions: mapLinks(user._links) }
      });

    case AuthorizationActionTypes.LOGOUT_SUCCESS: {
      return _assign({}, state, initialState);
    }

    case AuthorizationActionTypes.NEW_USER:
      return Object.assign({}, state, {
        error: undefined,
        creatingUser: true
      });

    case AuthorizationActionTypes.NEW_USER_ERROR:
      return Object.assign({}, state, {
        createdUser: false,
        error: action.payload.error
      });

    case AuthorizationActionTypes.NEW_USER_SUCCESS:
      return Object.assign({}, state, {
        createdUser: true
      });

    default:
      return state;
  }
}

/**
 * Returns true if the user is authenticated.
 * @function isAuthenticated
 * @param {State} state
 * @returns {boolean}
 */
export const isAuthenticated = (state: AuthorizationState) => state.authenticated;

/**
 * Returns true if the authenticated has loaded.
 * @function isAuthenticatedLoaded
 * @param {State} state
 * @returns {boolean}
 */
export const isAuthenticatedLoaded = (state: AuthorizationState) => state.loaded;

/**
 * Return the users state
 * @function getAuthenticatedUser
 * @param {State} state
 * @returns {User}
 */
export const getAuthenticatedUser = (state: AuthorizationState) => state.user;

/**
 * Returns the authentication error.
 * @function getAuthenticationError
 * @param {State} state
 * @returns {Error}
 */
export const getAuthenticationError = (state: AuthorizationState) => state.error;

/**
 * Returns true if request is in progress.
 * @function isLoading
 * @param {State} state
 * @returns {boolean}
 */
export const isLoading = (state: AuthorizationState) => state.loading;

/**
 * Returns the sign out error.
 * @function getSignOutError
 * @param {State} state
 * @returns {Error}
 */
export const getLogoutError = (state: AuthorizationState) => state.error;

/**
 * Returns true if request is in progress.
 * @function isNewUserCreating
 * @param {State} state
 * @returns {boolean}
 */
export const isNewUserCreating = (state: AuthorizationState) => state.creatingUser;
​
/**
 * Returns true if the password has reseted.
 * @function isNewUserCreated
 * @param {State} state
 * @returns {boolean}
 */
export const isNewUserCreated = (state: AuthorizationState) => state.createdUser;
​
/**
 * Returns the reset password error.
 * @function getNewUserError
 * @param {State} state
 * @returns {Error}
 */
export const getNewUserError = (state: AuthorizationState) => state.error;

