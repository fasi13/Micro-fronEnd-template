import { AuthorizationActions, ActionTypes } from "./authorization.actions";
import { User } from "../../models";
import { mapLinks } from "../util";

export interface AuthorizationState {
  authenticated: boolean;
  error?: string;
  loaded: boolean;
  loading: boolean;
  user?: User;
}

const initialState: AuthorizationState = {
  authenticated: null,
  loaded: false,
  loading: false
};

export function reducer(state: any = initialState, action: AuthorizationActions): AuthorizationState {
  switch (action.type) {
    case ActionTypes.AUTHENTICATE:
      return Object.assign({}, state, {
        error: undefined,
        loading: true
      });

    case ActionTypes.AUTHENTICATED_ERROR:
      return Object.assign({}, state, {
        authenticated: false,
        error: action.payload.error.message,
        loaded: true
      });

    case ActionTypes.AUTHENTICATED_SUCCESS:
      return Object.assign({}, state, {
        authenticated: action.payload.authenticated,
        loaded: true,
        user: action.payload.user
      });

    case ActionTypes.AUTHENTICATE_ERROR:
      return Object.assign({}, state, {
        authenticated: false,
        error: action.payload.error.message,
        loading: false
      });

    case ActionTypes.AUTHENTICATE_SUCCESS:
      const user: User = action.payload.user;

      if (user === null) {
        return state;
      }
      return Object.assign({}, state, {
        authenticated: true,
        error: undefined,
        loading: false,
        user: { ...user, actions: mapLinks(user._links) }
      });

    case ActionTypes.LOGOUT_SUCCESS: {
      return Object.assign({}, state, initialState);
    }

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
