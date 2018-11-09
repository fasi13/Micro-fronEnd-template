import _assign from 'lodash/assign';

// import { NewUser, UpdateUser } from '../../models';
import { UserManagementTypes, UserManagementAcctions } from './user-management.actions';

export interface UserManagementStade {
    loaded: boolean;
    loading: boolean;
    creatingUser: boolean;
    createdUser: boolean;
    updatingUser: boolean;
    updatedUser: boolean;
    fetchingUsers: boolean;
    fetchedUsers: boolean;
    error?: string;
}

const initialState: UserManagementStade = {
    loaded: false,
    loading: false,
    creatingUser: false,
    createdUser: false,
    updatingUser: false,
    updatedUser: false,
    fetchingUsers: false,
    fetchedUsers: false
};

export function reducer(state: any = initialState, action: UserManagementAcctions): UserManagementStade {
    switch (action.type) {
        case UserManagementTypes.NEW_USER:
          return Object.assign({}, state, {
            error: undefined,
            creatingUser: true
          });

        case UserManagementTypes.NEW_USER_ERROR:
          return Object.assign({}, state, {
            createdUser: false,
            error: action.payload.error
          });

        case UserManagementTypes.NEW_USER_SUCCESS:
          return Object.assign({}, state, {
            createdUser: true
          });
          case UserManagementTypes.UPDATE_USER:
          return Object.assign({}, state, {
            error: undefined,
            updatingUser: true
          });

        case UserManagementTypes.UPDATE_USER_ERROR:
          return Object.assign({}, state, {
            updatedUser: false,
            error: action.payload.error
          });

        case UserManagementTypes.UPDATE_USER_SUCCESS:
          return Object.assign({}, state, {
            updatedUser: true
          });

          case UserManagementTypes.NEW_USER_SUCCESS:
          return Object.assign({}, state, {
            createdUser: true
          });
          case UserManagementTypes.FETCH_USER:
          return Object.assign({}, state, {
            error: undefined,
            fetchingUser: true
          });

        case UserManagementTypes.FETCH_USER_ERROR:
          return Object.assign({}, state, {
            fetchedUsers: false,
            error: action.payload.error
          });

        case UserManagementTypes.FETCH_USER_SUCCESS:
          return Object.assign({}, state, {
            fetchedUsers: true
          });
        default:
          return state;
      }
}

/**
 * Returns true if request is in progress.
 * @function isNewUserCreating
 * @param {State} state
 * @returns {boolean}
 */
export const isNewUserCreating = (state: UserManagementStade) => state.creatingUser;
​
/**
 * Returns true if the password has reseted.
 * @function isNewUserCreated
 * @param {State} state
 * @returns {boolean}
 */
export const isNewUserCreated = (state: UserManagementStade) => state.createdUser;
​
/**
 * Returns the reset password error.
 * @function getNewUserError
 * @param {State} state
 * @returns {Error}
 */
export const getNewUserError = (state: UserManagementStade) => state.error;

/**
 * Returns true if request is in progress.
 * @function isUserUpdating
 * @param {State} state
 * @returns {boolean}
 */
export const isUserUpdating = (state: UserManagementStade) => state.updatingUser;
​
/**
 * Returns true if the password has reseted.
 * @function isUserUpdated
 * @param {State} state
 * @returns {boolean}
 */
export const isUserUpdated = (state: UserManagementStade) => state.updatedUser;
​
/**
 * Returns the reset password error.
 * @function getUserUpdateError
 * @param {State} state
 * @returns {Error}
 */
export const getUserUpdateError = (state: UserManagementStade) => state.error;

/**
 * Returns true if request is in progress.
 * @function isUserFetching
 * @param {State} state
 * @returns {boolean}
 */
export const isUserFetching = (state: UserManagementStade) => state.fetchingUsers;
​
/**
 * Returns true if the password has reseted.
 * @function isFetchUsers
 * @param {State} state
 * @returns {boolean}
 */
export const isFetchedUsers = (state: UserManagementStade) => state.fetchedUsers;
​
/**
 * Returns the reset password error.
 * @function getUsersError
 * @param {State} state
 * @returns {Error}
 */
export const getUsersError = (state: UserManagementStade) => state.error;
